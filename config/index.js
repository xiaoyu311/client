module.exports = {
  build: {
    assetsPublicPath: './',
    env: {
      NODE_ENV: 'production'
    }
  },
  dev: {
    assetsPublicPath: '/',
    env: {
      NODE_ENV: 'development',
    },
    port: 8080,
    proxy: {
      '/.+': {
        target: 'http://localhost:3001', // target host 
        changeOrigin: true,               // needed for virtual hosted sites 
        ws: true,                         // proxy websockets 
        pathRewrite: {
          // '^/api/old-path': '/api/new-path',     // rewrite path 
          // '^/api/remove/path': '/path'           // remove base path 
        },
        router: {
          // when request.headers.host == 'dev.localhost:3000', 
          // override target 'http://www.example.org' to 'http://localhost:8000' 
          // 'dev.localhost:3000': 'http://localhost:8000'
        }
      }
    }
  }
}