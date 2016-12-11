define(function(){

  var Snake = function( config ) {
    this.config = config || {};

    // the starting length of the snake
    this._start_len = 5;

    // container for the pieces of the snake
    this._body   = [];

    // build the snake
    this.construct();
  }

  Snake.prototype = {
    constructor: Snake,

    /**
     * construct()
     *
     */
    construct: function() {
      var len = this._start_len - 1;

      for( var i = len; i >= 0; i-- ) {
        this.add( i, 0 );
      }
    },

    /**
     * reset()
     * resets the dynamic variables back to the
     * original state/value.
     *
     * @return  this
     */
    reset: function() {
      this._body = [];
      this.construct();

      // chainit
      return this;
    },

    //---------------------------------

    /**
     * add()
     * adds the set of numbers to the end if
     * the body array.
     *
     * @see grow() to add to beginning of array
     *
     * @param  int  x
     * @param  int  y
     *
     * @return this
     */
    add: function( x, y ) {
      // set defaults
      var x = x || 0,
          y = y || 0;

      // push it, push it real good...
      this._body.push({ "x": x, "y": y });

      return this;
    },

    /**
     * body()
     * return the arr of points which makes
     * up the body of the snake.
     *
     * @return  arr
     */
    body: function() {
      return this._body;
    },

    /**
     * grow()
     * unlike add(), grow adds the new set to
     * the beginning of the array.
     *
     * @param  obj  point  {x.y}
     *
     * @return this
     */
    grow: function( point ) {
      this._body.unshift( point );
      return this;
    },

    /**
     * head()
     * returns the first point in the body obj.
     *
     * @return  obj  {x,y}
     */
    head: function() {
      var b = this.body();
      return b[ 0 ];
    },

    /**
     * len()
     * gets the length of the body array
     *
     * @return  int
     */
    len: function() {
      var b = this.body();
      return b.length;
    },

    /**
     * tail()
     * returns the last point in the body obj.
     *
     * @return  obj  {x,y}
     */
    tail: function() {
      var b   = this.body();
      var len = this.len();

      return b[ len-1 ];
    }

  }

  return Snake;
});