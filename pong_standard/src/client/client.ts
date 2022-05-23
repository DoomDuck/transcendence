import { ClientGame } from './ClientGame';
import { io } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';

function startGame(playerId: number) {
    // game
    const game = new ClientGame(playerId);
    document.body.appendChild(game.domElement);

    // socketio
    const socket = io();

    // events
    // outgoing
    game.thisBar().on(GameEvent.SET_BAR_POSITION, (y: number) => {
        socket.emit(GameEvent.SET_BAR_POSITION, y);
    })
    // incoming
    socket.on("connect", () => {
        socket.emit("playerId", playerId);
        console.log("connected to server");
    });
    socket.on(GameEvent.SET_OTHER_PLAYER_BAR_POSITION, (y: number) => {
        game.emit(GameEvent.SET_OTHER_PLAYER_BAR_POSITION, y);
    });
    socket.on(GameEvent.GOAL, (playerId: PlayerID) => {
        game.emit(GameEvent.GOAL, playerId);
    });
    socket.on(GameEvent.SET_BALL, (x: number, y: number, vx: number, vy: number) => {
        game.emit(GameEvent.SET_BALL, x, y, vx, vy);
    });

    // // simulation
    // let lastTimeStamp = 0;
    // let elapsedTime;

    // function animate(timeStamp: number) {
    //     elapsedTime = timeStamp - lastTimeStamp;
    //     lastTimeStamp = timeStamp;

    //     requestAnimationFrame(animate);
    //     game.update(elapsedTime);
    //     game.emmit(socket);
    //     game.render();
    // }
    // animate(0);
}

document.getElementById("launch-0")?.addEventListener("click", () => startGame(0));
document.getElementById("launch-1")?.addEventListener("click", () => startGame(1));
document.getElementById("launch-2")?.addEventListener("click", () => startGame(2));
