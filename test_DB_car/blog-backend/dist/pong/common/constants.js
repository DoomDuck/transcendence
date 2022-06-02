"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOWN = exports.UP = exports.KeyValue = exports.GameEvent = exports.RIGHT = exports.LEFT = exports.Direction = exports.PLAYER2 = exports.PLAYER1 = exports.PlayerID = exports.GSettings = void 0;
class GSettings {
}
exports.GSettings = GSettings;
GSettings.SCREEN_RATIO = 2;
GSettings.SCREEN_WIDTH = 4;
GSettings.SCREEN_HEIGHT = GSettings.SCREEN_WIDTH / GSettings.SCREEN_RATIO;
GSettings.SCREEN_TOP = -GSettings.SCREEN_HEIGHT / 2;
GSettings.SCREEN_BOTTOM = GSettings.SCREEN_HEIGHT / 2;
GSettings.SCREEN_LEFT = -GSettings.SCREEN_WIDTH / 2;
GSettings.SCREEN_RIGHT = GSettings.SCREEN_WIDTH / 2;
GSettings.GAME_WIDTH = 4;
GSettings.GAME_HEIGHT = GSettings.SCREEN_HEIGHT * 23 / 25;
GSettings.GAME_TOP = -GSettings.GAME_HEIGHT / 2;
GSettings.GAME_BOTTOM = GSettings.GAME_HEIGHT / 2;
GSettings.GAME_LEFT = -GSettings.GAME_WIDTH / 2;
GSettings.GAME_RIGHT = GSettings.GAME_WIDTH / 2;
GSettings.SCORE_X = GSettings.SCREEN_WIDTH / 10;
GSettings.SCORE_Y = -GSettings.GAME_HEIGHT * (1 / 2 - 1 / 10);
GSettings.GAME_STEP = 1000 / 60;
GSettings.SERVER_EMIT_INTERVAL = 2;
GSettings.BAR_WIDTH = GSettings.SCREEN_WIDTH / 40;
GSettings.BAR_HEIGHT = GSettings.SCREEN_WIDTH / 10;
GSettings.BAR_INITIALX = 17 / 40 * GSettings.SCREEN_WIDTH;
GSettings.BAR_INITIALY = 0;
GSettings.BAR_SENSITIVITY = GSettings.SCREEN_WIDTH * 2 / 4;
GSettings.BALL_RADIUS = GSettings.SCREEN_WIDTH / 80;
GSettings.BALL_INITIAL_SPEEDX = GSettings.SCREEN_WIDTH / 4;
GSettings.BALL_RADIAL_SEGMENTS = 100;
GSettings.BALL_SPEEDX_INCREASE = GSettings.SCREEN_WIDTH / 40;
GSettings.BALL_SPEEDX_CORNER_BOOST = GSettings.BALL_SPEEDX_INCREASE * 2;
GSettings.BALL_SPEEDX_MAX = GSettings.SCREEN_WIDTH * 2;
GSettings.BALL_SPEEDY_MAX = GSettings.SCREEN_WIDTH / 2;
GSettings.BALL_CONTROL_FRONTIER_X_CLIENT = GSettings.BAR_INITIALX - 1 / 10 * GSettings.SCREEN_WIDTH;
GSettings.BALL_CONTROL_FRONTIER_X_SERVER = GSettings.BAR_INITIALX - 2 / 10 * GSettings.SCREEN_WIDTH;
GSettings.BALL_SPEED_AT_LIMIT = GSettings.SCREEN_WIDTH / 20;
var PlayerID;
(function (PlayerID) {
    PlayerID[PlayerID["PLAYER1"] = 0] = "PLAYER1";
    PlayerID[PlayerID["PLAYER2"] = 1] = "PLAYER2";
})(PlayerID = exports.PlayerID || (exports.PlayerID = {}));
exports.PLAYER1 = PlayerID.PLAYER1;
exports.PLAYER2 = PlayerID.PLAYER2;
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = -1] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
})(Direction = exports.Direction || (exports.Direction = {}));
exports.LEFT = Direction.LEFT;
exports.RIGHT = Direction.RIGHT;
class GameEvent {
}
exports.GameEvent = GameEvent;
GameEvent.SEND_BAR_KEYDOWN = "sendBarKeydown";
GameEvent.SEND_BAR_KEYUP = "sendBarKeyup";
GameEvent.SEND_BAR_POSITION = "sendBarPosition";
GameEvent.RECEIVE_BAR_KEYDOWN = "receiveBarKeydown";
GameEvent.RECEIVE_BAR_KEYUP = "receiveBarKeyup";
GameEvent.RECEIVE_BAR_POSITION = "receiveBarPosition";
GameEvent.START = "start";
GameEvent.PAUSE = "pause";
GameEvent.UNPAUSE = "unpause";
GameEvent.RECEIVE_SET_BALL = "receiveSetBall";
GameEvent.SEND_SET_BALL = "sendSetBall";
GameEvent.SEND_GOAL = "sendGoal";
GameEvent.RECEIVE_GOAL = "receiveGoal";
GameEvent.RESET = "reset";
var KeyValue;
(function (KeyValue) {
    KeyValue[KeyValue["UP"] = 0] = "UP";
    KeyValue[KeyValue["DOWN"] = 1] = "DOWN";
})(KeyValue = exports.KeyValue || (exports.KeyValue = {}));
exports.UP = KeyValue.UP;
exports.DOWN = KeyValue.DOWN;
//# sourceMappingURL=constants.js.map