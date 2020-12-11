const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js'
  },
  devServer: {
    open: true,
    hot: true,
    // hot 和 hotOnly 的区别是在热更新逻辑出错或某些模块不支持热更新的情况下，
    // 前者会自动刷新页面，后者不会刷新页面，而是在控制台输出热更新失败
    // hotOnly: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash:8].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack HMR',
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
