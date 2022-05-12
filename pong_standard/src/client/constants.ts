
export class GSettings {
    // GAME ---->
    static readonly SCREEN_RATIO = 2;
    static readonly SCREEN_WIDTH = 4;
    static readonly SCREEN_HEIGHT = GSettings.SCREEN_WIDTH / GSettings.SCREEN_RATIO;
    static readonly SCREEN_TOP = -GSettings.SCREEN_HEIGHT / 2;
    static readonly SCREEN_BOTTOM = GSettings.SCREEN_HEIGHT / 2;
    static readonly GAME_WIDTH = 4;
    static readonly GAME_HEIGHT = GSettings.SCREEN_HEIGHT * 23 / 25;
    static readonly GAME_TOP = -GSettings.GAME_HEIGHT / 2;
    static readonly GAME_BOTTOM = GSettings.GAME_HEIGHT / 2;
    static readonly GAME_LEFT = -GSettings.GAME_WIDTH / 2;
    static readonly GAME_RIGHT = GSettings.GAME_WIDTH / 2;
    static readonly SCREEN_LEFT = -GSettings.SCREEN_WIDTH / 2;
    static readonly SCREEN_RIGHT = GSettings.SCREEN_WIDTH / 2;


    // PHYSIC -->
    static readonly DELTA_T = 1000 / 60;


    // Initial values
    // BAR ----->
    static readonly BAR_WIDTH = GSettings.SCREEN_WIDTH / 40;
    static readonly BAR_HEIGHT = GSettings.SCREEN_WIDTH / 10;
    static readonly BAR_INITIALX = 17/40 * GSettings.SCREEN_WIDTH;
    static readonly BAR_INITIALY = 0;
    static readonly BAR_SENSITIVITY = GSettings.SCREEN_WIDTH * 2 / 4;

    // BALL ---->
    static readonly BALL_RADIUS = GSettings.SCREEN_WIDTH / 80;
    static readonly BAll_INITIALX = 0;
    static readonly BAll_INITIALY = 0;
    static readonly BAll_INITIAL_SPEEDX = GSettings.SCREEN_WIDTH / 4;
    static readonly BAll_INITIAL_SPEEDY = 0;
    static readonly BALL_RADIAL_SEGMENTS = 100;
    static readonly BALL_SPEEDX_INCREASE = GSettings.SCREEN_WIDTH / 40;
    static readonly BALL_SPEEDX_MAX = GSettings.SCREEN_WIDTH * 2;
    static readonly BALL_SPEEDY_GAIN_MAX = GSettings.SCREEN_WIDTH / 4;
}
