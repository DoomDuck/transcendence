import * as THREE from 'three'
import { Camera } from './Camera';
import { GSettings, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from '../common/constants';
import { Game } from "../common/Game";
import { GameState } from '../common/GameState';
import { ClientBall } from './ClientBall';
import { ClientBar } from './ClientBar';
import { ClientBarControlled } from './ClientBarControlled';
import { GameEvent } from '../common/constants';
import { ClientGameState } from './ClientGameState';
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
        // game state
        const ball = new ClientBall(playerId);
        const bar1 = (playerId == PLAYER1) ? new ClientBarControlled(PLAYER1) : new ClientBar(PLAYER1);
        const bar2 = (playerId == PLAYER2) ? new ClientBarControlled(PLAYER2) : new ClientBar(PLAYER2);
        const gameState = new ClientGameState(ball, bar1, bar2, playerId);
        super(gameState);

        // player-realted info
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;

        // events specific to ClientGame
        let otherBar = this.state.bars[this.otherPlayerId];
        this.on(GameEvent.RECEIVE_BAR_KEYDOWN, otherBar.onReceiveKeydown.bind(otherBar));
        this.on(GameEvent.RECEIVE_BAR_KEYUP, otherBar.onReceiveKeyup.bind(otherBar));

        // ////
        // var oldEmit = this.emit;
        // this.emit = function(event: string, ...args: any[]) {
        //     console.log(`got event ${event}`)
        //     return oldEmit.apply(this, [event, ...args]);
        // }
        // ////

        // renderers
        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.domElement.className = 'game-text';

        // scene
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        // this.scene.add(gameState.serverBallEstimation.mesh);
        this.playersScore = new PlayersScore();
        this.scene.add(this.playersScore.group);
        this.loadBackground();

        // callbacks
        this.on(GameEvent.RECEIVE_GOAL, (playerId: PlayerID) => {
            console.log("GOAL !!!");
            this.playersScore.handleGoal(playerId);
        });
        this.on(GameEvent.RESET, (ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) => {
            console.log("received RESET");
            this.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        })
        window.addEventListener("resize", () => this.handleDisplayResize());
        this.handleDisplayResize();
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
