import type { Component } from 'solid-js';
// import type { Vec2  as Vec2Type } from 'planck';
import * as tf from '@tensorflow/tfjs';
import { onCleanup, onMount } from 'solid-js';
import * as planck from 'planck';
import { Vec2 } from 'planck';
import { Model } from './Model';
import { createBall, createPlayer, userData, createWiskers } from './helperFunctions'


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
  // let activatedWiskers: <activeatedWiskerType>;
  // let activatedWiskers: { id: number };
  let numWiskers = 12;
  let activatedWiskers: Array<number> = new Array(numWiskers).fill(0);
  let wiskerRadius = playerRadius * 6;
  const wiskers = createWiskers(numWiskers, wiskerRadius);
  // let data: Array<Array<number>>;
  // let data: [number, number, number, number];
  let data: Array<number[]>;
  //(state, action, reward, next_state, done)



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
    balls.push(createBall(world, i, ballRadius, frameSize));
  }


  // create player
  // activatedWiskers = [];
  player = createPlayer(world, playerRadius, frameSize, wiskers);
  // for (let i = 0; i < numWiskers; i++) {
  //   activatedWiskers[i] = 0;
  // }

  // console.log(player)


  function setPlayerVel(dir: ('ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown'), status: ('on' | 'off')) {
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
  })

  // balls.push(createBall(world));

  const agent = new Model(numWiskers, 2);

  function movePlayerWithAI(qvals: number[]) {
    // qvalsTensor.print();

    player.setLinearVelocity(Vec2(qvals[0] * velMag, qvals[1] * velMag), player.getPosition());
    // player.applyForceToCenter(Vec2(qvals[0] * velMag, qvals[1] * velMag));

    // return qvalsTensor;
  }


  // player.applyForceToCenter(Vec2(1 * velMag, 1 * velMag));

  function eatBall(bodyNum: number) {
    // balls[bodyNum].setPosition

    // console.log(bodyNum, balls);
    balls[bodyNum].setPosition(Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())));
    balls[bodyNum].setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10));
  }

  const timestep = 1 / FPS;

  const velocityIterations = 8;
  const positionIterations = 3;
  var oldState = [...activatedWiskers] // clone activated Wiskers
  var qvals: number[] = new Array(2) // actions
  var reward = 0;
  // var contact: planck.Contact.ContactEdge;
  var contact: any; //ContactEdge

  // console.log(Vec2(4, 3).normalize());

  // done initalization, next simulation.
  // simulation
  // const draw = async (time: number) => {
  function draw(time: number) {
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
        // detectedballs = [];


        contact = player.getContactList();
        reward = 0;
        // console.log(player.getContactCount());

        // ignoring the contact with whe walls
        // while (contact && contact.next !== null) {
        while (contact) {
          // console.log(contact);
          if (contact && contact.other.m_type === 'dynamic' && contact.contact.m_touchingFlag) {
            // if (contact && contact.other.m_type === 'dynamic' ) {
            // detected the food.
            // if (contact.contact.m_fixtureA.m_userData === userData.detectionCircle || contact.contact.m_fixtureB.m_userData === userData.detectionCircle) {
            var bodynum = contact.other.m_userData[1];
            if (contact.contact.m_fixtureA.m_userData[0] === userData.feedingCircle || contact.contact.m_fixtureB.m_userData[0] === userData.feedingCircle) {
              // player eats food
              eatBall(bodynum);
              reward++;
            } else if (contact.contact.m_fixtureA.m_userData[0] === userData.wisker && contact.contact.m_fixtureB.m_userData[0] === userData.ball) {
              // player detects food
              // activatedWiskers[contact.contact.m_fixtureA.m_userData[1]] = wiskerRadius/Vec2.distance(balls[bodynum].getPosition(), player.getPosition());
              activatedWiskers[contact.contact.m_fixtureA.m_userData[1]] = 1;
              // console.log(Vec2.distance(balls[bodynum].getPosition(), player.getPosition()))

            } else if (contact.contact.m_fixtureA.m_userData[0] === userData.ball && contact.contact.m_fixtureB.m_userData[0] === userData.wisker) {
              // activatedWiskers[contact.contact.m_fixtureB.m_userData[1]] = wiskerRadius/Vec2.distance(balls[bodynum].getPosition(), player.getPosition());
              activatedWiskers[contact.contact.m_fixtureB.m_userData[1]] = 1;
              // console.log('detected');


            }

          }
          contact = contact.next;
        }

        // console.log(activatedWiskers);

        agent.storeData(oldState, qvals, reward, activatedWiskers);
        qvals = agent.getQval([activatedWiskers]);
        movePlayerWithAI(qvals);
        oldState = [...activatedWiskers] // clone activated Wiskers


        // let action = this.model.getQval([activatedWiskers])
        // movePlayerWithAI(action);

        // oldState = structuredClone(activatedWiskers) // clone activated Wiskers
        // model.storeData(tf.tensor2d( oldState , [1, 8]), reward, [ activatedWiskers ] );
        // model.storeData(tf.tensor([oldState]), action, reward, tf.tensor([activatedWiskers]));
        // model.storeData(tf.tensor([oldState]), action, reward, tf.tensor([activatedWiskers]));

        // run next step in simulation.
        //
        world.step(timestep, velocityIterations, positionIterations);

        // display balls
        ctx.fillStyle = "green";
        balls.forEach((ball: planck.Body) => {
          ctx.strokeStyle = "#000000";
          ctx.beginPath();
          circlePos = [ball.getPosition().x, ball.getPosition().y]
          ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, ballRadius * ratio, 0, 2 * Math.PI, false);
          ctx.fill();
        })

        // display player
        ctx.beginPath();
        circlePos = [player.getPosition().x, player.getPosition().y]
        ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, playerRadius * ratio, 0, 2 * Math.PI, false);
        ctx.stroke();

        // display wiskers
        ctx.strokeStyle = "#black";
        wiskers.forEach((wisker, i) => {
          if (activatedWiskers[i]) {
            activatedWiskers[i] = 0;
            ctx.strokeStyle = "#FF0000";
          } else {
            ctx.strokeStyle = "#000000";
            // ctx.strokeStyle = "#black";
          }

          ctx.beginPath();
          ctx.moveTo(circlePos[0] * ratio, circlePos[1] * ratio);
          ctx.lineTo((wisker.x + circlePos[0]) * ratio, (wisker.y + circlePos[1]) * ratio);
          ctx.stroke();

        })

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(circlePos[0] * ratio, circlePos[1] * ratio, playerCoreRadius * ratio, 0, 2 * Math.PI, false);
        ctx.fill();



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
      <button onClick={() => {
        console.log(agent.trainingDataInputs)
      }}> get weights</button>
    </div>
  );
};

export default App;
