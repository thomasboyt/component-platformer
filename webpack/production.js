const common = require('./base');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
});
