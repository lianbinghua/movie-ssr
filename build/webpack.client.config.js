const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')

const config = merge(base, {
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // generate output HTML
    new HTMLPlugin({
      template: 'src/index.template.html'
    })
  ]
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // auto generate service worker
    // Service Worker Precache是一个能自动生成Service Worker文件的模块，
    // 你可以利用它来预先缓存资源。它可以和你的构建过程集成在一起，
    // 一旦配置完成，它就可以识别你的站点中所有静态资源（HTML，JavaScript，CSS，图片等）并生成每个文件内容的哈希值。
    // 每个静态资源的网址、版本信息的哈希值都存储在生成的Service Worker文件中，当客户端发起向这些静态资源的网络请求时，Service Worker会优先返回缓存中的相应资源，并且当之后的构建过程中改变了这些资源后，Service Worker也会更新相应的资源

    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

module.exports = config
