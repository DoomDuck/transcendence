import * as THREE from 'three'
import { Camera } from './Camera';
import { GSettings, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from '../common/constants';
import { Game } from "../common/Game";
import { GameState } from '../common/GameState';
import { ClientBall } from './ClientBall';
import { ClientBar } from './ClientBar';
import { ClientBarControlled } from './ClientBarControlled';
import { GameEvent } from '../common/constants';

export class ClientGame extends Game {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: Camera;
    playerId: PlayerID;
    otherPlayerId: PlayerID;

    constructor(playerId: PlayerID) {
        const ball = new ClientBall();
        const bar1 = (playerId == PLAYER1) ? new ClientBarControlled(PLAYER1) : new ClientBar(PLAYER1);
        const bar2 = (playerId == PLAYER2) ? new ClientBarControlled(PLAYER2) : new ClientBar(PLAYER2);
        const gameState = new GameState(ball, bar1, bar2);
        super(gameState);
        // ////
        // var oldEmit = this.emit;
        // this.emit = function(event: string, ...args: any[]) {
        //     console.log(`got event ${event}`)
        //     return oldEmit.apply(this, [event, ...args]);
        // }
        // ////
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
        this.loadBackground();
        this.on(GameEvent.GOAL, (playerid: PlayerID) => {
            console.log("GOAL !!!")
        });
        this.on(GameEvent.RESET, (ballSpeedX: number, ballSpeedY: number) => {
            this.reset(ballSpeedX, ballSpeedY);
        })
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

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
