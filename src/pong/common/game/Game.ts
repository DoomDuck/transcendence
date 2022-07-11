import { EventEmitter } from "events";
import { Socket } from "socket.io-client";
import { GameEvent, GSettings, PlayerID } from "../constants";
import { PLAYER1, PLAYER2 } from "../constants";
import { GameState } from "../entities/GameState";

/**
 * Game represents the environment representing an ongoing game between two players.
 * It is meant to be the bridge between the 'unanimated' game state and the outside
 * (i.e. all the communication + game loop and time-related problematics).
 * Extended in the server (ServerGame), as well as in the client (ClientGame).
 */
export abstract class Game {
  lastTime: number;
  timeAccumulated: number;
  state: GameState;
  paused: boolean;
  incommingEventsCallback: Map<string, any>;
  outgoingEventsBallback: Map<string, any>;

  constructor(state: GameState) {
    this.lastTime = 0;
    this.timeAccumulated = 0;
    this.paused = true;
    this.state = state;
    const eventsCallbackPairs: [string, any][] = [
      [GameEvent.START, this.start.bind(this)],
      [GameEvent.PAUSE, this.pause.bind(this)],
      [GameEvent.UNPAUSE, this.unpause.bind(this)],
      [GameEvent.RESET, this.reset.bind(this)],
      [GameEvent.GOAL, this.goal.bind(this)],
    ];
    this.incommingEventsCallback = new Map(eventsCallbackPairs);
    this.outgoingEventsBallback = new Map();
  }

  onIn(event: string, callback: any) {
    this.incommingEventsCallback.set(event, callback);
  }

  onOut(event: string, callback: any) {
    this.outgoingEventsBallback.set(event, callback);
  }

  emitOut(event: string, ...args: any[]) {
    this.outgoingEventsBallback.get(event)(...args);
  }

  emitIn(event: string, ...args: any[]) {
    this.incommingEventsCallback.get(event)(...args);
  }

  reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
    console.log("Game reset");
    this.timeAccumulated = 0;
    this.paused = true;
    this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
  }

  start() {
    console.log("Game start");
    this.paused = false;
    this.lastTime = Date.now();
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
  }

  unpause() {
    if (!this.paused) return;
    this.paused = false;
    this.lastTime = Date.now();
  }

  goal(playerId: PlayerID) {
    this.state.playersScore.handleGoal(playerId);
  }

  frame() {
    if (this.paused) return;
    let newTime = Date.now();
    let dt = newTime - this.lastTime;
    this.timeAccumulated += dt;
    this.lastTime = newTime;

    while (this.timeAccumulated >= GSettings.GAME_STEP) {
      this.timeAccumulated -= GSettings.GAME_STEP;
      this.update(GSettings.GAME_STEP);
    }
  }

  update(elapsed: number) {
    this.state.update(elapsed);
  }
}
