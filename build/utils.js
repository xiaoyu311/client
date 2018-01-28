const ExtractTextPlugin = require("extract-text-webpack-plugin");
const prod = process.env.NODE_ENV === 'production';
const path = require('path');

exports.styleLoaders = env => {
  const extractLess = new ExtractTextPlugin({
    filename: 'css/[name]-bundle-[hash:5].css'
  });
  const cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        minimize: prod,
        modules: prod,
        localIdentName: '[path][name]_[local]_[hash:base64:5]',
        sourceMap: !prod
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        sourceMap: !prod,
        plugins: [
          require('autoprefixer')()
        ]
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: !prod
      }
    }
  ]
  return env === 'production' ?
          extractLess.extract({
            fallback: 'style-loader',
            use: cssLoaders
          }) : 
          [{
            loader: 'style-loader'
          }].concat(cssLoaders)
}

exports.fileLoaders = env => {
  const imgLoader = {
    loader: 'img-loader',
    options: {
      enabled: env === 'production',
      gifsicle: {
        interlaced: false
      },
      mozjpeg: {
        progressive: true,
        arithmetic: false
      },
      optipng: false, // disabled 
      pngquant: {
        floyd: 0.5,
        speed: 2
      },
      svgo: {
        plugins: [
          { removeTitle: true },
          { convertPathData: false }
        ]
      }
    }
  };

  return env === 'development'
    ? [{
      loader: 'file-loader',
      options: {
        name: '[name]-[hash:5].[ext]',
        useRelativePath: true,
        outputPath: path.resolve(__dirname, 'dist'),
      }
    }]
    : [{
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].[ext]',
        limit: 10000,
        publicPath: '',
        outputPath: 'dist/',
        useRelativePath: true
      }
    }].concat(
      env === 'production' ? imgLoader : []
    )
}