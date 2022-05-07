import * as THREE from 'three'
import { Vector3 } from 'three';
import { PhysicBall } from './PhysicBall';
import { Bar } from './Bar';
import { ballBarDistance, ballWallCollisionDistances } from './collision';
import { updateArrowDist, updateArrowForce } from './arrow_helpers';


const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)

// GAME ---->
const GAME_RATIO = 4 / 3;
const GAME_WIDTH = 2;
const GAME_HEIGHT = GAME_WIDTH / GAME_RATIO;

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
    if (window.innerWidth / window.innerHeight < GAME_RATIO)
        renderer.setSize(window.innerWidth, window.innerWidth / GAME_RATIO);
    else
        renderer.setSize(GAME_RATIO * window.innerHeight, window.innerHeight);

    render()
}
onWindowResize();

// window.addEventListener('mousemove', onMouseMove, false);
// function onMouseMove(e: MouseEvent) {
//     ball.position.x = e.clientX + camera.left;
//     ball.position.y = e.clientY + camera.top;
// }

var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);
var _v1 = new Vector3();
var _v2 = new Vector3();

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

var lastTimeStamp = 0;
var elapsedTime;
var cpt = 0;

function animate(timeStamp: number) {
    elapsedTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    if (cpt % 100 == 0)
        console.log('elapsed: ' + elapsedTime); 
    cpt++;
    requestAnimationFrame(animate);
    ball.update(elapsedTime);
    var [distanceToCenter, distanceToBorder, closestPoint] = ballBarDistance(ball, bar);
    updateArrowDist(distanceToBorder, closestPoint, arrowDist);
    updateArrowForce(ball, arrowForce);
    render()
}
function render() {
    renderer.render(scene, camera)
}

animate(0)
