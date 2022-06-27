import * as THREE from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Camera, PlayersScoreDisplay } from '../graphic';
import { ClientBall, ClientBar, ClientPlayersScore } from '../entities';

import { GSettings, PLAYER1, PLAYER2, PlayerID } from '../../common/constants';
import { Game } from "../../common/game";
import { GameEvent } from '../../common/constants';
import { Bar, GameState } from '../../common/entities';
import { ExtendedPhysics, StandardPhysics } from '../../common/physics';

/**
 * The game instance on the client's side.
 * It adds to Game the rendering capability, the handling and transmission
 * to the server of the client's keyboard input.
 */
export class ClientGame extends Game {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    camera: Camera;
    playerId: PlayerID;
    otherPlayerId: PlayerID;
    container: HTMLDivElement;

    constructor(playerId: PlayerID, container: HTMLDivElement) {
        // game state
        const ball = new ClientBall(playerId);
        const bars: [ClientBar, ClientBar] = [
            new ClientBar(PLAYER1),
            new ClientBar(PLAYER2),
        ];
        const playersScore = new ClientPlayersScore(new PlayersScoreDisplay());
        const physics = new ExtendedPhysics(ball, bars)
        const gameState = new GameState(physics, [ball, bars[0], bars[1]]);
        super(gameState, playersScore);

        // player-realted info
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;

        // events specific to ClientGame
        let otherBar = bars[this.otherPlayerId];
        this.onIn(GameEvent.RECEIVE_BAR_KEYDOWN, otherBar.onReceiveKeydown.bind(otherBar));
        this.onIn(GameEvent.RECEIVE_BAR_KEYUP, otherBar.onReceiveKeyup.bind(otherBar));
        this.onIn(GameEvent.RECEIVE_SET_BALL, ball.handleReceiveSetBall.bind(ball));
        const controllableBar = bars[playerId];
        window.addEventListener('keydown',(e: KeyboardEvent) => controllableBar.handleKeydown(e, this.emitOut.bind(this)), false);
        window.addEventListener('keyup',(e: KeyboardEvent) => controllableBar.handleKeyup(e, this.emitOut.bind(this)), false);

        // renderers
        this.container = container;
        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer();

        // scene
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bars[0].mesh);
        this.scene.add(bars[1].mesh);
        this.scene.add(playersScore.graphicalObject.group);
        this.loadBackground();

        // callbacks
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
            "/public/img/background.jpg",
            onLoad,
            onProgress,
            onError,
        );
    }

    handleDisplayResize() {
        let width, height;
        let availableWidth = this.container.offsetWidth;
        let availableHeight = this.container.offsetHeight;
        if (availableWidth / availableHeight < GSettings.SCREEN_RATIO) {
            width = availableWidth;
            height = availableWidth / GSettings.SCREEN_RATIO;
        }
        else {
            width = GSettings.SCREEN_RATIO * availableHeight;
            height = availableHeight;
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
