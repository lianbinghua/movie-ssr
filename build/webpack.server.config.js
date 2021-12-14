const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRPlugin = require('vue-ssr-webpack-plugin')

module.exports = merge(base, {
  target: 'node',//指定 Node 环境，避免非 Node 环境特定 API 报错，如 document 等
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'//因为服务器是 Node，所以必须按照 commonjs 规范打包才能被服务器调用。
  },
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRPlugin() //vue-ssr-bundle.json
  ]
})
