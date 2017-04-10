/**
 * snake.js
 * ./src/components/snake.js
 *
 */
import React from "react";
import { BOARD_CELL_SIZE } from "../config/config";

export default function( props ) {
  let cell = BOARD_CELL_SIZE;
  return(
    <div>
      {
        props.pos.map( ( pos, idx ) => {
          let style = {
            background : "",
            left       : pos[0] * cell + "px",
            top        : pos[1] * cell + "px"
          }

          return ( <div className="snake" style={style} key={idx} /> )
        })
      }
    </div>
  )
}