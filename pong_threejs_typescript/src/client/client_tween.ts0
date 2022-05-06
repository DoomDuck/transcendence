import * as THREE from 'three'
import { Vector2, Vector3 } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

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
const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.rotateX(THREE.MathUtils.degToRad(90));
bar.position.x -= w/4;
// const cube2 = new THREE.Mesh(geometry, material2)


scene.add(bar)
scene.add(ball)

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

var physics = true;

// var ballTween = new TWEEN.Tween(ball.position);
function startCollisionTween(pos: Vector3, speed: Vector3) {
    const elasticCoef = 1;
    const penetrationDist = speed.x / elasticCoef;
    const collisionHalfTime = Math.PI / (4 * elasticCoef);
    const direction = Math.sign(speed.x);
    var tween1 = new TWEEN.Tween(ball.position);
    tween1.to({
        x: pos.x + direction * penetrationDist,
        y: pos.y + collisionHalfTime * speed.y / 1000,
    }, collisionHalfTime).easing(TWEEN.Easing.Circular.Out);
    var tween2 = new TWEEN.Tween(ball.position);
    tween2.to({
        x: pos.x,
        y: pos.y + 2 * collisionHalfTime * speed.y / 1000,
    }, collisionHalfTime).easing(TWEEN.Easing.Circular.In);
    tween1.chain(tween2);
    tween1.onStart(() => {
        physics = false;
    });
    const previousSpeedX = speed.x;
    tween2.onComplete(() => {
        physics = true;
        speed.x = -previousSpeedX;
    })
    tween1.start();
    // ballTween.to({x: pos.x + speed.x}, 1000).start();
}

window.addEventListener('keydown', onKeyDown, false);
function onKeyDown(e: KeyboardEvent) {
    if (e.key === "s") {
        console.log("start");
        // reset();

    }
}


function ballBarCollision(ballPos: Vector3, barPos: Vector3, ballSpeed: Vector3) {
    const xBar = barPos.x + barWidth / 2;
    const xBallMin = ballPos.x - ballRadius;
    const xBallMax = ballPos.x + ballRadius;
    return (xBallMin < xBar && ballSpeed.x < 0); //|| (xBallMax > xBar && ballSpeed.x > 0)
}

// startCollisionTween(
//     new Vector3(0, 0),
//     new Vector3(100, 0)
// )

var ballSpeed = new Vector3(-10, .1);

function animate(time: number) {
    requestAnimationFrame(animate)
    TWEEN.update()
    if (physics) {
        ball.position.x += time * ballSpeed.x / 1000;
        ball.position.y += time * ballSpeed.y / 1000;
        if (ballBarCollision(ball.position, bar.position, ballSpeed)) {
            startCollisionTween(ball.position, ballSpeed);
        }
    }
    render()
}

function render() {
    renderer.render(scene, camera)
}
animate(0)
