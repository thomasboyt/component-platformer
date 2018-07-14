var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/entry.ts',

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../build'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './templates/index.html',
      filename: 'index.html',
      // inject: 'body',
      // chunks: ['app'],
    }),
  ],

  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: /\.(png|jpg|gif|ttf|wav)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
      },
    ],
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
