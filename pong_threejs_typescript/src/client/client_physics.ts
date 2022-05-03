import * as THREE from 'three'
import { Vector2, Vector3 } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { PhysicBody } from './PhysicBody';

const scene = new THREE.Scene()

var w = window.innerWidth;
var h = window.innerHeight;
const camera = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, 1, 1000 );
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Geometry
const barWidth = 100;
const barHeight = 1000;
const barGeometry = new THREE.BoxGeometry(
    barWidth, barHeight
)
const ballRadius = 100;
const ballRadialSegments = 100;
const ballGeometry = new THREE.CylinderGeometry(
    ballRadius, ballRadius,
    1,
    ballRadialSegments,
)

// Material
const barMaterial = new THREE.MeshBasicMaterial({
    color: 0xd14081,
})
const ballMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
})


const bar = new THREE.Mesh(barGeometry, barMaterial)
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
ballMesh.rotateX(THREE.MathUtils.degToRad(90));
var ballSpeed = new Vector3(-10, 1);
var ball = new PhysicBody(ballMesh, ballSpeed);
bar.position.x -= w/4;
// const cube2 = new THREE.Mesh(geometry, material2)


scene.add(bar)
scene.add(ball.mesh)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.left = -w/2;
    camera.right = w/2;
    camera.top = -h/2;
    camera.bottom = h/2;

    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// var ballTween = new TWEEN.Tween(ball.position);

window.addEventListener('keydown', onKeyDown, false);
function onKeyDown(e: KeyboardEvent) {
    if (e.key === "s") {
        console.log("start");
        // reset();

    }
}


function ballBarCollision(ball: PhysicBody, barPos: Vector3) {
    const xBar = barPos.x + barWidth / 2;
    const xBallMin = ball.position.x - ballRadius;
    const xBallMax = ball.position.x + ballRadius;
    return (xBallMin < xBar && ball.speed.x < 0); //|| (xBallMax > xBar && ballSpeed.x > 0)
}

// startCollisionTween(
//     new Vector3(0, 0),
//     new Vector3(100, 0)
// )


function animate(time: number) {
    requestAnimationFrame(animate)
    ball.update(time);
    render()
}

function render() {
    renderer.render(scene, camera)
}
animate(0)
