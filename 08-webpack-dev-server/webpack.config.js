const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // 因为这里生成的 index.html 会输出到 dist 目录，所以 publicPath 不用配置
    // publicPath: 'dist/'
  },
  devServer: {
    contentBase: './public',  // 开发服务器可读取资源地址
    hot: true,
    open: true
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
            limit: 10 * 1024, // 10 KB
            name: '[name]-[hash:8],[ext]'
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'dev-server',
      template: './index.html'
    }),
    // 这里开发模式下 拷贝 插件建议不要配置，避免频繁读写磁盘可以提高效率
    // 通过配置 devServer 的资源路径 contentBase 可读取路径可以实现资源查找的效果
    // new CopyWebpackPlugin({
    //   patterns: [
    //     // 可以配置多个对象，表示拷贝目录文件到另一个目录，默认拷贝到 output.path
    //     // { from: 'public', to: 'dist' },
    //     { from: 'public' }
    //   ]
    // })
  ]
}
