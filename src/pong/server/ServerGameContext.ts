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
import { Spawner } from "../common/game/Spawner";
import { delay, randomGravitonCoords, randomPortalCoords } from "../common/utils";

/**
 * Manage a full game session between two players (sockets) in the server
 * Centralize event management by broadcast and transmission
 * Instanciated in the backend whenever a game should start
 */
export class ServerGameContext {
  game: Game;
  ready: [boolean, boolean] = [false, false];
  score: [number, number] = [0, 0];
  ballDirection: number = LEFT;
  spawner: Spawner;

  constructor(public players: [Socket, Socket], public onFinish: () => void) {
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
      this.players[emitter].on(GameEvent.BALL_OUT, (playerId: number) => {
        this.handleGoal(playerId);
      });
    }

    this.spawner = new Spawner(
      this.spawnGraviton.bind(this),
      this.spawnPortal.bind(this)
    );

    setInterval(this.game.frame.bind(this.game), GSettings.GAME_STEP_MS);

    //d
    // let i = 500;
    // setTimeout(() => {
    //   setInterval(() => {
    //     Promise.resolve(this.pause(100))
    //       .then(() => delay(i))
    //       .then(() => {this.start(100); i+=100;})
    //   }, 2000)
    // }, 600)
  }

  isReady(playerId: number) {
    this.ready[playerId] = true;
    if (this.ready[0] && this.ready[1] && !this.game.isOver()) {
      console.log("both players are ready, starting");
      this.ready = [false, false];
      this.reset(0, 0, this.ballDirection);
      this.start(500);
    }
  }

  broadcastEvent(event: string, ...args: any[]) {
    this.game.emit(event, ...args);
    this.players[PLAYER1].emit(event, ...args);
    this.players[PLAYER2].emit(event, ...args);
  }

  start(delay: number) {
    const startTime = Date.now() + delay;
    this.broadcastEvent(GameEvent.START, startTime);
    this.spawner.startSpawning(delay);
  }

  pause(delay: number) {
    const pauseTime = Date.now() + delay;
    this.broadcastEvent(GameEvent.PAUSE, pauseTime);
    this.spawner.stopSpawning();
  }

  reset(ballX: number, ballY: number, ballDirection: Direction) {
    let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
    let ballSpeedY = ((2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX) / 3;
    this.broadcastEvent(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    this.spawner.stopSpawning();
  }

  spawnGraviton() {
    const time = this.game.state.data.actualNow + GSettings.ONLINE_SPAWN_DELAY;
    const [x, y] = randomGravitonCoords();
    this.broadcastEvent(GameEvent.SPAWN_GRAVITON, time, x, y);
  }

  spawnPortal() {
    const time = this.game.state.data.actualNow + GSettings.ONLINE_SPAWN_DELAY;
    const [x1, x2, y1, y2] = randomPortalCoords();
    this.broadcastEvent(GameEvent.SPAWN_PORTAL, time, x1, y1, x2, y2);
  }

  handleGoal(playerId: number) {
    console.log("GOAL !!!");
    this.game.pause();
    this.spawner.stopSpawning();
    this.broadcastEvent(GameEvent.GOAL, playerId);
    if (this.game.isOver()) {
      this.onFinish();
    }
    this.ballDirection = playerId == PLAYER1 ? LEFT : RIGHT;
  }
}
