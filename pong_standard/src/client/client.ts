import * as THREE from 'three'
import { Vector3 } from 'three';
import { Ball } from './Ball';
import { Bar } from './Bar';
import { GSettings } from './constants';

// THREEJS SETUP
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)

// CAMERA SETUP
const camera = new THREE.OrthographicCamera();
camera.left = GSettings.SCREEN_LEFT;
camera.right = GSettings.SCREEN_RIGHT;
camera.top = GSettings.SCREEN_TOP;
camera.bottom = GSettings.SCREEN_BOTTOM;
camera.near = 0;
camera.far = 1000;
camera.position.z = 10;
camera.updateProjectionMatrix();


// DECORATION

const texture = new THREE.TextureLoader().load(
    "/img/background.jpg",
    onLoad,
    onProgress,
    onError,
);
function onLoad(texture: THREE.Texture) {
    scene.background = texture;
    console.log('Texture loaded');
}
function onProgress() {}
function onError(e: ErrorEvent) {
    console.log(`Error loading texture: ${e}`)
}



// ENTITIES

var bar1 = new Bar(
    GSettings.BAR_WIDTH,
    GSettings.BAR_HEIGHT,
    -GSettings.BAR_INITIALX,
    GSettings.BAR_INITIALY,
    1, // edge for the collision with the ball -> +x
);
// changing player1 inputs for offline game
bar1.upKeys = ['q'];
bar1.downKeys = ['a'];

var bar2 = new Bar(
    GSettings.BAR_WIDTH,
    GSettings.BAR_HEIGHT,
    GSettings.BAR_INITIALX,
    GSettings.BAR_INITIALY,
    -1, // edge for the collision with the ball -> -x
);

var ball = new Ball(
    GSettings.BALL_RADIUS,
    GSettings.BAll_INITIALX,
    GSettings.BAll_INITIALY,
    GSettings.BAll_INITIAL_SPEEDX,
    GSettings.BAll_INITIAL_SPEEDY,
    onGoal
);
function onGoal(playerId: number) {
    console.log(`player ${playerId} scored !`);
    ball.position.set(0, 0, 0);
    ball.speed.set(
        (playerId == 0 ? -1: 1) * GSettings.BAll_INITIAL_SPEEDX,
        GSettings.BAll_INITIAL_SPEEDY,
        0
    );
}

scene.add(bar1)
scene.add(bar2)
scene.add(ball);


// WINDOW EVENTS

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    if (window.innerWidth / window.innerHeight < GSettings.SCREEN_RATIO) {
        renderer.setSize(window.innerWidth, window.innerWidth / GSettings.SCREEN_RATIO);
    }
    else {
        renderer.setSize(GSettings.SCREEN_RATIO * window.innerHeight, window.innerHeight);
    }
    render()
}
onWindowResize();

window.addEventListener('keydown', bar1.keydownHandler.bind(bar1), false);
window.addEventListener('keydown', bar2.keydownHandler.bind(bar2), false);
window.addEventListener('keyup', bar1.keyupHandler.bind(bar1), false);
window.addEventListener('keyup', bar2.keyupHandler.bind(bar2), false);


// ANIMATION/SIMULATION LOOP

var lastTimeStamp = 0;
var elapsedTime;

function animate(timeStamp: number) {
    elapsedTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    requestAnimationFrame(animate);
    updateGame(elapsedTime);
    render()
}
function updateGame(elapsedTime: number) {
    // The loop ensures simulation stability (essentially, about collisions) by having a bounded time step
    for (var t = 0; t < elapsedTime; t += GSettings.DELTA_T) {
        var dt = (t + GSettings.DELTA_T < elapsedTime) ? GSettings.DELTA_T : elapsedTime - t;
        bar1.update(dt);
        bar2.update(dt);
        ball.update(dt);
        ball.handleBarCollision(bar1);
        ball.handleBarCollision(bar2);
        ball.handleWallCollisions();
    }
}
function render() {
    renderer.render(scene, camera)
}

animate(0)
