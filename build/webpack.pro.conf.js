const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const config = require('../config');
const env = config.build.env;

const webpackConfig = merge(baseWebpackConfig, {
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.join(__dirname, '../') }),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].min.css'
    }),
    new HtmlWebpackPlugin({
      title: 'xiaoyu',
      filename: 'index.html',
      template: 'public/index.html',
      minify: {
        collapseInlineTagWhitespace: true
      },
      inject: true,
      favicon: 'public/favicon.ico'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new InlineChunkWebpackPlugin({
      inlineChunks: ['manifest']
    })
  ]
})

module.exports = webpackConfig;