import { ClientLocalGame } from './ClientLocalGame';

const game = new ClientLocalGame();
document.body.appendChild(game.domElement)
window.addEventListener('resize', game.handleDisplayResize.bind(game), false);
window.addEventListener('keydown', game.handleKeydown.bind(game), false);
window.addEventListener('keyup', game.handleKeyup.bind(game), false);
game.handleDisplayResize();

let lastTimeStamp = 0;
let elapsedTime;

function animate(timeStamp: number) {
    elapsedTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    requestAnimationFrame(animate);
    game.update(elapsedTime);
    game.render()
}
animate(0);
