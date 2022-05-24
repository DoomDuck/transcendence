import { ClientGame } from './ClientGame';
import { io } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';
import { GameManager } from './GameManager';


function startGame(playerId: number) {
    // game
    const game = new ClientGame(playerId);
    document.body.appendChild(game.domElement);
    var gameManager: GameManager;
    
    // socketio
    const socket = io();
    socket.on("connect", () => {
        socket.emit("playerId", playerId);
        console.log("connected to server");
        gameManager = new GameManager(socket, playerId as PlayerID);
        socket.on("start", () => console.log("start"))
    });
}

document.getElementById("launch-0")?.addEventListener("click", () => startGame(0));
document.getElementById("launch-1")?.addEventListener("click", () => startGame(1));
document.getElementById("launch-2")?.addEventListener("click", () => startGame(2));
