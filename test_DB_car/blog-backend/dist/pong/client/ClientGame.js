"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGame = void 0;
const THREE = require("three");
const Camera_1 = require("./Camera");
const constants_1 = require("../common/constants");
const Game_1 = require("../common/Game");
const ClientBall_1 = require("./ClientBall");
const ClientBar_1 = require("./ClientBar");
const ClientBarControlled_1 = require("./ClientBarControlled");
const constants_2 = require("../common/constants");
const ClientGameState_1 = require("./ClientGameState");
const PlayersScore_1 = require("./PlayersScore");
const CSS2DRenderer_1 = require("three/examples/jsm/renderers/CSS2DRenderer");
class ClientGame extends Game_1.Game {
    constructor(playerId) {
        const ball = new ClientBall_1.ClientBall(playerId);
        const bar1 = (playerId == constants_1.PLAYER1) ? new ClientBarControlled_1.ClientBarControlled(constants_1.PLAYER1) : new ClientBar_1.ClientBar(constants_1.PLAYER1);
        const bar2 = (playerId == constants_1.PLAYER2) ? new ClientBarControlled_1.ClientBarControlled(constants_1.PLAYER2) : new ClientBar_1.ClientBar(constants_1.PLAYER2);
        const gameState = new ClientGameState_1.ClientGameState(ball, bar1, bar2, playerId);
        super(gameState);
        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer_1.CSS2DRenderer();
        this.labelRenderer.domElement.className = 'game-text';
        this.scene = new THREE.Scene();
        this.camera = new Camera_1.Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        this.playersScore = new PlayersScore_1.PlayersScore();
        this.scene.add(this.playersScore.group);
        this.loadBackground();
        this.playerId = playerId;
        this.otherPlayerId = (playerId == constants_1.PLAYER1) ? constants_1.PLAYER2 : constants_1.PLAYER1;
        this.on(constants_2.GameEvent.RECEIVE_GOAL, (playerId) => {
            console.log("GOAL !!!");
            this.playersScore.handleGoal(playerId);
        });
        this.on(constants_2.GameEvent.RESET, (ballX, ballY, ballSpeedX, ballSpeedY) => {
            console.log("received RESET");
            this.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        });
        window.addEventListener("resize", () => this.handleDisplayResize());
        this.handleDisplayResize();
    }
    loadBackground() {
        const onLoad = (texture) => {
            this.scene.background = texture;
            console.log('Texture loaded');
            this.render();
        };
        const onProgress = () => { };
        const onError = (e) => {
            console.log(`Error loading texture: ${e}`);
        };
        new THREE.TextureLoader().load("/img/background.jpg", onLoad, onProgress, onError);
    }
    handleDisplayResize() {
        let width, height;
        if (window.innerWidth / window.innerHeight < constants_1.GSettings.SCREEN_RATIO) {
            width = window.innerWidth;
            height = window.innerWidth / constants_1.GSettings.SCREEN_RATIO;
        }
        else {
            width = constants_1.GSettings.SCREEN_RATIO * window.innerHeight;
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
exports.ClientGame = ClientGame;
//# sourceMappingURL=ClientGame.js.map