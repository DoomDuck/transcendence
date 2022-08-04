import { GameEvent, GSettings } from "../constants";
import { GameState } from "../entities";
import { updateSpawnable } from "../entities/update";
import {
  BarInputEvent,
  type BarInputEventStruct,
  type SpawnGravitonEventStruct,
  SpawnGravitonEvent,
  SpawnPortalEvent,
  type SpawnPortalEventStruct,
  GameProducedEvent,
} from "./events";

/**
 * Game represents the environment representing an ongoing game between two players.
 * It is meant to be the bridge between the 'unanimated' game state and the outside
 * (i.e. all the communication + game loop and time-related problematics).
 * Instanciated by both client (in ClientGameManager) and server (in ServerGameContext)
 */
export class Game {
  state: GameState = new GameState();
  startTime: number = 0;
  pauseTime: number = 0;
  pauseOffetEarly: number = 0;
  lastTime: number = 0;
  timeAccumulated: number = 0;
  paused: boolean = true;
  score: [number, number] = [0, 0];
  incommingEventsCallback: Map<string, any>;

  constructor() {
    const eventsCallbackPairs: [string, any][] = [
      [GameEvent.START, this.start.bind(this)],
      [GameEvent.PAUSE, this.pause.bind(this)],
      [GameEvent.RESET, this.reset.bind(this)],
      [GameEvent.GOAL, this.goal.bind(this)],
      [
        GameEvent.RECEIVE_BAR_EVENT,
        (...eventArgs: BarInputEventStruct) => {
          this.state.registerEvent(new BarInputEvent(...eventArgs));
        },
      ],
      [
        GameEvent.SPAWN_GRAVITON,
        (...eventArgs: SpawnGravitonEventStruct) => {
          this.state.registerEvent(new SpawnGravitonEvent(...eventArgs));
        },
      ],
      [
        GameEvent.SPAWN_PORTAL,
        (...eventArgs: SpawnPortalEventStruct) => {
          this.state.registerEvent(new SpawnPortalEvent(...eventArgs));
        },
      ],
    ];
    this.incommingEventsCallback = new Map(eventsCallbackPairs);
    this.resetTime();
  }

  on(event: string, callback: any) {
    this.incommingEventsCallback.set(event, callback);
  }

  emit(event: string, ...args: any[]) {
    this.incommingEventsCallback.get(event)?.call(this, ...args);
  }


  reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
    // console.log('Game reset');
    // this.timeAccumulated = 0;
    // this.paused = true;
    this.resetTime();
    this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
  }

  goal(playerId: number) {
    this.score[playerId]++;
  }

  // start(startTime?: number) {
  //   if (startTime === undefined) startTime = Date.now();
  //   // console.log(`Game start at ${startTime}`);
  //   this.paused = false;
  //   this.startTime = startTime + this.pauseOffetEarly;
  //   this.lastTime = this.startTime;
  //   this.pauseOffetEarly = 0;
  // }

  // pause(pauseTime?: number) {
  //   if (pauseTime === undefined) pauseTime = Date.now();
  //   else this.pauseOffetEarly = Math.max(Date.now() - pauseTime, 0);
  //   this.pauseTime = pauseTime;
  //   // console.log(`Game pause at ${pauseTime}`);
  //   this.paused = true;
  // }

  // frame() {
  //   const now = Date.now();
  //   if (
  //     (this.paused && now >= this.pauseTime) ||
  //     (!this.paused && now < this.startTime)
  //   )
  //     return;
  //   const newTime = now;
  //   const dt = newTime - this.lastTime;
  //   this.timeAccumulated += dt;
  //   this.lastTime = newTime;

  //   while (this.timeAccumulated >= GSettings.GAME_STEP_MS) {
  //     this.timeAccumulated -= GSettings.GAME_STEP_MS;
  //     this.state.update();
  //   }
  // }

  private resetTime() {
    this.timeAccumulated = 0;
    this.pause();
    this.lastTime = this.pauseTime;
  }

  start(startTime?: number) {
    if (startTime === undefined) startTime = Date.now();
    this.paused = false;
    this.startTime = startTime;
  }

  pause(pauseTime?: number) {
    if (pauseTime === undefined) pauseTime = Date.now();
    this.paused = true;
    this.pauseTime = pauseTime;
  }

  private spendAccumulatedTime() {
    while (this.timeAccumulated >= GSettings.GAME_STEP_MS) {
      this.timeAccumulated -= GSettings.GAME_STEP_MS;
      this.state.update();
    }
  }

  frame() {
    const now = Date.now();
    let accumulated: number;

    if (this.paused) {
      if (this.pauseTime > now) {
        accumulated =  now - this.lastTime;
      }
      else if (this.lastTime < this.pauseTime) {
        accumulated = this.pauseTime - this.lastTime;
      }
      else {
        this.lastTime = now;
        return;
      }
    }
    else {
      if (this.startTime > now) {
        this.lastTime = now;
        return;
      }
      else if (this.lastTime < this.startTime) {
        accumulated = now - this.startTime;
        this.lastTime = now;
      }
      else {
        accumulated = now - this.lastTime;
      }
    }
    this.lastTime = now;
    this.timeAccumulated += accumulated;
    this.spendAccumulatedTime();
  }

  isOver(): boolean {
    return (
      this.score[0] >= GSettings.GAME_SCORE_VICTORY ||
      this.score[1] >= GSettings.GAME_SCORE_VICTORY
    );
  }

  winner(): number {
    return this.score[0] >= this.score[1] ? 0 : 1;
  }
}


// {
//   let startTime, pauseTime;
//   let lastTime;
//   let accumulatedTime;
//   let paused;

//   function start(instant) {
//     paused = false;
//     startTime = instant;
//   }

//   function pause(instant) {
//     paused = true;
//     pauseTime = instant;
//   }

//   function frame(now) {
//     if (paused) {
//       if (pauseTime > now) {
//         accumulated =  now - lastTime;
//         lastTime = now
//       }
//       else {
//         accumulated = pauseTime - lastTime;
//         lastTime = pauseTime;
//       }
//     }
//     else {
//       if (startTime > now) {
//         return;
//       }
//       else {
//         accumulated = startTime - lastTime;
//         lastTime = now;
//       }
//     }

//     accumulate;
//     update;
//   }
// }