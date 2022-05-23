import * as THREE from 'three'
import { Camera } from './Camera';
import { GSettings, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from '../common/constants';
import { Game } from "../common/Game";
import { GameState } from '../common/GameState';
import { GraphicBall } from './GraphicBall';
import { GraphicBar } from './GraphicBar';
import { ControlledGraphicBar } from './ControlledGraphicBar';
import { GameEvent } from '../common/constants';

export class ClientGame extends Game {
    requestAnimationFrameId: number;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: Camera;
    playerId: PlayerID;
    otherPlayerId: PlayerID;

    constructor(playerId: PlayerID) {
        const gameState = new GameState(
            new GraphicBall(),
            (playerId == PLAYER1) ? new ControlledGraphicBar(LEFT) : new GraphicBar(LEFT),
            (playerId == PLAYER2) ? new ControlledGraphicBar(RIGHT) : new GraphicBar(RIGHT)
        );
        super(gameState);
        this.requestAnimationFrameId = 0;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new Camera();
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
        this.scene.add((this.state.ball as GraphicBall).mesh);
        this.scene.add((this.state.bars[PLAYER1] as GraphicBar).mesh);
        this.scene.add((this.state.bars[PLAYER2] as GraphicBar).mesh);
        this.loadBackground();
        this.on(GameEvent.SET_OTHER_PLAYER_BAR_POSITION, (y: number) => {
            this.state.bars[this.otherPlayerId].position.y = y;
        });
        window.addEventListener("resize", () => this.handleDisplayResize());
        this.handleDisplayResize();
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

    thisBar(): GraphicBar {
        return this.state.bars[this.playerId] as GraphicBar;
    }

    startGameLoop() {
        this.animate();
    }

    stopGameLoop() {
        cancelAnimationFrame(this.requestAnimationFrameId);
    }

    animate() {
        this.requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
        this.frame();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}

// export class ClientGame extends Game {
//     requestAnimationFrameId: number;
//     scene: THREE.Scene;
//     renderer: THREE.WebGLRenderer;
//     camera: Camera;
//     bar1: Bar;
//     bar2: Bar;
//     ball: Ball;
//     controlledBar: LocalBar | null;
//     playerId: number;

//     constructor(playerId: number) {
//         super();
//         this.requestAnimationFrameId = 0;
//         this.scene = new THREE.Scene();
//         this.renderer = new THREE.WebGLRenderer();
//         this.camera = new Camera();
//         this.loadBackground();

//         this.controlledBar = null;
//         this.playerId = playerId;
//         if (playerId == 0) {
//             this.bar1 = new LocalBar(1);
//             this.bar2 = new DistantBar(-1);
//             this.controlledBar = this.bar1 as LocalBar;
//         }
//         else if (playerId == 1) {
//             this.bar1 = new DistantBar(1);
//             this.bar2 = new LocalBar(-1);
//             this.controlledBar = this.bar2 as LocalBar;
//         }
//         else {
//             this.bar1 = new DistantBar(1);
//             this.bar2 = new DistantBar(-1);
//         }
//         this.ball = new DistantBall(this.handleGoal.bind(this));
//         this.reset(Math.random() > .5 ? -1: 1);
//         this.scene.add(this.bar1);
//         this.scene.add(this.bar2);
//         this.scene.add(this.ball);
//         this.scene.add(this.state.ball.mesh);
//         this.scene.add(this.state.bars[0].mesh);
//     }

//     get domElement() {
//         return this.renderer.domElement;
//     }

//     loadBackground() {
//         const onLoad = (texture: THREE.Texture) => {
//             this.scene.background = texture;
//             console.log('Texture loaded');
//         }
//         const onProgress = () => {}
//         const onError = (e: ErrorEvent) => {
//             console.log(`Error loading texture: ${e}`)
//         }
//         new THREE.TextureLoader().load(
//             "/img/background.jpg",
//             onLoad,
//             onProgress,
//             onError,
//         );
//     }

//     handleGoal(playerId: number) {
//         console.log(`player ${playerId + 1} scored !`);
//         this.reset(playerId == 0 ? -1 : 1);
//     }

//     reset(ballDirection: number) {
//         // this.ball.position.set(0, 0, 0);
//         // this.ball.speed.set(
//         //     ballDirection * GSettings.BAll_INITIAL_SPEEDX,
//         //     (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3,
//         //     0
//         // );
//     }

//     updateBar(id: number, y: number) {
//         if (this.playerId + 1 == id) {
//             console.log("useless updateBar call");
//             return;
//         }
//         if (id == 1)
//             this.bar1.position.y = y;
//         else
//             this.bar2.position.y = y;
//     }

//     update(elapsedTime: number) {
//         // The loop ensures simulation stability (essentially, about collisions) by having a bounded time step
//         for (let t = 0; t < elapsedTime; t += GSettings.DELTA_T) {
//             let dt = (t + GSettings.DELTA_T < elapsedTime) ? GSettings.DELTA_T : elapsedTime - t;
//             this.bar1.update(dt);
//             this.bar2.update(dt);
//             this.ball.update(dt);
//             // this.ball.handleBarCollision(this.bar1);
//             // this.ball.handleBarCollision(this.bar2);
//             // this.ball.handleWallCollisions();
//         }
//     }

//     render() {
//         this.renderer.render(this.scene, this.camera)
//     }

//     handleDisplayResize() {
//         if (window.innerWidth / window.innerHeight < GSettings.SCREEN_RATIO) {
//             this.renderer.setSize(
//                 window.innerWidth,
//                 window.innerWidth / GSettings.SCREEN_RATIO);
//         }
//         else {
//             this.renderer.setSize(
//                 GSettings.SCREEN_RATIO * window.innerHeight,
//                 window.innerHeight);
//         }
//         this.render()
//     }

//     handleKeydown(e: KeyboardEvent) {
//         this.controlledBar?.handleKeydown(e);
//     }

//     handleKeyup(e: KeyboardEvent) {
//         this.controlledBar?.handleKeyup(e);
//     }

//     emmit(socket: socketio.Socket) {
//         if (this.playerId < 2)
//             socket.emit("bar", this.playerId + 1, (this.controlledBar as LocalBar).position.y);
//     }

//     startGameLoop() {
//         this.animate();
//     }

//     stopGameLoop() {
//         cancelAnimationFrame(this.requestAnimationFrameId);
//     }

//     animate() {
//         this.requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
//         this.frame();
//         this.render();
//     }

// }
