import {
  PLAYER1,
  PLAYER2,
  GameEvent,
  LEFT,
  RIGHT,
  Direction,
  GSettings,
} from "../common/constants";
import { Socket } from "socket.io";
import { BarInputEvent, Game } from "../common/game";
import {
  BarInputEventStruct,
  GameProducedEvent,
  SpawnGravitonEvent,
} from "../common/game/events";

/**
 * Manage a full game session between two players (sockets) in the server
 * Centralize event management by broadcast and transmission
 */
export class ServerGameContext {
  private game: Game;
  private ready: [boolean, boolean] = [false, false];
  score: [number, number] = [0, 0];
  ballDirection: number = LEFT;

  constructor(private players: [Socket, Socket]) {
    this.game = new Game();
    for (let [emitter, receiver] of [
      [PLAYER1, PLAYER2],
      [PLAYER2, PLAYER1],
    ]) {
      this.players[emitter].on(
        GameEvent.SEND_BAR_EVENT,
        (...args: BarInputEventStruct) => {
          this.players[receiver].emit(GameEvent.RECEIVE_BAR_EVENT, ...args);
          this.game.state.registerEvent(new BarInputEvent(...args));
        }
      );
      this.players[emitter].on(GameEvent.READY, () => this.isReady(emitter));
    }
    // setupEventForTransmission<BarInputEvent>(GameEvent.SEND_BAR_EVENT, GameEvent.RECEIVE_BAR_EVENT);
    // setupEventForTransmission: GameEvent.BALL_BAR_COLLISION,
    // setupEventForTransmission: GameEvent.NO_BALL_BAR_COLLISION,

    // ?? GameProducedEvent.registerEvent(/* NO_COLLISION */, this.handleGoal.bind(this));

    // ??? GameProducedEvent.registerEvent(/* MID_FIELD */, this.broadcastEvent.bind(this));
    GameProducedEvent.registerEvent(
      "ballOut",
      (time: number, playerId: number) => {
        this.game.pause();
        this.handleGoal(playerId);
      }
    );

    setInterval(this.game.frame.bind(this.game), GSettings.GAME_STEP_MS);
    setInterval(this.spawnGraviton.bind(this), 3000);
    // setInterval(() => {
    //   this.game.frame();
    //   console.log(this.game.state.data.ballCurrent.x);
    // }, GSettings.GAME_STEP_MS);
  }

  isReady(playerId: number) {
    this.ready[playerId] = true;
    if (this.ready[0] && this.ready[1]) {
      console.log("both players are ready, starting");
      this.ready = [false, false];
      this.reset(0, 0, this.ballDirection);
      this.start(500);
    }
  }

  broadcastEvent(event: string, ...args: any[]) {
    this.players[PLAYER1].emit(event, ...args);
    this.players[PLAYER2].emit(event, ...args);
  }

  start(delay: number) {
    const startTime = Date.now() + delay;
    this.game.start(startTime);
    this.players[0].emit(GameEvent.START, startTime);
    this.players[1].emit(GameEvent.START, startTime);
  }

  pause(delay: number) {
    const pauseTime = Date.now() + delay;
    this.game.pause(pauseTime);
    this.players[0].emit(GameEvent.PAUSE, pauseTime);
    this.players[1].emit(GameEvent.PAUSE, pauseTime);
  }

  reset(ballX: number, ballY: number, ballDirection: Direction) {
    let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
    let ballSpeedY = ((2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX) / 3;
    this.game.emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    this.players[0].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    this.players[1].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
  }

  spawnGraviton() {
    const time =
      this.game.state.data.actualNow + GSettings.GRAVITON_ONLINE_SPAWN_DELAY;
    let x = GSettings.GRAVITON_SPAWN_WIDTH * (Math.random() - 0.5);
    let y = GSettings.GRAVITON_SPAWN_HEIGHT * (Math.random() - 0.5);
    this.players[0].emit(GameEvent.SPAWN_GRAVITON, time, x, y);
    this.players[1].emit(GameEvent.SPAWN_GRAVITON, time, x, y);
    this.game.emit(GameEvent.SPAWN_GRAVITON, time, x, y);
  }

  handleGoal(playerId: number) {
    // console.log("GOAL !!!");
    this.broadcastEvent(GameEvent.GOAL, playerId);
    this.ballDirection = playerId == PLAYER1 ? RIGHT : LEFT;
    // delay(500)
    //   .then(() => this.reset(0, 0, ballDirection))
    //   .then(() => this.start(500));
  }
}
