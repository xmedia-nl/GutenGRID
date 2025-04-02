const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { merge } = require('webpack-merge');

module.exports = merge(defaultConfig, {
  optimization: {
    minimize: false,
  },
});