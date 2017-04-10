/**
 * reducers/target_reducer.js
 *
 * @see http://redux.js.org/docs/basics/Reducers.html
 */

const INIT_STATE = [];

 export default function( state = INIT_STATE, action ) {
  switch( action.type ) {

    // when a new target is placed within the grid
    case "PLACE_TARGET":
      return action.target;
    break;

    // cleares the target
    case "RESTART":
      return INIT_STATE;
    break;
  }

  return state;
 }