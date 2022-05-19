import { ClientGame } from './ClientGame';
import { io } from 'socket.io-client'

function startGame(playerId: number) {
    // game
    const game = new ClientGame(playerId);
    document.body.appendChild(game.domElement)
    window.addEventListener('resize', game.handleDisplayResize.bind(game), false);
    window.addEventListener('keydown', game.handleKeydown.bind(game), false);
    window.addEventListener('keyup', game.handleKeyup.bind(game), false);
    game.handleDisplayResize();

    // socketio
    const socket = io()
    socket.on("connect", () => {
        socket.emit("playerId", playerId);
        console.log("connected to server");
    });
    socket.on("bar", (id: number, y: number) => {
        game.updateBar(id, y);
    });

    // simulation
    var lastTimeStamp = 0;
    var elapsedTime;

    function animate(timeStamp: number) {
        elapsedTime = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;

        requestAnimationFrame(animate);
        game.update(elapsedTime);
        game.emmit(socket);
        game.render();
    }
    animate(0);
}

document.getElementById("launch-0")?.addEventListener("click", () => startGame(0));
document.getElementById("launch-1")?.addEventListener("click", () => startGame(1));
document.getElementById("launch-2")?.addEventListener("click", () => startGame(2));
