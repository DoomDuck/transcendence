// import { PlayersScoreDisplay } from '../graphic';
import { ClientBall, ClientBar } from '../entities';

import { GSettings, PLAYER1, PLAYER2, PlayerID } from '../../common/constants';
import { Game, PlayersScore } from "../../common/game";
import { GameEvent } from '../../common/constants';
import { Ball, Bar, GameState } from '../../common/entities';
import { ExtendedPhysics, StandardPhysics } from '../../common/physics';

function createBackground(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): ImageData {
    const width = canvas.width;
    const height = canvas.height;
    const blockSize = canvas.height / 20;

    context.fillStyle = `rgb(0, 0, 0)`;
    context.fillRect(0, 0, width, height);
    
    context.fillStyle = `rgb(173, 173, 173)`;
    context.fillRect(0, 0, width, blockSize);
    context.fillRect(0, height - blockSize, width, blockSize);
    
    for (let step = 1; step < 20; step += 2) {
        context.fillRect(width - blockSize / 2, step * blockSize, blockSize, blockSize);
    }
    return context.getImageData(0, 0, width, height);
}

function gameToCanvasCoord(canvas: HTMLCanvasElement, ratio: number, gameX: number, gameY: number): [number, number] {
    return [ratio * gameX + canvas.width/2, ratio * gameY + canvas.height/2];
}
function drawBall(canvas: HTMLCanvasElement, ratio: number, context: CanvasRenderingContext2D, ball: Ball) {
    context.fillStyle = 'rgb(255, 255, 255)';
    const [x, y] = gameToCanvasCoord(canvas, ratio, ball.position.x, ball.position.y);
    context.ellipse(x, y, 0, ball.radius * ratio, ball.radius * ratio, 0, 2*Math.PI);
}
function drawBar(canvas: HTMLCanvasElement, ratio: number, context: CanvasRenderingContext2D, bar: Bar) {
    context.fillStyle = GSettings.BAR_COLOR;
    const [x1, y1] = gameToCanvasCoord(canvas, ratio, bar.leftX(), bar.topY());
    const [x2, y2] = gameToCanvasCoord(canvas, ratio, bar.rightX(), bar.bottomY());
    context.fillRect(x1, y1, x2, y2);
}


/**
 * The game instance on the client's side.
 * It adds to Game the rendering capability, the handling and transmission
 * to the server of the client's keyboard input.
 */
export class ClientGame extends Game {
    playerId: PlayerID;
    otherPlayerId: PlayerID;
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    background: ImageData;
    ratio: number;

    constructor(playerId: PlayerID) {
        // game state
        const ball = new ClientBall(playerId);
        const bars: [ClientBar, ClientBar] = [
            new ClientBar(PLAYER1),
            new ClientBar(PLAYER2),
        ];
        // const playersScore = new ClientPlayersScore(new PlayersScoreDisplay());
        const playersScore = new PlayersScore();
        const physics = new StandardPhysics(ball, bars)
        const gameState = new GameState(physics, [ball, bars[0], bars[1]]);
        super(gameState, playersScore);

        // player-realted info
        this.playerId = playerId;
        this.otherPlayerId = (playerId == PLAYER1) ? PLAYER2 : PLAYER1;

        // events specific to ClientGame
        let otherBar = bars[this.otherPlayerId];
        this.onIn(GameEvent.RECEIVE_BAR_KEYDOWN, otherBar.onReceiveKeydown.bind(otherBar));
        this.onIn(GameEvent.RECEIVE_BAR_KEYUP, otherBar.onReceiveKeyup.bind(otherBar));
        this.onIn(GameEvent.RECEIVE_SET_BALL, ball.handleReceiveSetBall.bind(ball));
        const controllableBar = bars[playerId];
        window.addEventListener('keydown',(e: KeyboardEvent) => controllableBar.handleKeydown(e, this.emitOut.bind(this)), false);
        window.addEventListener('keyup',(e: KeyboardEvent) => controllableBar.handleKeyup(e, this.emitOut.bind(this)), false);

        // HTML
        this.container = document.getElementById('game-container') as HTMLDivElement;
        this.canvas = document.getElementById('game-screen') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        // scene
        this.handleDisplayResize();

        // callbacks
        window.addEventListener("resize", () => this.handleDisplayResize());
    }

    clearCanvas() {
        this.context.putImageData(this.background, 0, 0);
    }

    handleDisplayResize() {
        let width, height;
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
        this.canvas.width = width;
        this.canvas.height = height;
        this.ratio = width / GSettings.GAME_WIDTH;
        this.background = createBackground(this.canvas, this.context);
    }

    render() {
        for (let entity of this.state.entities) {
            if (entity instanceof Ball) {
                drawBall(this.canvas, this.ratio, this.context, entity);
            }
            else if (entity instanceof Bar) {
                drawBar(this.canvas, this.ratio, this.context, entity);
            }
        }
    }
}
