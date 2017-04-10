/**
 * webpack configuration
 *\
 */

// models
// const path    = require("path");
const webpack = require("webpack");

// plugins
const p_html        = require("html-webpack-plugin");
const p_html_config = new p_html({
        filename : "index.html",
        inject   : "body",
        template : "./index.html"
      });

const p_extract_text        = require("extract-text-webpack-plugin");
const p_extract_text_config = new p_extract_text({
        disable  : process.env.NODE_ENV === "development",
        filename : "dist/css/app.css"
      });

// webpack configuration
module.exports = {
  entry  : "./src/app.js",
  output :{
    filename   : "bundle.js",
    path       : "./dist",
    publicPath : __dirname + "/dist"
  },
  module :{
    loaders: [
      {
        test    : /\.(js|jsx)$/,
        exclude : "/node_modules/",
        loader  : "babel-loader"
      },
      {
        test   : /\.scss$/,
        loader : p_extract_text_config.extract({
          fallback : "style-loader",
          use      : [ { loader: "css-loader" }, { loader: "sass-loader" } ]
        })
      },
      {
        test   : /\.(eot|svg|ttf|woff|woff2)/,
        loader : "file-loader"
      }
    ]
  },
  plugins: [
    p_html_config,
    p_extract_text_config,
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}

