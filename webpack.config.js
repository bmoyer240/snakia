/**
 * webpack configuration
 *\
 */

// modules
const path    = require("path");
const webpack = require("webpack");

// webpack plugins
const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const ExtractTextPluginConfig = new ExtractTextPlugin({
  disable  : process.env.NODE_ENV === "development",
  filename : "dist/css/app.css"
});

const HtmlWebpackPlugin = require("html-webpack-plugin");

// define paths
const PATH_DIST = path.join( __dirname, "dist" );
const PATH_SRC  = path.join( __dirname, "src" );

// webpack configuration
module.exports = {
  devServer:: {
    contentBase : "./dist",
    inline      : false
  },

  entry  : "./src/app.js",

  // production distro settings
  output :{
    filename   : "bundle.js",
    path       : "./dist",
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
      {
        test   : /\.scss$/,
        loader : ExtractTextPluginConfig.extract({
          fallback : "style-loader",
          use      : [ { loader: "css-loader" }, { loader: "sass-loader" } ]
        })
      },
      {
        loader : "file-loader",
        test   : /\.(eot|svg|ttf|woff|woff2)$/
      }
    ]
  },

  plugins: [
    ExtractTextPluginConfig,
    new HtmlWebpackPlugin({
      filename : "index.html",
      inject   : "body",
      template : "./index.html"
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
    extensions : [ "", ".js", ".jsx", ".json" ],
    // abs path
    root       : PATH_SRC
  }
}

