const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // 因为这里生成的 index.html 会输出到 dist 目录，所以 publicPath 不用配置
    // publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10 KB
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(), // 可以输出webpack打包进度
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack-play',
      template: './index.html'
    }),
    // 配置多个 HtmlWebpackPlugin 对象可以生成多个 html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        // 可以配置多个对象，表示拷贝目录文件到另一个目录，默认拷贝到 output.path
        // { from: 'public', to: 'dist' },
        { from: 'public' }
      ]
    })
  ]
}
