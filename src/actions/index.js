/**
 * index.js
 * ./src/actions/index.js
 *
 * actions used to pass into the 'props'
 * compoenent of react, otherwise, props
 * is read-only.
 */

//-[GAME-REDUCER]--------------------------------

  export function pause_game() {
    return { type: "PAUSE_GAME" }
  }

  export function end_game() {
    return { type: "END_GAME" }
  }

  export function new_game() {
    return { type: "NEW_GAME" }
  }

  export function increase_score() {
    return { type: "INCREASE_SCORE" }
  }

//-[SNAKE-REDUCER]-------------------------------

  export function move_snake( snake ) {
    let dir  = snake.direction;
    let pos  = snake.pos;
    let head = pos[ pos.length - 1 ];

    let map_head = {
      LEFT  : [ head[0] - 1, head[1]     ],
      UP    : [ head[0],     head[1] - 1 ],
      RIGHT : [ head[0] + 1, head[1]     ],
      DOWN  : [ head[0],     head[1] + 1 ]
    }

    // push the new pos to the snake
    pos.push( map_head[ dir ] );
    // and remove..
    pos.shift();

    return {
      type : "MOVE_SNAKE",
      pos  : pos
    }
  }

  export function prepend_snake( pos ) {
    return {
      type : "PREPEND_SNAKE",
      pos  : pos
    }
  }

  export function set_direction( dir ) {
    return {
      type: "SET_DIRECTION",
      direction: dir
    }
  }

//-[TARGET-REDUCER]------------------------------

  export function set_target( pos ) {
    return {
      type   : "PLACE_TARGET",
      target: pos
    }
  }