import type { Component } from 'solid-js';
// import type { Vec2  as Vec2Type } from 'planck';
import { onCleanup, onMount } from 'solid-js';
import * as planck from 'planck';
import { Vec2 } from 'planck';
import { Model } from './Model';


const App: Component = (props) => {
  let canvasRef: HTMLCanvasElement | undefined = undefined;
  let frame: number;
  let x: number = 0;
  let lastTime: number = 0;
  const FPS: number = 60;
  const ratio: number = 10;
  let circlePos: [number, number] = [10.0, 20.0];
  let ballRadius: number = 1.0;
  let frameSize: [number, number] = [50.0, 50.0];
  // let ball: {body: anyType, vel: Vec2, pos: Vec2} ;
  let balls: any = [];
  let velMag: number = 20;
  let numBalls: number = 10;
  let player: any = null;
  let playerRadius: number = ballRadius * 1.5;
  let playerCoreRadius: number = ballRadius * 0.5;
  let playerDetectionRadius: number = ballRadius * 7;
  let detectedballs: any = [];

  enum userData {
    detectionCircle = 'detectionCircle',
    feedingCircle = 'feedingCircle'
  }
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
      position: Vec2(ballRadius + ((frameSize[0] - ballRadius - ballRadius) * Math.random()), ballRadius + ((frameSize[1] - ballRadius - ballRadius) * Math.random())),
      linearVelocity: Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10),
      userData: userData
    })

    const dynamicCircle = planck.Circle(ballRadius);

    body.createFixture(dynamicCircle, {
      density: 1,
      friction: 0,
      filterGroupIndex: -1, //dont interact with each other balls.
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
      // linearDamping: 1,
      userData: -1
    })


    // detection range
    const dynamicDetectionCircle = planck.Circle(playerDetectionRadius);
    body.createFixture(dynamicDetectionCircle, {
      density: 0,
      friction: 0,
      isSensor: true, // doesnt collide with other but still collects info.
      restitution: 1,
      userData: userData.detectionCircle
    });

    // feeding range
    const dynamicCircle = planck.Circle(playerRadius);
    body.createFixture(dynamicCircle, {
      density: 0,
      friction: 0,
      isSensor: true, // doesnt collide with other but still collects info.
      restitution: 1,
      userData: userData.feedingCircle
    });

    // prevent player from leaving the map.
    const dynamicCore = planck.Circle(playerCoreRadius);
    body.createFixture(dynamicCore, {
      density: 0,
      friction: 0,
      restitution: 0
    });

    // body.setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10))
    return body
  }


  // get collisions
  // world.on('begin-contact', contact => {
  //   // console.log(contact.m_fixtureA.m_isSensor);
  //   // console.log(contact.m_fixtureB.m_isSensor);
  //   // console.log(contact['m_fixtureA']);
  //   if (contact.m_fixtureB.m_isSensor && contact.m_fixtureA.m_body.m_type === 'dynamic') {

  //   } else if (contact.m_fixtureA.m_isSensor && contact.m_fixtureB.m_body.m_type === 'dynamic') {
  //     // console.log('contact');
  //     // console.log(contact.m_fixtureB);
  //     // balls[contact.m_fixtureB.m_body.userData].setPosition(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random()))
  //   }
  // });

  // create all the partiles
  for (let i = 0; i < numBalls; i++) {
    balls.push(createBall(world, i));
  }


  // create player
  player = createSensor(world);
  // console.log(player)


  function setPlayerVel(dir, status) {
    switch (dir) {
      case "ArrowRight": {
        // console.log("arrow right")
        if (status === 'on') {
          player.setLinearVelocity(Vec2(velMag, player.getLinearVelocity().y), player.getPosition());
        } else if (status === 'off') {
          player.setLinearVelocity(Vec2(0, player.getLinearVelocity().y), player.getPosition());
        }
        break;
      }
      case "ArrowLeft": {
        // console.log("arrow left")
        if (status === 'on') {
          player.setLinearVelocity(Vec2(-velMag, player.getLinearVelocity().y), player.getPosition());
        } else if (status === 'off') {
          player.setLinearVelocity(Vec2(0, player.getLinearVelocity().y), player.getPosition());
        }
        break;
      }
      case "ArrowDown": {
        // console.log("arrow down")
        if (status === 'on') {
          player.setLinearVelocity(Vec2(player.getLinearVelocity().x, velMag), player.getPosition());
        } else if (status === 'off') {
          player.setLinearVelocity(Vec2(player.getLinearVelocity().x, 0), player.getPosition());
        }
        break;
      }
      case "ArrowUp": {
        // console.log("arrow up")
        if (status === 'on') {
          player.setLinearVelocity(Vec2(player.getLinearVelocity().x, -velMag), player.getPosition());
        } else if (status === 'off') {
          player.setLinearVelocity(Vec2(player.getLinearVelocity().x, 0), player.getPosition());
        }
        break;
      }

    }
  }


  document.addEventListener('keyup', e => {
    // console.log(e)
    switch (e.key) {
      case "ArrowRight": {
        // console.log("arrow right")
        setPlayerVel(e.key, 'off')
        break;
      }
      case "ArrowLeft": {
        // console.log("arrow left")
        setPlayerVel(e.key, 'off')
        break;
      }
      case "ArrowDown": {
        // console.log("arrow down")
        setPlayerVel(e.key, 'off')
        break;
      }
      case "ArrowUp": {
        // console.log("arrow up")
        setPlayerVel(e.key, 'off')
        break;
      }
    }
  })

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case "ArrowRight": {
        // console.log("arrow right")
        setPlayerVel(e.key, 'on')
        break;
      }
      case "ArrowLeft": {
        // console.log("arrow left")
        setPlayerVel(e.key, 'on')
        break;
      }
      case "ArrowDown": {
        // console.log("arrow down")
        setPlayerVel(e.key, 'on')
        break;
      }
      case "ArrowUp": {
        // console.log("arrow up")
        setPlayerVel(e.key, 'on')
        break;
      }
    }
    // console.log(e)
    // switch (e.key) {
    //   case "ArrowRight": {
    //     // console.log("arrow right")
    //     player.applyLinearImpulse(Vec2(10, 0), player.getPosition());
    //     break;
    //   }
    //   case "ArrowLeft": {
    //     // console.log("arrow left")
    //     player.applyLinearImpulse(Vec2(-10, 0), player.getPosition());
    //     break;
    //   }
    //   case "ArrowDown": {
    //     // console.log("arrow down")
    //     player.applyLinearImpulse(Vec2(0, 10), player.getPosition());
    //     break;
    //   }
    //   case "ArrowUp": {
    //     // console.log("arrow up")
    //     player.applyLinearImpulse(Vec2(0, -10), player.getPosition());
    //     break;
    //   }
    // }
  })

  // balls.push(createBall(world));
  // done initalization, next simulation.

  // simulation

  const model = new Model();
  function movePlayer(relPos, dist, playerPos) {

    if (relPos && dist && playerPos) {
      // var output = model.testModel([[1, 1, 1, 1, 10]])

      // console.log([  relPos.x, relPos.y, dist, playerPos.x, playerPos.y ])
      var output = model.testModel([[relPos.x, relPos.y, dist, playerPos.x, playerPos.y]])
      // console.log( output.dataSync())



    }

  }

  function eatBall(bodyNum) {
    // balls[bodyNum].setPosition

    // console.log(bodyNum, balls);
    balls[bodyNum].setPosition(Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())));
    balls[bodyNum].setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10));
  }

  const timestep = 1 / FPS;

  const velocityIterations = 8;
  const positionIterations = 3;

  console.log(Vec2(4, 3).normalize());

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

        // it can only detect 1 collion, use contact.getNext to get the next contact
        detectedballs = [];
        var contact = player.getContactList();
        // console.log(player.getContactCount());

        // ignoring the contact with whe walls
        // while (contact && contact.next !== null) {
        while (contact) {
          // console.log(contact);
          if (contact && contact.other.m_type === 'dynamic' && contact.contact.m_touchingFlag) {
          // if (contact && contact.other.m_type === 'dynamic' ) {
            // detected the food.
            // if (contact.contact.m_fixtureA.m_userData === userData.detectionCircle || contact.contact.m_fixtureB.m_userData === userData.detectionCircle) {
            var bodynum = contact.other.m_userData;
            if (contact.contact.m_fixtureA.m_userData === userData.feedingCircle || contact.contact.m_fixtureB.m_userData === userData.feedingCircle) {
            // player eats food
              eatBall(bodynum);
            } else if (contact.contact.m_fixtureA.m_userData === userData.detectionCircle || contact.contact.m_fixtureB.m_userData === userData.detectionCircle) {
            // player detects food
              // console.log('detected');
              var playerPos = player.getPosition();
              var ballPos = balls[bodynum].getPosition();
              var relPos = ballPos.sub(playerPos);
              var dist = relPos.normalize();
              // var dist = Vec2.distance(ballPos, playerPos);

              detectedballs.push(bodynum);
              movePlayer(relPos, dist, playerPos);

            }

          }
          contact = contact.next;
        }
        // run next step in simulation.
        world.step(timestep, velocityIterations, positionIterations);

        // display balls
        balls.forEach((ball) => {
          ctx.beginPath();

          circlePos = [ball.getPosition().x, ball.getPosition().y]
          // console.log(circlePos, ball.getLinearVelocity());
          // console.log(body.getPosition(), body.getAngle());
          ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, ballRadius * ratio, 0, 2 * Math.PI, false);

          // ctx.stroke();
          ctx.fill();
        })

        // display player
        ctx.beginPath();
        circlePos = [player.getPosition().x, player.getPosition().y]
        ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, playerRadius * ratio, 0, 2 * Math.PI, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, playerDetectionRadius * ratio, 0, 2 * Math.PI, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, playerCoreRadius * ratio, 0, 2 * Math.PI, false);
        ctx.fill();


        detectedballs.map(ballnum => {
          ctx.moveTo(circlePos[0] * ratio, circlePos[1] * ratio);
          ctx.lineTo(balls[ballnum].getPosition().x * ratio, balls[ballnum].getPosition().y * ratio)
          ctx.stroke();
        })


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
