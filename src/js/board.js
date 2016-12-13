define(function(){
  "use strict";

  var Board = function() {
    // "Constants" (a form of... for backwards compatibility w/o additional modules)
    var STATE_INACTIVE = 0,
        STATE_ACTIVE   = 1,
        STATE_PAUSED   = 2,
        STATE_END      = 3,

        // difficulty
        DIF_EASY   = 0,
        DIF_MEDIUM = 1,
        DIF_HARD   = 2,

        // direction
        DIR_LEFT  = "LEFT",
        DIR_UP    = "UP",
        DIR_RIGHT = "RIGHT",
        DIR_DOWN  = "DOWN",

        // hit (collision) types
        HIT_WALL   = "wall",
        HIT_BODY   = "body",
        HIT_TARGET = "target";

    // @var private - obj - container for the game elements
    this._dom = {
      canvas        : $("#game-board"),
      leaderlist    : $("#leaderlist"),
      score         : $("[data-score='score']"),
      skill_ball    : $("#skill-ball"),
      skill_bar     : $("#skill-bar"),
      skill_options : $("ul#skill-options"),
      start_game    : $("#start-game"),
      game_menu     : $("#game-menu"),
      username      : $("input#username")
    };

    // @var private - obj - container for board (canvas) attributes
    this._canvas = {
      // @todo - convert to constants
      // difficulty determines which boundry is set allowing a
      // single to all or a mix of boundries. the snake will always
      // wrap to the parallel boundry; however, will only be allowed
      // to wrap (exit) on a boundry that does not exist.
      // -1: OFF | 0: ON (x4) | 1: LEFT | 2: UP | 3: RIGHT | 4: DOWN
      boundry   : [ 0 ],

      // canvas element
      canvas    : this.dom.canvas[0],

      // size of each cell grid
      cell_size : 10,

      // drawing context of the canvas
      ctx       : this.dom.canvas[0].getContext("2d"),

      // arrays containing numerical values for each point
      // within each axis
      grid      : { x: [], y: [] },

      // size - default height of canvas
      height    : 400,

      // size - default width of canvas
      width     : 400
    }

    this.game = {
      difficulty : DIF_EASY,
      hit_type   : "",
      process    : undefined,
      round      : 0,
      score      : 0,
      speed      : 60,
      status     : STATE_INACTIVE
    }

    // @var obj - position cordinates {x, y}
    this.food  = {};

    // @var obj - Snake object
    this.snake = {};

    // @var str - direction of the character
    this.direction = DIR_RIGHT;

  }

  Board.prototype = {
    constructor: Board,

    /**
     * load()
     */
    load: function( snake ) {
      // set the snake
      this.snake = snake;

      // show the menu
      this.show_game_menu();
    },

    /**
     * setup_canvas()
     *
     * @return  {[type]}  [description]
     */
    setup_canvas: function() {
      var c  = this._canvas;
      var h  = c.height,
          w  = c.width,
          cs = c.cell_size;

      // update the size of the canvas
      c.canvas.height = h;
      c.canvas.width  = w;

      // calculate the number of cells within the grid
      this.calc_grid( h, w, cs );

      return this;
    },


    /**
     * calc_grid()
     * creates an array for both axis containing
     * the number of blocks available.
     *
     * @param  int  height
     * @param  int  width
     * @param  int  cell_size
     *
     * @return  this
     */
    calc_grid: function( height, width, cell_size ) {
      this._canvas.grid = {
        x: this.range( 1, ( width / cell_size ) ),
        y: this.range( 1, ( height / cellsize ) )
      }
      return this;
    },

    /**
     * range()
     *
     * @todo Move to own Class/Module/Plugin
     * @return  {[type]}  [description]
     */
    range: function( start, end ) {
      return Array
              .apply( null, Array( end ) )
              .map( function( _, i ){
                return ( i+start );
              });
    },

    /**
     * reset_game()
     *
     */
    reset_game: function() {
      this.set_hit_type("");
      this.update_score( -1 );

      // properties
      this.food = {}
      this.snake.reset();
    },

    // getters -----------------------




    // Process Management ------------

      /**
       * runit()
       * starts the interval timer
       *
       * @return  this
       */
      runit: function() {
        if( this.game.status === this.STATE_ACTIVE ) {
          this.game.process = setInterval( $.proxy(function(){
            this.draw();
          }, this ), this.get_speed() );
        }
      },

      /**
       * stopit()
       * clears the interval timer
       *
       * @return  this
       */
      stopit: function() {
        // only stop if the process is running
        if( this.game_inprocess() ) {
          this.game_process = clearInterval( this.game_process );
        }
      },

      /**
       * game_inprocess()
       *
       * @return  {[type]}  [description]
       */
      game_inprocess: function() {
        return Boolean( this.game_process );
      },

    // Game State Actions ------------

      /**
       * start_game()
       */
      start_game: function() {
        // hide the start/end menu + reset properties
        this.hide_game_menu();

        this.set_canvas_size()
            .calc_grid()

        // draw the game
        this.draw();

        // register the controls?
        this.register_controls();

        // set the round
        this.increase_round();
      },

      /**
       * pause_game()
       * if the game is running, the interval will be reset
       *
       * @return void
       */
      pause_game: function() {
        // pause & stop
        this.game_paused = true;
        this.stopit();
      },

      /**
       * resume_game()
       *
       * @return  {[type]}  [description]
       */
      resume_game: function() {
        // do not overwrite the current process
        if( this.game_inprocess() ) { return true; }

        // unpause & run
        this.game_paused = false;
        this.runit();
      },

      /**
       * end_game()
       */
      end_game: function() {
        this.stopit();
        this.show_game_menu();
      },

    // DOM ---------------------------

      /**
       * show_game_menu()
       *
       * @return  void
       */
      show_game_menu: function() {
        this.dom.game_menu.fadeIn();

        // register the button to start the game
        this.dom.start_game
          .off("click.start_game")
          .on("click.start_game", $.proxy( function(){
            // save options

            // start game
            this.start_game();
          }, this ) );
      },

      /**
       * hide_game_menu()
       *
       * @return  void
       */
      hide_game_menu: function() {
        this.dom.game_menu.fadeOut();
      },

      /**
       * draw()
       */
      draw: function() {
        // simplify the variables
        h    = this.height;
        w    = this.width;
        cell = this.cell_size;
        snake = this.snake;

        // grab the point of the head
        var head = snake.head();
        var head_x = head.x,
            head_y = head.y;

        // update the pointer to reflect the change
        // in direction
        switch( this.get_dir() ) {
          case "RIGHT":
            head_x++;
          break;
          case "LEFT":
            head_x--;
          break;
          case "UP":
            head_y--;
          break;
          case "DOWN":
            head_y++;
          break;
        }

        // snake ate the previous food but is still hungry
        this.create_food();

        // does the change in direction cause a collision
        if( this.detect_collision( head_x, head_y ) ) {
          console.log("collision: " + this.get_collision_type() );
          return this.end_game();
        }

        // food detection
        if( head_x == this.food.x && head_y == this.food.y ) {
          var tail = { x: head_x, y: head_y };
          this.score++;
          this.create_food();
        }
        else {
          var tail = this.snake._body.pop();
          tail.x = head_x;
          tail.y = head_y;
        }

        // move function to snake as growing
        this.snake.grow( tail );

        for( var i = 0; i < this.snake.len(); i++ ) {
          var c = this.snake._body[ i ];
          this.draw_cell( c.x, c.y );
        }

        // update the score
      },

      /**
       * draw_cell()
       * takes care of drawing a single cell within
       * the gameboard.
       *
       * @param  int  x
       * @param  int  y
       *
       * @return void
       */
      draw_cell: function( x, y ) {
        if( typeof x === "object" ) {
          x = Number( x.x );
          y = Number( x.y );
        } else {
          // set default value for y
          y = y || 0;
        }

        size = this.cell_size;
        this.ctx.fillStyle = "#4a4c4b";
        this.ctx.fillRect( (x*size),(y*size), size, size );
      },

      /**
       * draw_cells()
       * iterates over a obj containing sets
       * of {x,y} coordinates. Each set is split
       * to its lowest level and is sent off to
       * be drawn on the canvas.
       *
       * @param  obj
       *
       * @return this
       */
      draw_cells: function( obj ) {
        var obj_len = arr.length;

        for( var i = 0; i < obj_len; i++ ) {
          var set = obj[ i ];
          this.draw_cell( set.x, set.y );
        }

        return this;
      },

    // Events ------------------------

      /**
       * detect_collision()
       * checks if the current character coordinate
       * is on a positive/negative cell block.
       *
       * @param  int  x
       * @param  int  y
       *
       * @return bool
       */
      detect_collision: function( x, y ) {
        // simplify the variables
        h    = this.height;
        w    = this.width;
        cell = this.cell_size;

        // food first

        // wall collision
        if( ( x == -1 ) || ( x == w/cell ) || ( y == -1 ) || ( y == h/cell ) ) {
          this.set_collision_type("wall");
          return true;
        }

        // body collision
        var body     = this.snake.body();
        var body_len = this.snake.len();

        for( var i = 0; i < body_len; i++ ) {
          if( body[ i ].x == x && body[ i ].y == y ) {
            this.set_collision_type("body");
            return true;
          }
        }
        return false;
      },

      /**
       * set_collision_type()
       * sets the collision type property
       *
       * @param  str
       */
      set_collision_type: function( type ) {
        this.collision_type = type;
      },

      /**
       * get_collision_type()
       *
       * @return  str
       */
      get_collision_type: function() {
        return this.collision_type;
      },

      /**
       * increase_round()
       *
       * @return  this
       */
      increase_round: function() {
        this.round++;
        console.log(this.round);
        return this;
      },

      /**
       * get_round()
       * returns the value of the round property,
       * which keeps track of the number of rounds
       * played per session.
       *
       * @return  int
       */
      get_round: function() {
        return this.round;
      },

      /**
       * update_score()
       *
       * @param  int  n  number to increase the score by
       *                 -1 resets the score to 0
       * @return  this
       */
      update_score: function( n ) {
        // -1 resets the score
        this.score = ( n === -1 ? 0 : this.score + n );
        return this;
      },

    // Movement ----------------------

      /**
       * get_dir
       * returns the value of the direction property
       * which serves as the current direction of
       * the game character.
       *
       * @return  str
       */
      get_dir: function() {
        return this.snake_dir;
      },

      /**
       * set_dir()
       * sets the direction property.
       *
       * @todo should the value be validated??
       *
       * @param  str direction  left, up, right, down
       *
       * @return str
       */
      set_dir: function( direction ) {
        this.snake_dir = direction;
      },

      /**
       * get_spedd()
       */
      get_speed: function() {
        // @todo - write logic to increase /decrease based on
        // config and process
        return this.speed;
      },

      calc_speed: function() {},

    // Food --------------------------

      /**
       * create_food()
       * creates a a random set of coordinates (x, y) -
       * the food - and assigns the new coords to
       * the food property.
       *
       * @return  void
       */
      create_food: function() {
        // make sure it does not overlap the snake
        var body     = this.snake.body();
        var body_len = this.snake.len();

        // make a copy of the grid
        var x_set = this.grid.x,
            y_set = this.grid.y;
        for( var i = 0; i < body_len; i++ ) {
          var set = body[ i ];
          x_set.splice( ( set.x-1 ), 1 );
          y_set.splice( ( set.y-1 ), 1 );
        }

        // @todo - should I draw the cell here??
        this.food = {
          x: Math.floor( Math.random() * x_set.length ),
          y: Math.floor( Math.random() * y_set.length )
        }

        console.log(this.food);
        this.draw_cell( this.food );
      },

      /**
       * get_food
       * returns obj containing coordinates
       * of the target.
       *
       * @return  obj
       */
      get_food: function() {
        return this.food;
      },

    // Controls ----------------------

      /**
       * deregister_controls()
       * removes the keybinding for the controls
       *
       * @return  void
       */
      deregister_controls: function() {
        $( document ).off("keydown.controls");
      },

      /**
       * register_controls()
       * registers the listener for all key events and
       * changes the direction based on the key pressed.
       *
       * @todo  move all key values to constants - the key
       *        number and direction string. this will also
       *        benifit the reactjs variation.
       *
       * @return  void
       */
      register_controls: function() {
        // only register once
        if( this.game_inprocess() ) { return this; }

        $( document )
          .off("keydown.controls")
          .on( "keydown.controls", $.proxy( function( e ){
            var key = e.which;

            // only react to valid keys
            if( [ 80, 37, 38, 39, 40 ].indexOf( key ) === -1 ) { return; }

            // block the controls from doing anything else
            e.preventDefault();

            // pause game
            if( key === 80 ) {
              this.pause_game();
              return;
            }

            // resume game from pause
            this.resume_game();

            // get the current direction
            var dir = this.get_dir();

            // l: 37, up: 38, r: 39, d: 40
            if( key === 37 && dir != "RIGHT" )     { dir = "LEFT";  }
            else if( key === 38 && dir != "DOWN" ) { dir = "UP";    }
            else if( key === 39 && dir != "LEFT" ) { dir = "RIGHT"; }
            else if( key === 40 && dir != "UP" )   { dir = "DOWN";  }

            // update the direction
            this.set_dir( dir );

          }, this ) );

        return this;
      }
  }

  return Board;
});