import * as THREE from 'three'
import { Camera } from './Camera';
import { GSettings, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from '../common/constants';
import { Game } from "../common/Game";
import { GameState } from '../common/GameState';
import { ClientBall } from './ClientBall';
import { ClientBar } from './ClientBar';
import { ClientBarControlled } from './ClientBarControlled';
import { GameEvent } from '../common/constants';
import { PlayersScore } from './PlayersScore';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class ClientGame extends Game {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    camera: Camera;
    playerId: PlayerID;
    otherPlayerId: PlayerID;
    playersScore: PlayersScore;

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
        this.camera = new Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        this.playersScore = new PlayersScore();
        this.scene.add(this.playersScore.group);

        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.domElement.className = 'game-text';

        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
        this.loadBackground();
        this.on(GameEvent.GOAL, (playerId: PlayerID) => {
            console.log("GOAL !!!");
            this.playersScore.handleGoal(playerId);
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
        let width, height;
        if (window.innerWidth / window.innerHeight < GSettings.SCREEN_RATIO) {
            width = window.innerWidth;
            height = window.innerWidth / GSettings.SCREEN_RATIO;
        }
        else {
            width = GSettings.SCREEN_RATIO * window.innerHeight;
            height = window.innerHeight;
        }
        this.renderer.setSize(width, height);
        this.labelRenderer.setSize(width, height);
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }
}
