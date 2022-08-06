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
import { BarInputEventStruct } from "../common/game/events";
import { Spawner } from "../common/game/Spawner";
import {
  delay,
  randomGravitonCoords,
  randomPortalCoords,
  removeIfPresent,
} from "../common/utils";

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
  observers: Socket[] = [];
  alreadyStarted: boolean = false;
  gameLoopHandle?: ReturnType<typeof setInterval>;
  // observerSendStateQueue: ((Game) => void)[] = [];

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

    this.gameLoopHandle = setInterval(() => {
      this.game.frame();
      this.spawner.frame();
      for (let observer of this.observers) {
        observer.emit(GameEvent.OBSERVER_UPDATE, this.game.state.data.current);
      }
    }, GSettings.GAME_STEP_MS);
  }

  isReady(playerId: number) {
    this.ready[playerId] = true;
    if (this.ready[0] && this.ready[1] && !this.game.isOver()) {
      this.alreadyStarted = true;
      console.log("both players are ready, starting");
      this.ready = [false, false];
      this.reset(0, 0, this.ballDirection);
      this.start(500);
    }
  }

  addObserver(socket: Socket) {
    this.observers.push(socket);
    socket.on("disconnect", () => {
      removeIfPresent(this.observers, socket);
    });
  }

  broadcastEventPlayersOnly(event: string, ...args: any[]) {
    this.game.emit(event, ...args);
    this.players[PLAYER1].emit(event, ...args);
    this.players[PLAYER2].emit(event, ...args);
  }

  broadcastEventEveryone(event: string, ...args: any[]) {
    this.game.emit(event, ...args);
    this.players[PLAYER1].emit(event, ...args);
    this.players[PLAYER2].emit(event, ...args);
    for (let observer of this.observers) {
      observer.emit(event, ...args);
    }
  }

  start(delay: number) {
    const startTime = Date.now() + delay;
    this.broadcastEventPlayersOnly(GameEvent.START, startTime);
    this.spawner.start(startTime);
  }

  pause(delay: number) {
    const pauseTime = Date.now() + delay;
    this.broadcastEventPlayersOnly(GameEvent.PAUSE, pauseTime);
    this.spawner.pause(pauseTime);
  }

  reset(ballX: number, ballY: number, ballDirection: Direction) {
    let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
    let ballSpeedY = ((2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX) / 3;
    this.broadcastEventEveryone(
      GameEvent.RESET,
      ballX,
      ballY,
      ballSpeedX,
      ballSpeedY
    );
    this.spawner.reset();
  }

  spawnGraviton() {
    const time = this.game.state.data.actualNow + GSettings.ONLINE_SPAWN_DELAY;
    const [x, y] = randomGravitonCoords();
    this.broadcastEventPlayersOnly(GameEvent.SPAWN_GRAVITON, time, x, y);
  }

  spawnPortal() {
    const time = this.game.state.data.actualNow + GSettings.ONLINE_SPAWN_DELAY;
    const [x1, x2, y1, y2] = randomPortalCoords();
    this.broadcastEventPlayersOnly(
      GameEvent.SPAWN_PORTAL,
      time,
      x1,
      y1,
      x2,
      y2
    );
  }

  handleGoal(playerId: number) {
    console.log("GOAL !!!");
    this.game.pause();
    this.spawner.pause();
    this.broadcastEventEveryone(GameEvent.GOAL, playerId);
    if (this.game.isOver()) {
      this.handleEndOfGame();
    }
    this.ballDirection = playerId == PLAYER1 ? LEFT : RIGHT;
  }

  handleEndOfGame() {
    this.players[0].disconnect();
    this.players[1].disconnect();
    for (let observer of this.observers) {
      observer.disconnect();
    }
    clearInterval(this.gameLoopHandle);
    this.onFinish();
  }
}
