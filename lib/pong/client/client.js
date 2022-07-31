"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientContext = void 0;
const game_1 = require("./game");
const socket_io_client_1 = require("socket.io-client");
const constants_1 = require("../common/constants");
class ClientContext {
    constructor() {
        this.socket = (0, socket_io_client_1.io)("http://localhost:5000/pong");
        this.gameContainer = document.getElementById("game-container");
        this.gameRendererContainer = document.getElementById("game-screen");
        this.gameLabelRendererContainer = document.getElementById("game-text");
        this.socket.on("connect", () => {
            console.log("connected to server");
        });
        this.socket.on("disconnect", () => {
            if (this.game !== undefined) {
                this.gameRendererContainer.removeChild(this.game.renderer.domElement);
                this.gameLabelRendererContainer.removeChild(this.game.labelRenderer.domElement);
            }
        });
        this.socket.on("playerIdConfirmed", (playerId, ready) => {
            this.startGame(playerId);
            ready();
        });
    }
    startGame(playerId) {
        let game = new game_1.ClientGame(playerId, this.gameContainer);
        this.game = game;
        this.gameRendererContainer.appendChild(game.renderer.domElement);
        this.gameLabelRendererContainer.appendChild(game.labelRenderer.domElement);
        const transmitEventFromGameToServer = (event) => {
            game.onOut(event, (...args) => {
                this.socket.emit(event, ...args);
            });
        };
        transmitEventFromGameToServer(constants_1.GameEvent.SEND_BAR_KEYDOWN);
        transmitEventFromGameToServer(constants_1.GameEvent.SEND_BAR_KEYUP);
        const transmitEventFromServerToGame = (event) => {
            this.socket.on(event, (...args) => {
                game.emitIn(event, ...args);
            });
        };
        transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_BAR_KEYDOWN);
        transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_BAR_KEYUP);
        transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_SET_BALL);
        transmitEventFromServerToGame(constants_1.GameEvent.GOAL);
        transmitEventFromServerToGame(constants_1.GameEvent.START);
        transmitEventFromServerToGame(constants_1.GameEvent.RESET);
        transmitEventFromServerToGame(constants_1.GameEvent.PAUSE);
        transmitEventFromServerToGame(constants_1.GameEvent.UNPAUSE);
        let animate = () => {
            var _a, _b;
            requestAnimationFrame(animate);
            (_a = this.game) === null || _a === void 0 ? void 0 : _a.frame();
            (_b = this.game) === null || _b === void 0 ? void 0 : _b.render();
        };
        animate();
    }
}
exports.ClientContext = ClientContext;
//# sourceMappingURL=client.js.map