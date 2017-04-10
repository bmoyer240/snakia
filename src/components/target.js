/**
 * target.js
 * ./src/components/target.js
 *
 * target is used to draw a specific target:
 * e.g. food, bonus, obstacle
 */
import React from "react";
import { BOARD_CELL_SIZE } from "../config/config";

export default function( props ) {
  let args = props.args;
  let style = {
    // position
    left: ( args.x * BOARD_CELL_SIZE ) + "px",
    top : ( args.y * BOARD_CELL_SIZE ) + "px"
  }

  /**
   * return
   * DOM element for the specific target
   */
  return (
    <div className="target" style={style}></div>
  )
}