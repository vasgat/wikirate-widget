const webpack = require('webpack')
module.exports = {
  publicPath: '',
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  },
  chainWebpack:
    config => {
      config.optimization.delete('splitChunks')
    }, 
    filenameHashing: false
}