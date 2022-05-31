
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

    // PHYSIC -->
    // static readonly DELTA_T = 1000 / 60;
    static readonly GAME_STEP = 1000 / 60;
    static readonly SERVER_EMIT_INTERVAL = 2;

    // Initial values
    // BAR ----->
    static readonly BAR_WIDTH = GSettings.SCREEN_WIDTH / 40;
    static readonly BAR_HEIGHT = GSettings.SCREEN_WIDTH / 10;
    static readonly BAR_INITIALX = 17/40 * GSettings.SCREEN_WIDTH;
    static readonly BAR_INITIALY = 0;
    static readonly BAR_SENSITIVITY = GSettings.SCREEN_WIDTH * 2 / 4;

    // BALL ---->
    static readonly BALL_RADIUS = GSettings.SCREEN_WIDTH / 80;
    static readonly BALL_INITIAL_SPEEDX = GSettings.SCREEN_WIDTH / 4;
    // static readonly BALL_INITIAL_SPEEDX = GSettings.SCREEN_WIDTH / 20;
    static readonly BALL_RADIAL_SEGMENTS = 100;
    static readonly BALL_SPEEDX_INCREASE = GSettings.SCREEN_WIDTH / 40;
    static readonly BALL_SPEEDX_CORNER_BOOST = GSettings.BALL_SPEEDX_INCREASE * 2;
    static readonly BALL_SPEEDX_MAX = GSettings.SCREEN_WIDTH * 2;
    static readonly BALL_SPEEDY_MAX = GSettings.SCREEN_WIDTH / 2;
    static readonly BALL_COLLISION_VERTICAL_SPEEDY_BOOST = GSettings.SCREEN_WIDTH;
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
    // y: number, time: number
    static readonly RECEIVE_BAR_POSITION = "receiveBarPosition";
    // startTime: number
    static readonly START = "start";
    // pauseTime: number
    static readonly PAUSE = "pause";
    // unpauseTime: number
    static readonly UNPAUSE = "unpause";
    // x: number, y: number, speedX: number, speedY: number, time: number
    static readonly SET_BALL  = "setBall";
    // playerId: PlayerID
    static readonly GOAL = "goal";
    // ballSpeedX: number, ballSpeedY: number
    static readonly RESET = "reset";
}

export enum KeyValue {
    UP,
    DOWN,
}
export const UP = KeyValue.UP;
export const DOWN = KeyValue.DOWN;
