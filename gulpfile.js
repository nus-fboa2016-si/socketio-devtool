'use strict';
var gulp = require('gulp');
var webpack = require('webpack');
var path =  require('path');
var gutil = require('gutil');
let BowerWebpackPlugin = require('bower-webpack-plugin');

const browser = 'chrome'
const env = 'dev';
const srcPath = path.join(__dirname, '/src/app/');

gulp.task('build', function(callback){
  var myConfig = {
    debug: true,
    entry: {
      app: "./src/app/index",
      connect: "./src/chrome/src/connect",
      checkForIO: './src/chrome/src/checkForIO'
    },
    output: {
      path: path.join(__dirname, `src/${ browser }/dist`),
      filename: "[name].js"
    },
    module:{
      loaders: [
        // required to write "require('./style.css')"
        { test: /\.css$/,    loader: "style-loader!css-loader" },
        { test: /\.scss/, loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'},
        { test: /\.(png|jpg|gif|woff|woff2)$/, loader: 'url-loader?limit=8192'},
        // required for react jsx
        { test: /\.(js|jsx)$/,    loader: "react-hot!babel-loader" }
      ]
    },
    resolve: {
      alias: {
        actions: `${ srcPath }/actions/`,
        components: `${ srcPath }/components/`,
        sources: `${ srcPath }/sources/`,
        stores: `${ srcPath }/stores/`,
        styles: `${ srcPath }/styles/`,
        config: `${ srcPath }/config/` + env}
    },
    plugins: [
      //new webpack.HotModuleReplacementPlugin(),
      //new webpack.NoErrorsPlugin(),
      //new BowerWebpackPlugin({
      //  searchResolveModulesDirectories: false
      //})
    ]
  };

  webpack(myConfig, function(err, stats){
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});


gulp.task('watch', ['build'], function(){
  gulp.watch(['src/app/*', 'src/chrome/src/*'], ['build']);
});