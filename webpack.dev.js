const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.js')

module.exports = merge(common, {
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new BundleAnalyzerPlugin({ openAnalyzer: false }),
  ],
  devtool: 'source-map',
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, './react_d3_practice/src'),
    // inline: true,
    publicPath: '/dist/',
    historyApiFallback: true,
  },
})
