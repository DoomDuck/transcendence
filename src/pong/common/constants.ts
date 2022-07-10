/**
 * Configuration of the game data
 */

export class GSettings {
    // GAME ---->
    static readonly SCREEN_RATIO = 2;
    static readonly SCREEN_WIDTH = 4;
    static readonly SCREEN_HEIGHT = GSettings.SCREEN_WIDTH / GSettings.SCREEN_RATIO;
    static readonly SCREEN_TOP = -GSettings.SCREEN_HEIGHT / 2;
    static readonly SCREEN_BOTTOM = GSettings.SCREEN_HEIGHT / 2;
    static readonly SCREEN_LEFT = -GSettings.SCREEN_WIDTH / 2;
    static readonly SCREEN_RIGHT = GSettings.SCREEN_WIDTH / 2;
    static readonly GAME_WIDTH = 4;
    static readonly GAME_HEIGHT = GSettings.SCREEN_HEIGHT * 23 / 25;
    static readonly GAME_TOP = -GSettings.GAME_HEIGHT / 2;
    static readonly GAME_BOTTOM = GSettings.GAME_HEIGHT / 2;
    static readonly GAME_LEFT = -GSettings.GAME_WIDTH / 2;
    static readonly GAME_RIGHT = GSettings.GAME_WIDTH / 2;

    // UID
    static readonly SCORE_SIZE = GSettings.SCREEN_WIDTH / 30;
    static readonly SCORE_X = GSettings.SCREEN_WIDTH / 10;
    static readonly SCORE_Y = -GSettings.GAME_HEIGHT * (1 / 2 - 1 / 10);

    // PHYSIC -->
    // static readonly DELTA_T = 1000 / 60;
    static readonly GAME_STEP_MS = 1000 / 60;
    static readonly GAME_STEP_S = 1 / 60;
    static readonly SERVER_EMIT_INTERVAL = 2;

    // Initial values
    // BAR ----->
    static readonly BAR_WIDTH = GSettings.SCREEN_WIDTH / 40;
    static readonly BAR_HEIGHT = GSettings.SCREEN_WIDTH / 10;
    static readonly BAR_WIDTH_HALF = GSettings.BAR_WIDTH / 2;
    static readonly BAR_HEIGHT_HALF = GSettings.BAR_HEIGHT / 2;
    static readonly BAR_INITIALX = 17/40 * GSettings.SCREEN_WIDTH;
    static readonly BAR_INITIALY = 0;
    static readonly BAR_SENSITIVITY = GSettings.SCREEN_WIDTH * 2 / 4;
    static readonly BAR_UP_KEYS = ['ArrowUp', 'w', 'z'];
    static readonly BAR_DOWN_KEYS = ['ArrowDown', 's'];
    // static readonly BAR_COLOR = '0xd14081';
    static readonly BAR_COLOR = 'rgb(209, 64, 129)';
    static readonly BAR_COLLISION_EDGE = GSettings.BAR_INITIALX - GSettings.BAR_WIDTH / 2;

    // BALL ---->
    static readonly BALL_RADIUS = GSettings.SCREEN_WIDTH / 80;
    static readonly BALL_INITIAL_SPEEDX = GSettings.SCREEN_WIDTH / 4;
    // static readonly BALL_INITIAL_SPEEDX = GSettings.SCREEN_WIDTH / 20;
    static readonly BALL_RADIAL_SEGMENTS = 100;
    static readonly BALL_SPEEDX_INCREASE = GSettings.SCREEN_WIDTH / 20;
    static readonly BALL_SPEEDX_CORNER_BOOST = GSettings.BALL_SPEEDX_INCREASE * 2;
    static readonly BALL_SPEEDX_MAX = GSettings.SCREEN_WIDTH;
    static readonly BALL_SPEEDY_MAX = GSettings.SCREEN_WIDTH * 12 / 20;
    static readonly BALL_SPEEDY_COLLISION_MAX = GSettings.BALL_SPEEDY_MAX * 2 / 3;
    static readonly BALL_COLLISION_VY_RATIO = GSettings.BALL_SPEEDY_COLLISION_MAX / (GSettings.BAR_HEIGHT / 2 + GSettings.BALL_RADIUS);
    static readonly BALL_CONTROL_FRONTIER_X_CLIENT = GSettings.BAR_INITIALX - 1/10 * GSettings.SCREEN_WIDTH;
    static readonly BALL_CONTROL_FRONTIER_X_SERVER = GSettings.BAR_INITIALX - 2/10 * GSettings.SCREEN_WIDTH;
    static readonly BALL_SPEED_AT_LIMIT = GSettings.SCREEN_WIDTH / 20;
    static readonly BALL_CLIENT_SERVER_LERP_DIST = .05;
    static readonly BALL_CLIENT_SERVER_LERP_FACTOR = .05;
    static readonly BALL_COLOR = 'rgb(255, 255, 255)';
    static readonly BALL_POS_ERROR_MAX = .05 * GSettings.SCREEN_WIDTH;
    static readonly BALL_SPEED_ERROR_MAX = .05 * GSettings.SCREEN_WIDTH;

