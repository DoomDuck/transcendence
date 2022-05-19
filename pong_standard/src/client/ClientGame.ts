import * as THREE from 'three'
import * as socketio from 'socket.io-client'
import { Camera } from './Camera';
import { Ball } from './Ball';
import { Bar } from './Bar';
import { LocalBar } from './LocalBar';
import { GSettings } from './constants';
import { DistantBar } from './DistantBar';
import { DistantBall } from './DistantBall';

export class ClientGame {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: Camera;
    bar1: Bar;
    bar2: Bar;
    ball: Ball;
    controlledBar: LocalBar | null;
    playerId: number;

    constructor(playerId: number) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new Camera();
        this.loadBackground();

        this.controlledBar = null;
        this.playerId = playerId;
        if (playerId == 0) {
            this.bar1 = new LocalBar(1);
            this.bar2 = new DistantBar(-1);
            this.controlledBar = this.bar1 as LocalBar;
        }
        else if (playerId == 1) {
            this.bar1 = new DistantBar(1);
            this.bar2 = new LocalBar(-1);
            this.controlledBar = this.bar2 as LocalBar;
        }
        else {
            this.bar1 = new DistantBar(1);
            this.bar2 = new DistantBar(-1);
        }
        this.ball = new DistantBall(this.handleGoal.bind(this));
        this.reset(Math.random() > .5 ? -1: 1);
        this.scene.add(this.bar1);
        this.scene.add(this.bar2);
        this.scene.add(this.ball);
    }

    get domElement() {
        return this.renderer.domElement;
    }

    loadBackground() {
        const onLoad = (texture: THREE.Texture) => {
            this.scene.background = texture;
            console.log('Texture loaded');
        }
        const onProgress = () => {}
        const onError = (e: ErrorEvent) => {
            console.log(`Error loading texture: ${e}`)
        }
        new THREE.TextureLoader().load(
            "/img/background.jpg",
            onLoad,
            onProgress,
            onError,
        );
    }

    handleGoal(playerId: number) {
        console.log(`player ${playerId + 1} scored !`);
        this.reset(playerId == 0 ? -1 : 1);
    }

    reset(ballDirection: number) {
        // this.ball.position.set(0, 0, 0);
        // this.ball.speed.set(
        //     ballDirection * GSettings.BAll_INITIAL_SPEEDX,
        //     (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3,
        //     0
        // );
    }

    updateBar(id: number, y: number) {
        if (this.playerId + 1 == id) {
            console.log("useless updateBar call");
            return;
        }
        if (id == 1)
            this.bar1.position.y = y;
        else
            this.bar2.position.y = y;
    }

    update(elapsedTime: number) {
        // The loop ensures simulation stability (essentially, about collisions) by having a bounded time step
        for (var t = 0; t < elapsedTime; t += GSettings.DELTA_T) {
            var dt = (t + GSettings.DELTA_T < elapsedTime) ? GSettings.DELTA_T : elapsedTime - t;
            this.bar1.update(dt);
            this.bar2.update(dt);
            this.ball.update(dt);
            // this.ball.handleBarCollision(this.bar1);
            // this.ball.handleBarCollision(this.bar2);
            // this.ball.handleWallCollisions();
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    handleDisplayResize() {
        if (window.innerWidth / window.innerHeight < GSettings.SCREEN_RATIO) {
            this.renderer.setSize(
                window.innerWidth,
                window.innerWidth / GSettings.SCREEN_RATIO);
        }
        else {
            this.renderer.setSize(
                GSettings.SCREEN_RATIO * window.innerHeight,
                window.innerHeight);
        }
        this.render()
    }

    handleKeydown(e: KeyboardEvent) {
        this.controlledBar?.handleKeydown(e);
    }

    handleKeyup(e: KeyboardEvent) {
        this.controlledBar?.handleKeyup(e);
    }

    emmit(socket: socketio.Socket) {
        if (this.playerId < 2)
            socket.emit("bar", this.playerId + 1, (this.controlledBar as LocalBar).position.y);
    }
}
