/**
 * main.js
 *
 */

requirejs.config({
  baseUrl : "src/js",
  paths   : {
    // application logic --------------/
      "app": "../js",

    // testing ------------------------/
      "chai"    : "chai/chai",
      "chai-jq" : "chai-jq/chai-jq",
      "moacha"  : "mocha/mocha",
      "jquery"  : "jquery/dist/jquery.min",

    // helper modules -----------------/
      "range": "../js/modules/range",

    // classes ------------------------/
      "board"  : "../js/board",
      "canvas" : "../js/canvas",
      "snake"  : "../js/snake"
  }
});

requirejs(["app/app"]);