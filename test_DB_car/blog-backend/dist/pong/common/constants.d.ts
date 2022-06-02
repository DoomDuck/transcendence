export declare class GSettings {
    static readonly SCREEN_RATIO = 2;
    static readonly SCREEN_WIDTH = 4;
    static readonly SCREEN_HEIGHT: number;
    static readonly SCREEN_TOP: number;
    static readonly SCREEN_BOTTOM: number;
    static readonly SCREEN_LEFT: number;
    static readonly SCREEN_RIGHT: number;
    static readonly GAME_WIDTH = 4;
    static readonly GAME_HEIGHT: number;
    static readonly GAME_TOP: number;
    static readonly GAME_BOTTOM: number;
    static readonly GAME_LEFT: number;
    static readonly GAME_RIGHT: number;
    static readonly SCORE_X: number;
    static readonly SCORE_Y: number;
    static readonly GAME_STEP: number;
    static readonly SERVER_EMIT_INTERVAL = 2;
    static readonly BAR_WIDTH: number;
    static readonly BAR_HEIGHT: number;
    static readonly BAR_INITIALX: number;
    static readonly BAR_INITIALY = 0;
    static readonly BAR_SENSITIVITY: number;
    static readonly BALL_RADIUS: number;
    static readonly BALL_INITIAL_SPEEDX: number;
    static readonly BALL_RADIAL_SEGMENTS = 100;
    static readonly BALL_SPEEDX_INCREASE: number;
    static readonly BALL_SPEEDX_CORNER_BOOST: number;
    static readonly BALL_SPEEDX_MAX: number;
    static readonly BALL_SPEEDY_MAX: number;
    static readonly BALL_CONTROL_FRONTIER_X_CLIENT: number;
    static readonly BALL_CONTROL_FRONTIER_X_SERVER: number;
    static readonly BALL_SPEED_AT_LIMIT: number;
}
export declare enum PlayerID {
    PLAYER1 = 0,
    PLAYER2 = 1
}
export declare const PLAYER1 = PlayerID.PLAYER1;
export declare const PLAYER2 = PlayerID.PLAYER2;
export declare enum Direction {
    LEFT = -1,
    RIGHT = 1
}
export declare const LEFT = Direction.LEFT;
export declare const RIGHT = Direction.RIGHT;
export declare class GameEvent {
    static readonly SEND_BAR_KEYDOWN = "sendBarKeydown";
    static readonly SEND_BAR_KEYUP = "sendBarKeyup";
    static readonly SEND_BAR_POSITION = "sendBarPosition";
    static readonly RECEIVE_BAR_KEYDOWN = "receiveBarKeydown";
    static readonly RECEIVE_BAR_KEYUP = "receiveBarKeyup";
    static readonly RECEIVE_BAR_POSITION = "receiveBarPosition";
    static readonly START = "start";
    static readonly PAUSE = "pause";
    static readonly UNPAUSE = "unpause";
    static readonly RECEIVE_SET_BALL = "receiveSetBall";
    static readonly SEND_SET_BALL = "sendSetBall";
    static readonly SEND_GOAL = "sendGoal";
    static readonly RECEIVE_GOAL = "receiveGoal";
    static readonly RESET = "reset";
}
export declare enum KeyValue {
    UP = 0,
    DOWN = 1
}
export declare const UP = KeyValue.UP;
export declare const DOWN = KeyValue.DOWN;
