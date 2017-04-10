/**
 * ./src/reducers/index.js
 * entry point used to combine all reducers
 * within the directory.
 */

import { combineReducers } from "redux";

import game_reducer   from "./game_reducer";
import snake_reducer  from "./snake_reducer";
import target_reducer from "./target_reducer";

/**
 * combines all of the reducers
 * in a single proper that can be accessed
 * via the 'props' component using
 * the keys defined here.
 */
export default combineReducers({
  game   : game_reducer,
  snake  : snake_reducer,
  target : target_reducer
});