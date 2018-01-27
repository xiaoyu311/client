
const path = require('path');
const config = require('../config');
const utils = require('./utils');
const env = process.env.NODE_ENV;

const styleLoaders = utils.styleLoaders(env);
const fileLoaders = utils.fileLoaders(env);

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, "../dist"), // string
    publicPath: env === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: "js/[name].bundle.js",
    chunkFilename: 'js/[name].chunk.js'
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    alias: {
      'src': path.resolve(__dirname, '../src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        use: styleLoaders
      },
      {
        test: /\.(png|jpe?g|gif|eot|woff2?|ttf|svg)$/,
        use: fileLoaders
      }
    ]
  }
}