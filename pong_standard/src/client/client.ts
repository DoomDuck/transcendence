import { ClientGame } from './ClientGame';
import { io } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';
import { EventEmitter } from 'events';
import { ClientSynchroTime } from './ClientSynchroTime';

let game: ClientGame;
let domElementAdded = false;

// socketio
const socket = io();
////
let synchroTime = new ClientSynchroTime(socket);
synchroTime.connect().then(() => {
    console.log("SyncroTime connected");
});
////
socket.on("connect", () => {
    console.log("connected to server");
});
socket.on("disconnect", ()=> {
    if (domElementAdded) {
        document.body.removeChild(game.renderer.domElement);
        document.body.removeChild(game.labelRenderer.domElement);
        domElementAdded = false;
    }
})
socket.on("playerIdUnavailable", (playerId: number) => {
    alert(`playerId ${playerId} is already taken`)
});
socket.on("playerIdAlreadySelected", (playerId: number) => {
    // alert(`playerId already selected`)
});
socket.on("playerIdConfirmed", (playerId: number) => {
    startGame(playerId);
});

function startGame(playerId: number) {
    console.log('starting game')
    // game
    game = new ClientGame(playerId);
    document.body.appendChild(game.renderer.domElement);
    document.body.appendChild(game.labelRenderer.domElement);
    domElementAdded = true;

    // // outgoing events
    const transmitEventFromGameToServer = (event: string, eventEmitter: EventEmitter) => {
        eventEmitter.on(event, (...args: any[]) => { socket.emit(event, ...args) });
    }
    transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYDOWN, game.state.bars[game.playerId]);
    transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYUP, game.state.bars[game.playerId]);

    // incomming events
    const transmitEventFromServerToGame = (event: string, eventEmitter: EventEmitter) => {
        socket.on(event, (...args: any[]) => { eventEmitter.emit(event, ...args) });
    }
    transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYDOWN, game.state.bars[game.otherPlayerId]);
    transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYUP, game.state.bars[game.otherPlayerId]);
    transmitEventFromServerToGame(GameEvent.GOAL, game);
    transmitEventFromServerToGame(GameEvent.START, game);
    transmitEventFromServerToGame(GameEvent.RESET, game);
    transmitEventFromServerToGame(GameEvent.PAUSE, game);
    transmitEventFromServerToGame(GameEvent.UNPAUSE, game);
    transmitEventFromServerToGame(GameEvent.SET_BALL, game.state.ball);

    // Game loop
    function animate() {
        requestAnimationFrame(animate);
        game.frame();
        game.render();
    }
    animate();
}

document.getElementById("launch-0")?.addEventListener("click", () => socket.emit("playerIdSelect", 0));
document.getElementById("launch-1")?.addEventListener("click", () => socket.emit("playerIdSelect", 1));
document.getElementById("launch-2")?.addEventListener("click", () => socket.emit("playerIdSelect", 2));
