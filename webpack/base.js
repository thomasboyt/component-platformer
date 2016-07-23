var createVendorChunk = require('webpack-create-vendor-chunk');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/entry.ts',
    ],
  },

  output: {
    path: './build/',
    filename: '[name].[chunkhash].js'
  },

  plugins: [
    createVendorChunk(),
    // new ExtractTextPlugin('[name].[chunkhash].css'),

    new HtmlWebpackPlugin({
      template: './templates/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['vendor', 'app'],
    }),
  ],

  resolve: {
    extensions: ['', '.jsx', '.js', '.tsx', '.ts'],

    alias: {
      '__root': process.cwd(),
    },
  },

  devtool: 'source-map',

  ts: {
    compilerOptions: {
      noEmit: false,
    },
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['babel', 'ts']
      },

      {
        test: /\.js$/,
        exclude: /(node_modules\/)/,
        loader: 'babel-loader',
      },

    ]
  },

  devServer: {
    contentBase: 'static',
    historyApiFallback: true,

    proxy: {
      '/server': {
        target: 'ws://localhost:4081',
        ws: true,
      },
    },
  },
};
