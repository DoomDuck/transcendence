import { GSettings, PLAYER1, PLAYER2, PlayerID } from '../../common/constants';
import { Game } from "../../common/game";
import { handleKeydownOnline, handleKeyupOnline, handleKeydownOffline, handleKeyupOffline } from './keyboardInput';
import { Renderer } from '../graphic/Renderer';
import { GameProducedEvent } from '../../common/game/events';
import { delay } from '../../common/utils';

/**
 * Holds the game instance on the client's side.
 * It adds to Game the rendering capability, the handling
 * of the client's keyboard inputs and its transmission to the server.
 */
export class ClientGameManager {
    game: Game;
    online: boolean;
    playerId?: PlayerID;
    otherPlayerId?: PlayerID;
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    renderer: Renderer;

    constructor(playerId?: PlayerID) {
        this.game = new Game();
        this.online = (playerId !== undefined)
        // player-realted info
        this.playerId = playerId;
        if (playerId !== undefined)
            this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;

        // events specific to ClientGame
        // let otherBar = bars[this.otherPlayerId];
        // this.onIn(GameEvent.RECEIVE_BAR_KEYDOWN, otherBar.onReceiveKeydown.bind(otherBar));
        // this.onIn(GameEvent.RECEIVE_BAR_KEYUP, otherBar.onReceiveKeyup.bind(otherBar));
        // this.onIn(GameEvent.RECEIVE_SET_BALL, ball.handleReceiveSetBall.bind(ball));
        if (playerId !== undefined) {
            window.addEventListener('keydown', (e: KeyboardEvent) => handleKeydownOnline(e, this.game.state, playerId), false);
            window.addEventListener('keyup', (e: KeyboardEvent) => handleKeyupOnline(e, this.game.state, playerId), false);
        }
        else {
            window.addEventListener('keydown', (e: KeyboardEvent) => handleKeydownOffline(e, this.game.state), false);
            window.addEventListener('keyup', (e: KeyboardEvent) => handleKeyupOffline(e, this.game.state), false);
        }

        // HTML
        this.container = document.getElementById('game-container') as HTMLDivElement;
        this.canvas = document.getElementById('game-screen') as HTMLCanvasElement;
        this.renderer = new Renderer(this.canvas, this.game.state.data);

        // scene
        this.handleDisplayResize();

        // callbacks
        window.addEventListener("resize", () => this.handleDisplayResize());
        GameProducedEvent.registerEvent("ballOut", (time: number, playerId: number) => {
            this.game.pause();
            this.renderer.startVictoryAnimationAsync()
            .then(() => this.game.reset(0, 0, (playerId == 0 ? -1: 1) * GSettings.BALL_INITIAL_SPEEDX, 0))
            .then(() => this.renderer.scorePanels.increment(playerId))
            .then(() => delay(500))
            .then(() => this.game.start());
        });
    }

    handleDisplayResize() {
        let width: number, height: number;
        let availableWidth = this.container.offsetWidth;
        let availableHeight = this.container.offsetHeight;
        if (availableWidth / availableHeight < GSettings.SCREEN_RATIO) {
            width = availableWidth;
            height = availableWidth / GSettings.SCREEN_RATIO;
        }
        else {
            width = GSettings.SCREEN_RATIO * availableHeight;
            height = availableHeight;
        }
        this.renderer.handleResize(width, height);
    }

    render(time: number) {
        this.renderer.render(time);
    }
}
