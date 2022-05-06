import * as THREE from 'three'
import { Vector3 } from 'three';
import { PhysicBall } from './PhysicBall';
import { Bar } from './Bar';
import { ballBarDistance } from './collision';


const scene = new THREE.Scene()

var w = window.innerWidth;
var h = window.innerHeight;
const camera = new THREE.OrthographicCamera();
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Geometry
// const barGeometry = new THREE.BoxGeometry(
    //     barWidth, barHeight
    // )




// BAR ----->
const barWidth = 100;
const barHeight = 1000;
const barX = -w/4;
const barY = 0;
var bar = new Bar(barWidth, barHeight, -w/4, 0);
// BALL ---->
const ballRadius = 100;
const ballX = 0;
const ballY = 0;
const ballSpeedX = -10;
const ballSpeedY = 0;
var ball = new PhysicBall(ballRadius, ballX, ballY, ballSpeedX, ballSpeedY, computeCollisionDistances);
// var ball = new PhysicBall(ballRadius, ballX, ballY, ballSpeedX, ballSpeedY, (_: any) => {});


// Helpers
const axesHelper = new THREE.AxesHelper( 300 );
const arrowDist = new THREE.ArrowHelper( new Vector3(), new Vector3(), 0, 0xff0000 );
const arrowForce = new THREE.ArrowHelper( new Vector3(), new Vector3(), 0, 0x0000ff );
arrowDist.position.z = 5;
arrowForce.position.z = 5;


scene.add(bar)
scene.add(ball)
scene.add(axesHelper);
scene.add(arrowDist);
scene.add(arrowForce);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.left = -w/2;
    camera.right = w/2;
    camera.top = -h/2;
    camera.bottom = h/2;
    camera.near = 0;
    camera.far = 1000;
    camera.updateProjectionMatrix();
    camera.position.z = 2;

    axesHelper.position.x = -w/2
    axesHelper.position.y = -h * (1/2 - .15)

    renderer.setSize(window.innerWidth, window.innerHeight)
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

function updateArrowDist(distanceVec: Vector3, closestPoint: Vector3) {
    // origin
    arrowDist.position.copy(closestPoint);

    // direction
    var dist = distanceVec.length();
    _v1.copy(distanceVec);
    _v1.normalize();
    arrowDist.setDirection(_v1);

    // length
    arrowDist.setLength(dist);
}

function computeCollisionDistances(ball: PhysicBall): Vector3[] {
    return ballBarDistance(ball, bar);
}

function animate(time: number) {
    requestAnimationFrame(animate);
    ball.update(time);
    var [distanceToCenter, distanceToBorder, closestPoint] = ballBarDistance(ball, bar);
    ball.deformCollision(distanceToCenter);
    updateArrowDist(distanceToBorder, closestPoint);
    ball.updateArrowForce(arrowForce);
    render()
}
function render() {
    renderer.render(scene, camera)
}

animate(0)
