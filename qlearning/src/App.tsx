import type { Component } from 'solid-js';
// import type { Vec2  as Vec2Type } from 'planck';
import { onCleanup, onMount } from 'solid-js';
import * as planck from 'planck';
import { Vec2 } from 'planck';


const App: Component = (props) => {
  let canvasRef: HTMLCanvasElement | undefined = undefined;
  let frame: number;
  let x: number = 0;
  let lastTime: number = 0;
  const FPS: number = 60;
  const ratio: number = 10;
  let circlePos: [number, number] = [10.0, 20.0];
  let radius: number = 1.0;
  let frameSize: [number, number] = [50.0, 50.0];
  // let ball: {body: anyType, vel: Vec2, pos: Vec2} ;
  let balls: any = [];
  let player: any = null;
  let playerRadius: number = radius * 2;


  // const gravity = planck.Vec2(0.0, 50.0);

  const world = new planck.World(planck.Vec2(0, 0));

  // const groundBody = world.createBody();


  // create borders
  world.createBody().createFixture(planck.Edge(Vec2(0, frameSize[1]), Vec2(frameSize[0], frameSize[1])))
  world.createBody().createFixture(planck.Edge(Vec2(frameSize[0], 0), Vec2(frameSize[0], frameSize[1])))
  world.createBody().createFixture(planck.Edge(Vec2(0, 0), Vec2(0, frameSize[1])))
  world.createBody().createFixture(planck.Edge(Vec2(0, 0), Vec2(frameSize[0], 0)))

  // Define fixtures with a shape, friction, density, etc.
  // Create fixtures on the body.
  //create the dynamic body (moving / non static)

  function createBall(toWorld, userData) {
    // const body = toWorld.createDynamicBody(Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())))
    // const body = toWorld.createKinematicBody(Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())))
    const body = toWorld.createDynamicBody({
      position: Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())),
      linearVelocity: Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10),
      userData: userData
    })

    const dynamicCircle = planck.Circle(radius);

    body.createFixture(dynamicCircle, {
      density: 1,
      friction: 0,
      filterGroupIndex: -1, // dont interact with each other.
      restitution: 1
    });

    // body.setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10))
    // body.setUserData(i);
    return body
  }

  function createSensor(toWorld) {
    // const body = toWorld.createDynamicBody(Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())))
    // const body = toWorld.createKinematicBody(Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())))
    //
    const body = toWorld.createDynamicBody({
      position: Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())),
      linearDamping: 1,
      userData: -1
    })

    const dynamicCircle = planck.Circle(playerRadius);

    body.createFixture(dynamicCircle, {
      density: 0,
      friction: 0,
      isSensor: true, // doesnt collide with other but still collects info.
      restitution: 1
    });

    const dynamicCore = planck.Circle(playerRadius / 4);

    body.createFixture(dynamicCore, {
      density: 0,
      friction: 0,
      restitution: 0
    });

    // body.setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10))
    return body
  }


  // get collisions
  world.on('begin-contact', contact => {
    // console.log(contact.m_fixtureA.m_isSensor);
    // console.log(contact.m_fixtureB.m_isSensor);
    // console.log(contact['m_fixtureA']);
    if (contact.m_fixtureB.m_isSensor && contact.m_fixtureA.m_body.m_type === 'dynamic') {

    } else if (contact.m_fixtureA.m_isSensor && contact.m_fixtureB.m_body.m_type === 'dynamic') {
      // console.log('contact');
      // console.log(contact.m_fixtureB);
      // balls[contact.m_fixtureB.m_body.userData].setPosition(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random()))
    }
  });

  for (let i = 0; i < 10; i++) {
    balls.push(createBall(world, i));
  }


  player = createSensor(world);
  console.log(player)

  document.addEventListener('keydown', e => {
    // console.log(e)
    switch (e.key) {
      case "ArrowRight": {
        // console.log("arrow right")
        player.applyLinearImpulse(Vec2(10, 0), player.getPosition());
        break;
      }
      case "ArrowLeft": {
        // console.log("arrow left")
        // player.applyForceToCenter(Vec2(-100, 0));
        player.applyLinearImpulse(Vec2(-10, 0), player.getPosition());
        break;
      }
      case "ArrowDown": {
        // console.log("arrow down")
        // player.applyForceToCenter(Vec2(0, 100));
        player.applyLinearImpulse(Vec2(0, 10), player.getPosition());
        break;
      }
      case "ArrowUp": {
        // console.log("arrow up")
        // player.applyForceToCenter(Vec2(0, -100));
        player.applyLinearImpulse(Vec2(0, -10), player.getPosition());
        break;
      }
    }
  })

  // balls.push(createBall(world));
  // done initalization, next simulation.

  // simulation

  const timestep = 1 / FPS;

  const velocityIterations = 8;
  const positionIterations = 3;


  const draw = (time: number) => {
    const ctx = canvasRef?.getContext("2d") ?? null;
    // ctx.fillstyle = "green";

    // console.log('here')
    if (ctx) {
      // ctx.fillstyle = "#028888";
      x = x === FPS ? 0 : x;
      if (time > lastTime + (1000 / FPS)) {
        //
        // clear screen
        ctx.clearRect(0, 0, frameSize[0] * ratio, frameSize[1] * ratio);
        // ctx.beginPath();

        var contact = player.getContactList();
        if (contact && contact.contact.m_fixtureA.m_body.m_type === 'dynamic' && contact.contact.m_fixtureB.m_body.m_type === 'dynamic') {
            // console.log(contact);
          if (contact.contact.m_fixtureB.m_isSensor) {
            // console.log('here');
            // balls[contact.m_fixtureA.m_body.m_userData].setTransform(Vec2(0, 0), 0);
            // console.log('relocate', bodynum, balls[bodynum]);
            // balls[bodynum].setActive(false);
            var bodynum = contact.contact.m_fixtureA.m_body.m_userData;
            balls[bodynum].setPosition(Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())));
            // world.destroyBody(balls[bodynum]);


          } else if (contact.contact.m_fixtureA.m_isSensor) {
            // balls[contact.contact.m_fixtureB.m_body.m_userData].setTransform(Vec2(0, 0), 0);
            var bodynum = contact.contact.m_fixtureB.m_body.m_userData;
            balls[bodynum].setPosition(Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())));

            // var bodynum = contact.contact.m_fixtureA.m_body.m_userData;
            // console.log('relocate', bodynum, balls[bodynum]);
          }

        }

        // run next step in simulation.
        world.step(timestep, velocityIterations, positionIterations);

        // display balls
        balls.forEach((ball) => {
          ctx.beginPath();

          circlePos = [ball.getPosition().x, ball.getPosition().y]
          // console.log(circlePos, ball.getLinearVelocity());
          // console.log(body.getPosition(), body.getAngle());
          ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, radius * ratio, 0, 2 * Math.PI, false);

          // ctx.stroke();
          ctx.fill();
        })

        // display player
        ctx.beginPath();
        circlePos = [player.getPosition().x, player.getPosition().y]
        ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, playerRadius * ratio, 0, 2 * Math.PI, false);
        ctx.stroke();
        // ctx.fill();

        frame = requestAnimationFrame(draw)
        x++;
        // console.log('frame:', frame, x);
      }
    }

  };

  onMount(() => {
    frame = requestAnimationFrame(draw);
    console.log('frame:', frame);
    onCleanup(() => cancelAnimationFrame(frame));
  })

  return (
    <div>
      <canvas ref={canvasRef} width={frameSize[0] * ratio} height={frameSize[1] * ratio}
        style={{
          /* backgroundColor: "#134959", */
          border: "1px solid #d3d3d3"
        }}
      />
    </div>
  );
};

export default App;
