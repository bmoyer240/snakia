define(function(){
  "use strict";

  var Canvas = function( id, config ) {
    // @var str - id of the canvas element
    this._id = id || "";

    // @var obj - canvas object
    this._canvas = document.getElementById( id );

    // @var obj - context object
    this._context = this.canvas.getContext("2d");

    // @var int - height of the canvas
    this.height  = config.height || this.canvas.clientHeight;

    // @var int - width of the canvas
    this.width   = config.width || this.canvas.clientWidth;

    // @var obj - data container
    this._data = {};
  }

  Canvas.prototype = {
    constructor: Canvas,

    /**
     * draw()
     * wrapper to draw + stroke a block
     *
     * @param  int  x
     * @param  int  y       [description]
     * @param  int  width
     * @param  int  height
     * @param  obj  params  checks for the following keys:
     *                      "fill", "stroke"
     *
     * @return  this
     */
    draw: function( x, y, width, height, params ) {
      // draw rect by default
      if( "fill" in params ) {
        this._context.fillStyle = params.fill;
        this._context.fillRect( x, y, width, height );
      }

      // stroke it?
      if( "stroke" in params ) {
        this._context.strokeStyle = params.stroke;
        this._context.strokeRect( x, y, width, height );
      }

      return this;
    },

    /**
     * draw_cells()
     * iterated over an array containing sets of
     * x,y coordinates. note: if the y coord is
     * ommitted, y defaults to 0.
     *
     * @param  arr  points  [ [x,y], [x,y], [x], [0,2] ]
     * @param  int  width   width of all cells
     * @param  int  height  height of all cells
     * @param  obj  params  @see param in draw()
     *
     * @return  this
     */
    draw_cells: function( points, width, height, params ) {
      var plen = points.length;
      for( var i = 0; i < plen; i++ ) {
        var x = points[ i ][0];
        var y = points[ i ][1] || 0;
        this.draw( x, y, width, height, params );
      }
      return this;
    },

    /**
     * update_attributes()
     *
     * @return  this
     */
    update_attributes: function() {
      // @todo: anymore??
      this._canvas.height = this.get("height", false) || this._canvas.clientHeight;
      this._canvas.width  = this.get("width", false) || this._canvas.clientWidth;

      return this;
    },

    /**
     * get()
     * returns the value from the data container.
     * if the value does not exist, a default
     * value will be return if provided as the
     * second argument.
     *
     * @param   str    key
     * @param   mixed  value  default value to return
     *
     * @return  mixed
     */
    get: function( key, value ) {
      if( key in this._data ) {
        return this._data[ key ];
      }

      // return the default value
      return value || null;
    },

    /**
     * set()
     * adds the key:value pair to the data container
     *
     * @param  str/obj  key   string or an object of
     *                        pairs to set
     * @param  mixed  value
     *
     * @return this
     */
    set: function( key, value ) {
      if( typeof key === "object" ) {
        for( k in key ) {
          return this.set( k, key[ k ] );
        }
      }

      this._data[ key ] = value;
      return this;
    }
  }

  return Canvas;
});