var merge = require('webpack-merge');
var common = require('./base');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  serve: {
    content: './static',
    hot: false,
  },
});