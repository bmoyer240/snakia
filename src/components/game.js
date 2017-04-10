import React, { Component }   from "react";
import { bindActionCreators } from "redux";
import { connect }            from "react-redux";

import * as _  from "../config/config";
import { pause_game, end_game, new_game, increase_score, move_snake, prepend_snake, set_direction, set_target } from "../actions";

import Board  from "./board";
import Snake  from "./snake";
import Target from "./target";


class Game extends Component  {

  /**
   * properties:
   *
   * @str _collision - false/str - name of the collision type
   *
   * @str _direction - direction of the snake
   *
   * @str _state - state of the process e.g. running, paused, etc...
   */

  constructor() {
    super();

    // @var str - current state of the game
    this._state     = _.STATE_INACTIVE;

    // @var str - type of collision, which determines if
    //            the state of the game
    this._collision = false;

    // restart game, show menu
    this.restart     = this.restart.bind( this );

    // set default direction
    this.set_starting_direction()
  }

  //-[REACT-STATES]------------------------------

    /**
     * componentWillMount
     * invoked before render()
     *
     * @return  void
     */
    componentWillMount() {
      // register game controls
      this.register_controls();

      // create the first food object
      this.generate_target( "food" );

      // this.start();
    }

    /**
     * componentDidMount
     * fired before the parent has been mounted
     *
     * @return  void
     */
    componentDidMount() {}

    /**
     * componentDidUpdate
     * called when a component is being removed
     * from the DOM.
     *
     * @return  void
     */
    componentDidUpdate() {
      if( this.is_active() ) {
        // look for a collision
        this.detect_collision();

        // check for any state changes
        this.check_process();
      }
    }


  //-[GAME-ACTIONS]------------------------------

    /**
     * get_starting_direction()
     * @todo: add randomizer for increased difficulty
     *
     * @return  self
     */
    set_starting_direction() {
      // the difficulty will determine the starting
      // direction: default-constant, random
      this.set_direction( _.START_DIRECTION );

      return self;
    }

    /**
     * register_controls
     *
     * keys:
     *  p:80
     *  left:73, up:38, right:39, down:40
     *
     * @return  void
     */
    register_controls() {

      document.addEventListener( "keydown", e => {
        e.preventDefault();
        let key = e.keyCode;

        // only react to valid keys
        if( [ 32, 80, 37, 38, 39, 40 ].indexOf( key ) === -1 ) { return; }

        // start game
        if( this.is_active() ) {
          // get the current direction
          var dir = this.get_direction();

          // adjust the direction based on the user input
          if( key === 37 && dir != "RIGHT" )     { dir = _.DIRECTION_LEFT;  }
          else if( key === 38 && dir != "DOWN" ) { dir = _.DIRECTION_UP;    }
          else if( key === 39 && dir != "LEFT" ) { dir = _.DIRECTION_RIGHT; }
          else if( key === 40 && dir != "UP" )   { dir = _.DIRECTION_DOWN;  }

          // update the direction
          this.set_direction( dir );
        }

        // start/pause game
        else {
          switch( key ) {
            // space-bar
            case 32:
              this.start();
            break;

            // p
            case 80:
              this.pause();
            break;
          }
        }
      });

      return self;
    }

    /**
     * unregister_controls()
     *
     * @deprecated - only used with jquery
     */
    unregister_controls() {}

    /**
     * end()
     *
     * @return  self
     */
    end() {
      this.stop_process();

      // change the state
      this.set_state( _.STATE_END );

      // update props obj
      this.props.end_game();

      return self;
    }

    /**
     * pause()
     *
     * @return  self
     */
    pause() {
      this.stop_process();

      // update the state
      this.set_state( _.STATE_PAUSED );

      return self;
    }

    /**
     * restart()
     *
     * @return  self
     */
    restart() {
      // call for a new game
      this.props.new_game();

      // create a new target
      this.generate_target("food");

      // restart the direction
      this.set_starting_direction();

      // set to idle
      this.set_state( _.STATE_INACTIVE );

      // start again
      this.start();

      return self;
    }

    /**
     * resume()
     * resumes the interval without overwriting
     * the states.
     *
     * @return  self
     */
    resume() {
      if( this.is_paused() ) {
        this.start();
      }

      return self;
    }

    /**
     * start()
     *
     * @return  {[type]}  [description]
     */
    start() {
      if( this.is_active() ) {
        return self;
      } else if( this.is_over() ) {
        this.restart();
        return self;
      }

      // set the state to ACTIVE
      this.set_state( _.STATE_ACTIVE );

      // clear the colision type
      this.set_collision( false );

      this._process = setInterval( () => {
        // set the direction of the snake
        this.props.set_direction( this.get_direction() );

        // get the snake into gear
        this.props.move_snake( this.props.snake );
      }, this.get_speed() );


      return self;
    }

    /**
     * set_state()
     * sets the current state of the process.
     *
     * @param  str  state
     */
    set_state( state ) {
      this._state = state;
      return self;
    }

    /**
     * get_state()
     * retusn the state of the process.
     *
     * @return  str
     */
    get_state() {
      return this._state;
    }

    /**
     * is_active()
     *
     * @return  {Boolean}  [description]
     */
    is_active() {
      return ( this.get_state() === _.STATE_ACTIVE );
    }

    /**
     * is_inactive()
     *
     * @return  {Boolean}  [description]
     */
    is_inactive() {
      return ( this.get_state() === _.STATE_INACTIVE );
    }

