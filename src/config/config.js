/**
 * config/config.jsx
 *
 * default game values
 */

//-[GAME-BOARD]----------------------------------
  // size in pixels
  export const BOARD_CELL_SIZE = 20;
  // used as a multiplier of the cell size
  export const BOARD_HEIGHT    = 20;
  export const BOARD_WIDTH     = 20;

//-[DIFFICULTIES]--------------------------------
  export const DIFFICULTY_EASY = 0;
  export const DIFFICULTY_MED  = 1;
  export const DIFFICULTY_HARD = 2;

//-[DIRECTIONS]----------------------------------
  export const DIRECTION_DOWN  = "DOWN";
  export const DIRECTION_LEFT  = "LEFT";
  export const DIRECTION_RIGHT = "RIGHT";
  export const DIRECTION_UP    = "UP";

//-[PROCESS-STATES]------------------------------
  export const STATE_INACTIVE = 0;
  export const STATE_ACTIVE   = 1;
  export const STATE_PAUSED   = 2;
  export const STATE_END      = 3;

//-[COLLISION-TYPES]-----------------------------
  export const HIT_BODY  = "body";
  export const HIT_BONUS = "bonus";
  export const HIT_FOOD  = "food";
  export const HIT_WALL  = "wall";

//-[TARGET-TYPES]--------------------------------
  export const TARGET_FOOD = "food";

//-[SETTINGS]------------------------------------
  export const GAME_SPEED      = 100;
  export const START_DIRECTION = DIRECTION_RIGHT;