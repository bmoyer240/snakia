/**
 * components/board.jsx
 */

import React from "react";
import { BOARD_CELL_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from "../config/config";

export default function Board() {
  // board container
  let board = [];

  // construct the board
  for( let x = 0; x < BOARD_WIDTH; x++ ) {
    board[ x ] = [];
    for( let y = 0; y < BOARD_HEIGHT; y++ ) {
      board[ x ][ y ] = ""
    }
  }

  return (
    <div id="board">
      {
        board.map( ( row, r_index ) => {
          return (
            <div className="board-row" key={r_index}>
              { row.map( ( cell, cell_index ) => <div className="cell" key={cell_index} /> ) }
            </div>
          )
        })
      }
    </div>
  )
}