import * as THREE from 'three'
import { Camera } from './Camera';
import { GSettings, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from '../common/constants';
import { Game } from "../common/Game";
import { GameState } from '../common/GameState';
import { ClientBall } from './ClientBall';
import { ClientBar } from './ClientBar';
import { GameEvent } from '../common/constants';
import { PlayersScore } from './PlayersScore';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { ClientGameState } from './ClientGameState';
import { ServerBall } from './ServerBall';

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
        const clientBall = new ClientBall(playerId);
        const serverBall = new ServerBall();
        const [bar1, bar2] = [
            new ClientBar(PLAYER1, {controllable: playerId == PLAYER1}),
            new ClientBar(PLAYER2, {controllable: playerId == PLAYER2}),
        ]
        const gameState = new ClientGameState(serverBall, bar1, bar2, clientBall);
        super(gameState);

        // player-realted info
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;

        // events specific to ClientGame
        let otherBar = this.state.bars[this.otherPlayerId];
        this.on(GameEvent.RECEIVE_BAR_KEYDOWN, otherBar.onReceiveKeydown.bind(otherBar));
        this.on(GameEvent.RECEIVE_BAR_KEYUP, otherBar.onReceiveKeyup.bind(otherBar));

        // renderers
        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.domElement.className = 'game-text';

        // scene
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.scene.add(clientBall.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        // this.scene.add(gameState.serverBallEstimation.mesh);
        this.playersScore = new PlayersScore();
        this.scene.add(this.playersScore.group);
        this.loadBackground();

        // callbacks
        this.on(GameEvent.GOAL, (playerId: PlayerID) => {
            console.log("GOAL !!!");
            this.playersScore.handleGoal(playerId);
        });
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
