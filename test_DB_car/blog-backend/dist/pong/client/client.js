"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const ClientGame_1 = require("./ClientGame");
const socket_io_client_1 = require("socket.io-client");
const constants_1 = require("../common/constants");
const ClientSynchroTime_1 = require("./ClientSynchroTime");
let game;
let domElementAdded = false;
const socket = (0, socket_io_client_1.io)();
let synchroTime = new ClientSynchroTime_1.ClientSynchroTime(socket);
synchroTime.connect().then(() => {
    console.log(`SyncroTime connected: ${synchroTime.connected}`);
});
socket.on("connect", () => {
    console.log("connected to server");
});
socket.on("disconnect", () => {
    if (domElementAdded) {
        document.body.removeChild(game.renderer.domElement);
        document.body.removeChild(game.labelRenderer.domElement);
        domElementAdded = false;
    }
});
socket.on("playerIdUnavailable", (playerId) => {
    alert(`playerId ${playerId} is already taken`);
});
socket.on("playerIdAlreadySelected", (playerId) => {
});
socket.on("playerIdConfirmed", (playerId) => {
    startGame(playerId);
});
function startGame(playerId) {
    console.log('starting game');
    game = new ClientGame_1.ClientGame(playerId);
    document.body.appendChild(game.renderer.domElement);
    document.body.appendChild(game.labelRenderer.domElement);
    domElementAdded = true;
    const transmitEventFromGameToServer = (event, eventEmitter) => {
        eventEmitter.on(event, (...args) => { socket.emit(event, ...args); });
    };
    transmitEventFromGameToServer(constants_1.GameEvent.SEND_BAR_KEYDOWN, game.state.bars[game.playerId]);
    transmitEventFromGameToServer(constants_1.GameEvent.SEND_BAR_KEYUP, game.state.bars[game.playerId]);
    transmitEventFromGameToServer(constants_1.GameEvent.SEND_SET_BALL, game.state);
    transmitEventFromGameToServer(constants_1.GameEvent.SEND_GOAL, game.state.ball);
    const transmitEventFromServerToGame = (event, eventEmitter) => {
        socket.on(event, (...args) => { eventEmitter.emit(event, ...args); });
    };
    transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_BAR_KEYDOWN, game.state.bars[game.otherPlayerId]);
    transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_BAR_KEYUP, game.state.bars[game.otherPlayerId]);
    transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_GOAL, game);
    transmitEventFromServerToGame(constants_1.GameEvent.START, game);
    transmitEventFromServerToGame(constants_1.GameEvent.RESET, game);
    transmitEventFromServerToGame(constants_1.GameEvent.PAUSE, game);
    transmitEventFromServerToGame(constants_1.GameEvent.UNPAUSE, game);
    transmitEventFromServerToGame(constants_1.GameEvent.RECEIVE_SET_BALL, game.state);
    socket.emit("playerReady");
    function animate() {
        requestAnimationFrame(animate);
        game.frame();
        game.render();
    }
    animate();
}
(_a = document.getElementById("launch-0")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => socket.emit("playerIdSelect", 0));
(_b = document.getElementById("launch-1")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => socket.emit("playerIdSelect", 1));
(_c = document.getElementById("launch-2")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => socket.emit("playerIdSelect", 2));
//# sourceMappingURL=client.js.map