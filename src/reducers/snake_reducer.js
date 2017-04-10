/**
 * reducers/snake_reducer.js
 *
 * @see http://redux.js.org/docs/basics/Reducers.html
 */

import { START_DIRECTION } from "../config/config";


// construct the inital starting length
// and direction of the snake
// TODO: move logic so the position of the
// snake can be dynamic based on the user
// difficulty
const INIT_STATE = {
  direction : START_DIRECTION,
  pos       : [
    [ 2, 2 ],
    [ 3, 2 ],
    [ 4, 2 ],
  ]
}

export default function( state = INIT_STATE, action ) {
  switch( action.type ) {
    // resets to the default state
    case "NEW_GAME":
      return {
        ...state,
        pos: [
          [ 2, 2 ],
          [ 3, 2 ],
          [ 4, 2 ],
        ]
      }
    break;

    /**
     * updates the direction of the snake
     * based on the user input
     */
    case "SET_DIRECTION":
      return {
        ...state,
        direction: action.direction
      }
    break;

    /**
     * updates the snake to mimic movement
     */
    case "MOVE_SNAKE":
      return {
        ...state,
        pos: action.pos
      }
    break;

    /**
     * adds an addition set of coordinates
     * to the beginning of the snake which increases
     * the size.
     */
    case "PREPEND_SNAKE":
      return {
        ...state,
        pos: [ [action.pos], ...state.pos ]
      }
    break;
  }

  return state;
}