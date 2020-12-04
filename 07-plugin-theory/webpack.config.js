const path = require('path')
// const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation -> 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name)   // 文件名称
        // console.log(compilation.assets[name].source())  // 文件对应的内容
        // 匹配 js 文件,对文件中的无用注释进行替换
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          // 对文件内容进行正则替换
          const withoutComments  = contents.replace(/\/\*\*+\*\//g, '')
          // 替换后的文件内容覆盖原结果文件
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // 因为这里生成的 index.html 会输出到 dist 目录，所以 publicPath 不用配置
    // publicPath: 'dist/'
  },
  target: 'es5',  // 默认是 "web"，webpack 5 中需要设置为 "es5" 才会将打包组织代码输出 es5 代码
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
    // new webpack.ProgressPlugin(), // 可以输出webpack打包进度
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
    }),
    new MyPlugin()
  ]
}
