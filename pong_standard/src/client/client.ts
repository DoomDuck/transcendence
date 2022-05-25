import { ClientGame } from './ClientGame';
import { io } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';

function startGame(playerId: number) {
    // game
    const game = new ClientGame(playerId);
    document.body.appendChild(game.domElement);

    // socketio
    const socket = io();
    socket.on("connect", () => {
        socket.emit("playerId", playerId);
        console.log("connected to server");
    });
    socket.on("start", () => console.log("start"))

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
        // plante
        game.frame();
        game.render();
    }
    animate();
}

document.getElementById("launch-0")?.addEventListener("click", () => startGame(0));
document.getElementById("launch-1")?.addEventListener("click", () => startGame(1));
document.getElementById("launch-2")?.addEventListener("click", () => startGame(2));
