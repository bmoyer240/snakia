define(function(){

  // @var obj - array of values to exclude during the creation
  //            of the range array
  var _exclude = [];

  /**
   * exclude()
   *
   * @param   mixed  items  str/int/object
   *
   * @return  this
   */
  function exclude( items ) {
    // add the items, not the array of items
    if( typeof items === "object" ) {
      _exclude.concat( items );
    }
    else {
      _exclude.push( items );
    }

    // chain it..
    return this;
  }

  /**
   * num()
   * Creates an array of numbers from start
   * to end, skipping over any excluded numbers.
   *
   * @param   int  start
   * @param   int  end
   *
   * @return  array
   */
  function num( start, end ) {
    return Array
            .apply( null, Array( end ) )
            .map( function( _, i ){
              // remove excluded
              if( !(i in _exclude) ) {
                return ( i + start );
              }
            });
  }

  return {
    exclude : exclude,
    num     : num
  }

});