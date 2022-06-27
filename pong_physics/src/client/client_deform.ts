import * as THREE from 'three'
import { Vector3 } from 'three';
import { PhysicBall } from './PhysicBall';
import { Bar } from './Bar';
import { ballBarDistance, ballWallCollisionDistances } from './collision';
import { updateArrowDist, updateArrowForce } from './arrow_helpers';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';


const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)

// GAME ---->
const GAME_RATIO = 4 / 3;
const GAME_WIDTH = 2;
const GAME_HEIGHT = GAME_WIDTH / GAME_RATIO;
var clientWidth: number;
var clientHeight: number;

// PHYSIC -->
const DELTA_T = 1000 / 360;

// CAMERA -->
const camera = new THREE.OrthographicCamera();
camera.left = -GAME_WIDTH / 2;
camera.right = GAME_WIDTH / 2;
camera.top = -GAME_HEIGHT / 2;
camera.bottom = GAME_HEIGHT / 2;
camera.near = 0;
camera.far = 1000;
camera.position.z = 10;
camera.updateProjectionMatrix();

// BAR ----->
const barWidth = .1;
const barHeight = 1;
const barX = -GAME_WIDTH / 4;
const barY = 0;
var bar = new Bar(barWidth, barHeight, barX, barY);

// BALL ---->
const ballRadius = .1;
const ballX = 0;
const ballY = -.51;
const ballSpeedX = -1;
const ballSpeedY = 0;
var ball = new PhysicBall(ballRadius, ballX, ballY, ballSpeedX, ballSpeedY, computeCollisionDistances);
function computeCollisionDistances(ball: PhysicBall): Vector3[] {
    var collisionDistanceVectors = [];
    var ballBarDistanceVec = ballBarDistance(ball, bar)[0];
    if (ballBarDistanceVec.length() < ball.radius) {
        collisionDistanceVectors.push(ballBarDistanceVec);
    }
    collisionDistanceVectors.push(...ballWallCollisionDistances(ball, camera.left, camera.right, camera.top, camera.bottom));
    // return collisionDistanceVectors.filter((vec: Vector3) => (vec.length() < ball.radius));
    return collisionDistanceVectors;
}

// Helpers
const arrowDist = new THREE.ArrowHelper( new Vector3(), new Vector3(), 0, 0xff0000 );
const arrowForce = new THREE.ArrowHelper( new Vector3(), new Vector3(), 0, 0x0000ff );
arrowDist.position.z = 5;
arrowForce.position.z = 5;


scene.add(bar)
scene.add(ball)
scene.add(arrowDist);
scene.add(arrowForce);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    if (window.innerWidth / window.innerHeight < GAME_RATIO) {
        renderer.setSize(window.innerWidth, window.innerWidth / GAME_RATIO);
        clientWidth = window.innerWidth;
        clientHeight = window.innerWidth / GAME_RATIO;
    }
    else {
        renderer.setSize(GAME_RATIO * window.innerHeight, window.innerHeight);
        clientWidth = GAME_RATIO * window.innerHeight;
        clientHeight = window.innerHeight;
    }

    render()
}
onWindowResize();

window.addEventListener('keydown', onKeyDown, false);
function onKeyDown(e: KeyboardEvent) {
    if (e.key == 'b') {
        console.log('Bump');
        bar.onBump();
    }
}

var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);
var _v1 = new Vector3();
var _v2 = new Vector3();


function updatePhysics(elapsedTime: number) {
    for (var t = 0; t < elapsedTime; t += DELTA_T) {
        var dt = (t + DELTA_T < elapsedTime) ? DELTA_T : elapsedTime - t;
        // var inCollision = ballBarDistance(ball, bar)[0].length() < ball.radius;
        // if (bar.update(dt) && inCollision) {
        //     ball.position.add(bar.deltaPos);
        //     ball.update(dt);
        //     ball.energy += ball.totalForces.dot(bar.deltaPos)
        // }
        // else
        bar.update(dt);
        ball.update(dt);
    }
    ball.updateOnFrameEnd();
}

// window.addEventListener('mousemove', onMouseMove);
// function onMouseMove(e: MouseEvent) {
//     ball.position.x = (e.clientX - window.innerWidth/2) / clientWidth * GAME_WIDTH;
//     ball.position.y = (e.clientY - window.innerHeight/2) / clientHeight * GAME_HEIGHT;
// } 

var lastTimeStamp = 0;
var elapsedTime;

function animate(timeStamp: number) {
    elapsedTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    requestAnimationFrame(animate);
    updatePhysics(elapsedTime);
    var [distanceToCenter, distanceToBorder, closestPoint] = ballBarDistance(ball, bar);
    // updateArrowDist(distanceToBorder, closestPoint, arrowDist);
    updateArrowDist(distanceToCenter, closestPoint, arrowDist);
    // updateArrowForce(ball, arrowForce);
    render()
}
function render() {
    renderer.render(scene, camera)
}

animate(0)
