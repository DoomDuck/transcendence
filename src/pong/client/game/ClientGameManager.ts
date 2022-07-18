import { GSettings } from '../../common/constants';
import { Game } from "../../common/game";
import { Renderer } from '../graphic/Renderer';

/**
 * Holds the game instance on the client's side.
 * It adds to Game the rendering capability, the handling
 * of the client's keyboard inputs and its transmission to the server.
 */
export abstract class ClientGameManager {
    game: Game;
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    renderer: Renderer;

    constructor() {
        this.game = new Game();

        // HTML
        this.container = document.getElementById('game-container') as HTMLDivElement;
        this.canvas = document.getElementById('game-screen') as HTMLCanvasElement;
        this.renderer = new Renderer(this.canvas, this.game.state.data);

        // scene
        this.handleDisplayResize();

        // callbacks
        window.addEventListener("resize", () => this.handleDisplayResize());
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
