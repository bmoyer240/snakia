/**
 * webpack configuration
 *\
 */

// modules
const path    = require("path");
const webpack = require("webpack");

// webpack plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// define paths
const PATH_DIST = path.resolve( __dirname, "./dist" );
const PATH_SRC  = path.resolve( __dirname, "./src" );

// webpack configuration
module.exports = {
  context   : PATH_SRC,

  // webpack-dev-server config
  devServer : {
    compress: true
  },
  devtool: "source-map",

  entry  : "./app.js",

  // production distro settings
  output :{
    filename   : "bundle.js",
    path       : PATH_DIST,
    publicPath : PATH_DIST
  },

  module :{
    loaders: [
      // js/jsx babel loaded
      {
        exclude : "/node_modules/",
        loader  : "babel-loader",
        test    : /\.(js|jsx)$/
      },

      // sass compiler, css loader using extract
      // whichs moves the css from bundle to self
      // contained css file
      {
        loader : ExtractTextPlugin.extract({
          fallback : "style-loader",
          use      : [ { loader: "css-loader" }, { loader: "sass-loader" } ]
        }),
        test   : /\.scss$/
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      disable  : process.env.NODE_ENV === "development",
      filename : "dist/css/app.css"
    }),
    new HtmlWebpackPlugin({
      filename : PATH_DIST + "/index.html",
      hash     : true,
      inject   : "body"
    }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],

  // define extensions so they are not required within
  // the import statement
  resolve: {
    // resolves left to right
    extensions : [ "*", ".js", ".jsx", ".json" ]
  }
}

