const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const path = require('path')

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    port: 8080,
    contentBase: [
      path.join(__dirname, 'donut chart'),
      path.join(__dirname, 'pie chart'),
      path.join(__dirname, 'line chart'),
      path.join(__dirname, 'multi bar chart'),
      path.join(__dirname, 'bar chart'),
    ],
    publicPath: '/dist/',
    historyApiFallback: true,
  },
})
