import { ClientGame } from './ClientGame';
import { io } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';

let game: ClientGame;
let domElementAdded = false;

// socketio
const socket = io();
socket.on("connect", () => {
    console.log("connected to server");
});
socket.on("disconnect", ()=> {
    if (domElementAdded) {
        document.body.removeChild(game.domElement);
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
    // game
    game = new ClientGame(playerId);
    document.body.appendChild(game.domElement);
    domElementAdded = true;

    // outgoing events
    game.thisBar().on(GameEvent.SET_BAR_POSITION, (y: number) => {
        socket.emit(GameEvent.SET_BAR_POSITION, y);
    });
    // incomming events
    const transmitEventFromServerToGame = (event: string) => {
        socket.on(event, (...args: any[]) => { game.emit(event, ...args) });
    }
    transmitEventFromServerToGame(GameEvent.SET_OTHER_PLAYER_BAR_POSITION);
    transmitEventFromServerToGame(GameEvent.GOAL);
    transmitEventFromServerToGame(GameEvent.SET_BALL);
    transmitEventFromServerToGame(GameEvent.START);
    transmitEventFromServerToGame(GameEvent.RESET);
    transmitEventFromServerToGame(GameEvent.PAUSE);
    transmitEventFromServerToGame(GameEvent.UNPAUSE);

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
