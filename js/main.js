/**
 * main.js
 *
 */

requirejs.config({
  baseUrl : "js",
  paths   : {
    // application logic --------------/
      app: "app/app",

    // helper modules -----------------/
      rangeJs: "app/modules/range",

    // classes ------------------------/
      board  : "app/board",
      canvas : "app/canvas",
      snake  : "app/snake",

    // vendor -------------------------/
      jquery: "lib/jquery-3.1.1.min"
  }
});

requirejs(["app"]);