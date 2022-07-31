"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGame = void 0;
const THREE = require("three");
const CSS2DRenderer_1 = require("three/examples/jsm/renderers/CSS2DRenderer");
const graphic_1 = require("../graphic");
const entities_1 = require("../entities");
const constants_1 = require("../../common/constants");
const game_1 = require("../../common/game");
const constants_2 = require("../../common/constants");
const entities_2 = require("../../common/entities");
class ClientGame extends game_1.Game {
    constructor(playerId, container) {
        const ball = new entities_1.ClientBall(playerId);
        const [bar1, bar2] = [new entities_1.ClientBar(constants_1.PLAYER1), new entities_1.ClientBar(constants_1.PLAYER2)];
        const playersScore = new entities_1.ClientPlayersScore(new graphic_1.PlayersScoreDisplay());
        const gameState = new entities_2.GameState(ball, bar1, bar2, playersScore);
        super(gameState);
        this.playerId = playerId;
        this.otherPlayerId = playerId == constants_1.PLAYER1 ? constants_1.PLAYER2 : constants_1.PLAYER1;
        let otherBar = this.state.bars[this.otherPlayerId];
        this.onIn(constants_2.GameEvent.RECEIVE_BAR_KEYDOWN, otherBar.onReceiveKeydown.bind(otherBar));
        this.onIn(constants_2.GameEvent.RECEIVE_BAR_KEYUP, otherBar.onReceiveKeyup.bind(otherBar));
        this.onIn(constants_2.GameEvent.RECEIVE_SET_BALL, this.state.ball.handleReceiveSetBall.bind(this.state.ball));
        const controllableBar = this.state.bars[playerId];
        window.addEventListener("keydown", (e) => controllableBar.handleKeydown(e, this.emitOut.bind(this)), false);
        window.addEventListener("keyup", (e) => controllableBar.handleKeyup(e, this.emitOut.bind(this)), false);
        this.container = container;
        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer_1.CSS2DRenderer();
        this.scene = new THREE.Scene();
        this.camera = new graphic_1.Camera();
        this.scene.add(ball.mesh);
        this.scene.add(bar1.mesh);
        this.scene.add(bar2.mesh);
        this.scene.add(playersScore.graphicalObject.group);
        this.loadBackground();
        window.addEventListener("resize", () => this.handleDisplayResize());
        this.handleDisplayResize();
    }
    loadBackground() {
        const onLoad = (texture) => {
            this.scene.background = texture;
            console.log("Texture loaded");
            this.render();
        };
        const onProgress = () => { };
        const onError = (e) => {
            console.log(`Error loading texture: ${e}`);
        };
        new THREE.TextureLoader().load("/public/img/background.jpg", onLoad, onProgress, onError);
    }
    handleDisplayResize() {
        let width, height;
        let availableWidth = this.container.offsetWidth;
        let availableHeight = this.container.offsetHeight;
        if (availableWidth / availableHeight < constants_1.GSettings.SCREEN_RATIO) {
            width = availableWidth;
            height = availableWidth / constants_1.GSettings.SCREEN_RATIO;
        }
        else {
            width = constants_1.GSettings.SCREEN_RATIO * availableHeight;
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
exports.ClientGame = ClientGame;
//# sourceMappingURL=ClientGame.js.map