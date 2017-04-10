/**
 * app.js
 * webpack entry file
 */

import React           from "react";
import { render }      from "react-dom";
import { createStore } from "redux";
import { Provider }    from "react-redux";

import reducers from "./reducers";
import Game     from "./components/game";

require("./css/sass/bootstrap.scss");

const store = createStore( reducers );

const App = () => { return (
  <div id="wrapper"><Game /></div>
)};

render(
  <Provider store={store}><App /></Provider>,
  document.getElementById("app")
);