    // GRAVITON ->
    static readonly GRAVITON_LIFESPAN = 500;
    static readonly GRAVITON_SIZE = GSettings.SCREEN_WIDTH / 10;
    static readonly GRAVITON_FORCE_WIDTH_HALF = GSettings.SCREEN_WIDTH / 10;
    static readonly GRAVITON_FORCE_HEIGHT_HALF = GSettings.GRAVITON_SIZE / 4;
    static readonly GRAVITON_MAX_FORCE = 10;

    // ANIMATION
    static readonly VICTORY_ANIMATION_DURATION_MS = 1500
    static readonly VICTORY_ANIMATION_SPEED = GSettings.BALL_SPEEDY_MAX;
    static readonly VICTORY_ANIMATION_COLOR = 'rgb(255, 0, 0)'
}

export enum PlayerID {
    PLAYER1 = 0,
    PLAYER2 = 1,
}
export const PLAYER1 = PlayerID.PLAYER1;
export const PLAYER2 = PlayerID.PLAYER2;

export enum Direction {
    LEFT = -1,
    RIGHT = 1,
}
export const LEFT = Direction.LEFT;
export const RIGHT = Direction.RIGHT;


export class GameEvent {

    // enum Send {
    //     ....
    // }
    // enum Receive {
    //     ....
    // }
    // enum FromServer {
    //     ....
    // }
    // key: string, time: number
    static readonly SEND_BAR_KEYDOWN = "sendBarKeydown";
    // key: string, y: number
    static readonly SEND_BAR_KEYUP = "sendBarKeyup";
    // y: number, time: number
    static readonly SEND_BAR_POSITION = "sendBarPosition";
    // key: string, time: number
    static readonly RECEIVE_BAR_KEYDOWN = "receiveBarKeydown";
    // key: string, y: number
    static readonly RECEIVE_BAR_KEYUP = "receiveBarKeyup";
    // playerId: PlayerID, key: string, y: number
    static readonly RECEIVE_BAR_KEYDOWN_SERVER = "receiveBarKeydownServer";
    // playerId: PlayerID, key: string, y: number
    static readonly RECEIVE_BAR_KEYUP_SERVER = "receiveBarKeyupServer";
    // y: number, time: number
    static readonly RECEIVE_BAR_POSITION = "receiveBarPosition";
    // startTime: number
    static readonly START = "start";
    // pauseTime: number
    static readonly PAUSE = "pause";
    // unpauseTime: number
    static readonly UNPAUSE = "unpause";
    // x: number, y: number, speedX: number, speedY: number, time: number
    static readonly RECEIVE_SET_BALL  = "receiveSetBall";
    // x: number, y: number, speedX: number, speedY: number, time: number
    static readonly SEND_SET_BALL  = "sendSetBall";
    // playerId: PlayerID
    static readonly GOAL = "goal";
    // ballSpeedX: number, ballSpeedY: number
    static readonly RESET = "reset";
}

export type BarKeyDownEvent = [KeyValue, number];                     // keyvalue, time
export type BarKeyUpEvent = [KeyValue, number];                     // keyvalue, y
// export type BarPositionEvent = [number, number];                  // y, time
// export type BallEvent = [number, number, number, number, number]; // x, y, speedX, speedY, time
// export type ResetEvent = [number, number, number, number];        // ballX, ballY, ballSX, ballSY
// export type GoalEvent = [PlayerID];                               // player

export enum KeyValue {
    UP,
    DOWN,
}
export const UP = KeyValue.UP;
export const DOWN = KeyValue.DOWN;
