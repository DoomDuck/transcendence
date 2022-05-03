import * as THREE from 'three'
import { Vector3 } from 'three';

const scene = new THREE.Scene()

var w = window.innerWidth;
var h = window.innerHeight;
const camera = new THREE.OrthographicCamera();
camera.position.z = 10;

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
// const ballRadius = 10;
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
    // wireframe: true,
})


// Mesh
const bar = new THREE.Mesh(barGeometry, barMaterial)
const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.rotateX(THREE.MathUtils.degToRad(90));
bar.position.x -= w/4;


// Helpers
const axesHelper = new THREE.AxesHelper( 300 );
const arrowDist = new THREE.ArrowHelper( new Vector3(), new Vector3(), 300, 0xff0000 );
arrowDist.position.z = 5;


scene.add(bar)
scene.add(ball)
scene.add(axesHelper);
scene.add(arrowDist);

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

window.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(e: MouseEvent) {
    ball.position.x = e.clientX + camera.left;
    ball.position.y = e.clientY + camera.top;
}

var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);
var _v1 = new Vector3();
var _v2 = new Vector3();

function ballBarDistance() {
    var distanceToCenter = new Vector3();
    var distanceToBorder = new Vector3();
    var closestPoint = new Vector3();

    // v1: bar to ball-center
    distanceToCenter.copy(ball.position);
    distanceToCenter.sub(bar.position);
    var signX = Math.sign(distanceToCenter.x);
    var signY = Math.sign(distanceToCenter.y);
    var x = Math.abs(distanceToCenter.x) - barWidth / 2;
    var y = Math.abs(distanceToCenter.y) - barHeight / 2;
    distanceToCenter.x -= signX * (barWidth / 2)
    distanceToCenter.y -= signY * (barHeight / 2)
    // distanceToBorder: bar to ball-border
    if (x > 0 && y < 0) {
        // lateral face
        distanceToCenter.set(distanceToCenter.x, 0, 0);
        closestPoint.set(bar.position.x + signX * barWidth / 2, ball.position.y, 0);
    }
    else if (x < 0 && y > 0) {
        // upper face
        distanceToCenter.set(0, distanceToCenter.y, 0);
        closestPoint.set(ball.position.x, bar.position.y + signY * barHeight / 2, 0);
    }
    else if (x > 0 && y > 0) {
        // diagonal
        closestPoint.set(bar.position.x + signX * barWidth / 2, bar.position.y + signY * barHeight / 2, 0)
    }
    if (x > ballRadius || y > ballRadius) {
        distanceToBorder.copy(distanceToCenter);
        distanceToBorder.setLength(distanceToBorder.length() - ballRadius);
    }

    return [distanceToCenter, distanceToBorder, closestPoint];
}

function updateArrowDist(distanceVec: Vector3, closestPoint: Vector3) {
    // origin
    arrowDist.position.copy(closestPoint)

    // direction
    var dist = distanceVec.length();
    _v1.copy(distanceVec);
    _v1.normalize();
    arrowDist.setDirection(_v1);
    arrowDist.setLength(dist);
}


function ballBarCollision(distanceVec: Vector3, closestPoint: Vector3) {
    ball.scale.x = 1;
    ball.rotation.y = 0;

    var dist = distanceVec.length();
    var distDir = new Vector3();
    distDir.copy(distanceVec).normalize();
    if (dist < ballRadius) {
        ball.scale.x = dist / ballRadius;
        var signY = Math.sign(distanceVec.y)
        ball.rotation.y = signY * distanceVec.angleTo(_ux)
    }
}


// var distanceVec = new Vector3();
// var closestPoint = new Vector3();

function animate(time: number) {
    requestAnimationFrame(animate);
    var [distanceToCenter, distanceToBorder, closestPoint] = ballBarDistance();
    updateArrowDist(distanceToBorder, closestPoint);
    ballBarCollision(distanceToCenter, closestPoint);
    render()
}
function render() {
    renderer.render(scene, camera)
}

animate(0)
