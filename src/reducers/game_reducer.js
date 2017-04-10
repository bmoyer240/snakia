/**
 * reducers/game_reducer.js
 *
 * @see http://redux.js.org/docs/basics/Reducers.html
 */

/**
 * default values for the dynamic states
 * within the game
 */
const INIT_STATE = {
  end_game   : false,
  high_score : 0,
  score      : 0
}

/**
 * set_high_score()
 * simple compares the highest score to the
 * score of the last game
 *
 * @param  int  options.score
 * @param  int  options.high_score
 *
 * @return int
 */
function set_high_score( { score, high_score } ) {
  return high_score > score ? high_score : score;
}

export default function( state = INIT_STATE, action ) {
  switch( action.type ) {

    // called when a new game is requested
    case "NEW_GAME":
      return {
        ...state,
        end_game : false,
        score    : 0
      }
    break;

    // allows the user to pause the game
    case "PAUSE_GAME":
      return {
        ...state,
        end_game: false,
      }
    break;

    // called when the game has ended
    case "END_GAME":
      return {
        ...state,
        end_game   : true,
        high_score : set_high_score( state )
      }
    break;

    // increase score
    // @TODO: move logic to game so the multipliers
    // are used.
    case "INCREASE_SCORE":
      return {
        ...state,
        score: state.score + 10
      }
    break;
  }

  return state;
}