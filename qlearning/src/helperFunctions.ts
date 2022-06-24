// import * as planck from 'planck';
import { Circle, Edge, Vec2, Polygon, Chain, World } from 'planck';


export enum userData {
    detectionCircle = 'detectionCircle',
    wisker = 'wisker',
    ball = 'ball',
    feedingCircle = 'feedingCircle'
}

export function createWiskers(num: number, wiskerRadius: number) {
    let wiskers = []
    for (let i = 0; i < num; i++) {
        wiskers.push(Vec2(Math.sin(Math.PI * i * (2 / num)) * wiskerRadius, Math.cos(Math.PI * i * (2 / num)) * wiskerRadius));
    }
    return wiskers
}

export function createBall(toWorld: World, setUserData: number, ballRadius: number, frameSize: [number, number]) {
    // const body = toWorld.createDynamicBody(Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())))
    // const body = toWorld.createKinematicBody(Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())))
    const body = toWorld.createDynamicBody({
        position: Vec2(ballRadius + ((frameSize[0] - ballRadius - ballRadius) * Math.random()), ballRadius + ((frameSize[1] - ballRadius - ballRadius) * Math.random())),
        // linearVelocity: Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10),
        userData: [userData.ball, setUserData ]
    })

    const dynamicCircle = Circle(ballRadius);

    body.createFixture(dynamicCircle, {
        density: 1,
        friction: 0,
        filterGroupIndex: -1, //dont interact with each other balls.
        userData: [userData.ball, setUserData ],
        restitution: 1
    });

    // body.setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10))
    // body.setUserData(i);
    return body
}

export function createPlayer(toWorld: World, playerRadius: number, frameSize: [number, number], wiskers: Vec2[]) {
    // const body = toWorld.createDynamicBody(Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random())))
    // const body = toWorld.createKinematicBody(Vec2(radius + ((frameSize[0] - radius - radius) * Math.random()), radius + ((frameSize[1] - radius - radius) * Math.random())))
    //
    var pos = Vec2(playerRadius + ((frameSize[0] - playerRadius - playerRadius) * Math.random()), playerRadius + ((frameSize[1] - playerRadius - playerRadius) * Math.random()))
    const body = toWorld.createDynamicBody({
        position: pos,
        // linearDamping: 1,
        // userData: -1
    })


    // detection range
    wiskers.forEach(( wisker, i) => {
        body.createFixture(Edge(Vec2(0, 0), wisker), {
            isSensor: true, // doesnt collide with other but still collects contact info.
            density: 0,
            friction: 0,
            restitution: 0,
            userData: [userData.wisker, i]
        });
    })

    // for (var i = 0; i < numWiskers; i++) {

    //     console.log('create edge')
    //     // body.createFixture(Edge(pos, pos.clone().add(Vec2(wiskerRadius, wiskerRadius))), {
    //     // body.createFixture(Chain([ pos, pos.clone().add(Vec2(wiskerRadius, wiskerRadius)) ], false), {
    //     // body.createFixture(Polygon([ pos, pos.clone().add(Vec2(wiskerRadius, wiskerRadius)) ]), {
    //     body.createFixture(Edge(Vec2(0, 0), Vec2(wiskerRadius, wiskerRadius)), {
    //         isSensor: true, // doesnt collide with other but still collects info.
    //         density: 0,
    //         friction: 0,
    //         restitution: 0,
    //         userData: userData.detectionCircle
    //     });
    // }

    // const dynamicDetectionCircle = Circle(playerDetectionRadius);
    // body.createFixture(dynamicDetectionCircle, {
    //     density: 0,
    //     friction: 0,
    //     isSensor: true, // doesnt collide with other but still collects info.
    //     restitution: 1,
    //     userData: userData.detectionCircle
    // });

    // feeding range
    const dynamicCircle = Circle(playerRadius);
    body.createFixture(dynamicCircle, {
        density: 0,
        friction: 0,
        isSensor: true, // doesnt collide with other but still collects info.
        restitution: 1,
        userData: [ userData.feedingCircle ]
    });

    // prevent player from leaving the map.
    const dynamicCore = Circle(playerRadius / 2);
    body.createFixture(dynamicCore, {
        density: 0,
        friction: 0,
        restitution: 0,
        userData: [0]
    });

    // body.setLinearVelocity(Vec2((20 * Math.random()) - 10, (20 * Math.random()) - 10))
    return body
}
