const webpackConfig = require('./webpack.dev.conf');
const webpack = require('webpack');
const express = require('express');
const config = require('../config');
const opn = require('opn');
const proxyMiddleware = require('http-proxy-middleware');

let port = process.env.PORT || config.dev.port;

const server = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
});

const hotMiddleware = require('webpack-hot-middleware')(compiler);

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

const proxyTable = config.dev.proxy;
for (let context in proxyTable) {
  server.use(proxyMiddleware(context, proxyTable[context]));
}

server.use(require('connect-history-api-fallback')());

// serve webpack bundle output
server.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
server.use(hotMiddleware);

module.exports = server.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  var uri = 'http://localhost:' + port;
  console.log('Listening at ' + uri + '\n');

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri);
  }
})
