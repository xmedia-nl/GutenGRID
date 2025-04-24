const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { merge } = require('webpack-merge');

merge(defaultConfig, {
  optimization: {
    minimize: false,
  },
});