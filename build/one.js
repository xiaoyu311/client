const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const generateConfig = env => {

}

module.exports = {
  entry: {
    index: './src/index.js',

  },
  output: {
    path: path.resolve(__dirname, "../dist"), // string
    filename: "js/[name].bundle.js",
    chunkFilename: 'js/[name].chunk.js'
  },
  resolve: {
    extensions: ['', '.js', '.css', '.scss'],
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
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: true,
                localIdentName: '[path][name]_[local]_[hash:base64:5]',
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: [
                  require('autoprefixer')()
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 10000,
              publicPath: '',
              outputPath: '../dist/',
              useRelativePath: true
            }
          },
          {
            loader: 'img-loader',
            options: {
              // enabled: process.env.NODE_ENV === 'production',
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
          }
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 10000,
              publicPath: '',
              outputPath: '../dist/fonts',
              useRelativePath: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.join(__dirname, '../') }),
    new webpack.optimize.UglifyJsPlugin(),
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
    new webpack.DefinePlugin({//这个也是webpack自带的包
      'process.env.NODE_ENV': '"production"'//看看是不是生产  生产会去掉一些乱七八糟的警告
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
}