    /**
     * is_paused()
     *
     * @return  {Boolean}  [description]
     */
    is_paused() {
      return ( this.get_state() === _.STATE_PAUSED );
    }

    /**
     * is_over()
     *
     * @return  {Boolean}  [description]
     */
    is_over() {
      return ( this.get_state() === _.STATE_END );
    }

    /**
     * clear_process()
     *
     * @return  {[type]}  [description]
     */
    stop_process() {
      clearInterval( this._process );
      return self;
    }

    /**
     * check_process()
     *
     * @return  {[type]}  [description]
     */
    check_process() {
      let c = this.get_collision();

      if( c === false ) { return; }

      // end game
      let triggers = [ _.HIT_WALL, _.HIT_BODY ];

      if( triggers.indexOf( c ) !== -1 ) {
        this.end();
      }
    }

    /**
     * update_score()
     *
     * @param  {[type]}  target  [description]
     *
     * @return  {[type]}  [description]
     */
    update_score( target ) {
      let m = 10;
      this.props.increase_score( m );
    }

  //-[EVENTS]------------------------------------

    /**
     * get_random_pos()
     * generates a random set of coordinates
     *
     * @return  dict
     */
    get_random_pos() {
      return {
        x: Math.floor( Math.random() * _.BOARD_WIDTH  ),
        y: Math.floor( Math.random() * _.BOARD_HEIGHT )
      }
    }

    /**
     * generate_target()
     *
     * @param  string  type
     *
     * @return
     */
    generate_target( type = _.TARGET_FOOD, multiplier = 1, end_game = false ) {
      // check if new coordinates collide with an existing element
      let c = this.get_random_pos();

      if( this.check_collision( c, this.get_snake() ) ) {
        this.generate_target( type, multiplier, end_game );
      }
      else {
        this.props.set_target( c, type, multiplier, end_game );
      }

      return self;
    }

    /**
     * check_collision()
     *
     * @param  {[type]}  set  [description]
     * @param  {[type]}  arr  [description]
     *
     * @return  {[type]}  [description]
     */
    check_collision( set, arr ) {
      return arr.some( c => c[0] === set.x && c[1] === set.y );
    }

    /**
     * detect_collision()
     *
     * @return
     */
    detect_collision() {
      // dict of [x,y] pos for each piece
      let body = this.get_snake();
      // grab the first set of coordinates, which represent the head
      let head = body[ body.length - 1 ];

      let x = head[0],
          y = head[1],
          h = _.BOARD_HEIGHT,
          w = _.BOARD_WIDTH;

      // food collision
      let target = this.props.target;
      if( ( head[0] === target.x ) && ( head[1] === target.y ) ) {
        // create a new food target
        this.generate_target("food");

        // update the score
        this.update_score( target );

        // update the snake
        this.props.prepend_snake( body[ body.length - 1 ].slice() );

        return self;
      }

      // wall collision
      if( (x == -1 ) || ( x == w ) || ( y == -1 ) || ( y == h ) ) {
        this.set_collision( _.HIT_WALL );
        return self;;
      }

      // body collision
      let body_len = body.length;

      // for( let i = 1; i < body_len; i++ ) {
      //   if( body[ i ][0] == x && body[ i ][1] == y ) {
      //     // console.log("hit: body");
      //     // this.set_collision( _.HIT_BODY );
      //     return self;
      //   }
      // }

      // clear the collision
      this.set_collision( false );

      return self;
    }

    /**
     * get_collision()
     *
     * @return  {[type]}  [description]
     */
    get_collision() {
      return this._collision;
    }

    /**
     * set_collision
     *
     * @param  {[type]}  type  [description]
     */
    set_collision( type ) {
      this._collision = type;
      return this;
    }

  //-[SNAKE-ACTIONS]-----------------------------

    /**
     * get_direction()
     * returns the value of 'direction'
     * property.
     *
     * @return  string
     */
    get_direction() {
      return this.direction;
    }

    /**
     * set_direction()
     * sets the direction of the pawn
     *
     * @param  self
     */
    set_direction( dir ) {
      this.direction = dir;
      return self;
    }

    /**
     * get_snake()
     *
     * @return  dict  o
     */
    get_snake() {
      return this.props.snake.pos;
    }

    /**
     * game_speed()
     * returns an int which dictates how
     * fast the snake should move, or should
     * the interval reload.
     *
     * @todo: adjust for difficulty
     *
     * @return  int
     */
    get_speed() {
      return _.GAME_SPEED;
    }


  //-[OUTPUT]------------------------------------

    render(){
      return (
      <div>
        <div id="board-heading">
          <div id="logo" alt="snakia">snakia.</div>
          <div id="score">{this.props.game.score}/{this.props.game.high_score}</div>
        </div>
        <div id="game-wrapper">
          <div id="board-wrap-out">
            <div id="board-wrap-in">
              <Board />
              <Snake pos={this.props.snake.pos} />
              <Target args={this.props.target} />
            </div>
          </div>
        </div>
        <div id="instructions">
          -- press the space bar to play --
        </div>
      </div>
    )}
}


// overwrite the state & dispatch properties
// within the connect module
function mapStateToProps(props) {
  return props;
}

function mapDispatchToProps( dispatch ) {
  return bindActionCreators({
    end_game,
    increase_score,
    move_snake,
    new_game,
    pause_game,
    prepend_snake,
    set_direction,
    set_target
  }, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( Game )