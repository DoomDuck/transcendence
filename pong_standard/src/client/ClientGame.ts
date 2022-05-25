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
        const ball = new GraphicBall();
        const bar1 = (playerId == PLAYER1) ? new ControlledGraphicBar(PLAYER1) : new GraphicBar(PLAYER1);
        const bar2 = (playerId == PLAYER2) ? new ControlledGraphicBar(PLAYER2) : new GraphicBar(PLAYER2);
        const gameState = new GameState(ball, bar1, bar2);
        super(gameState);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        this.requestAnimationFrameId = 0;
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
        this.loadBackground();
        this.on(GameEvent.SET_OTHER_PLAYER_BAR_POSITION, (y: number) => {
            this.state.bars[this.otherPlayerId].position.y = y;
        });
        this.on(GameEvent.SET_BALL, (x: number, y: number, vx: number, vy: number) => {
            // console.log(`setBall event: x=${x}, y=${y}, vx=${vx}, vy=${vy}`);
            this.state.ball.position.set(x, y, 0);
            this.state.ball.speed.set(vx, vy, 0);
            // ball.speed.set(vx, vy, 0);
        })
        this.on(GameEvent.GOAL, (playerid: PlayerID) => {
            // let dir = (playerId == PLAYER1) ? LEFT : RIGHT;
            // this.state.reset(dir);
        });
        this.on(GameEvent.RESET, (ballSpeedX: number, ballSpeedY: number) => {
            this.state.reset(ballSpeedX, ballSpeedY);
        })
        window.addEventListener("resize", () => this.handleDisplayResize());
        this.handleDisplayResize();
        // this.render();
    }

    get domElement() {
        return this.renderer.domElement;
    }

    loadBackground() {
        const onLoad = (texture: THREE.Texture) => {
            this.scene.background = texture;
            console.log('Texture loaded');
            this.render();
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

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
