define(function(){

  // @var obj - array of values to exclude during the creation
  //            of the range array
  var _exclude = [];

  /**
   * exclude()
   *
   * @param   mixed  items  str/int/object
   *
   * @return  this  [description]
   */
  function exclude( items ) {
    // add the items, not the array of items
    if( typeof items === "object" ) {
      this._exclude.concat( items );
    }
    else {
      this._exclude.push( items );

    }

    // chain it..
    return this;
  }

  function num( start, end ) {
    return Array
            .apply( null, Array( end ) )
            .map( function( _, i ){
              // remove excluded
              if( i in this._exclude ) { continue; }

              return ( i + start );
            });
  }

});