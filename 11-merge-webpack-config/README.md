# 为不同环境抽离配置

`mode`（模式），为不同的工作环境创建不同的配置。

## 配置文件根据环境不同导出不同配置

`webpack.config.js` 文件支持导出一个函数，函数可以根据参数获取当前打包环境，从而使用不同的配置。

```javascript
// webpack.config.js
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const config = {
    mode: 'development',
    entry: './src/main.js',
    output: {
      filename: 'js/bundle.js'
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      hot: true,
      contentBase: 'public'
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
              outputPath: 'img',
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Demo',
        template: './src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  }

  if (env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          // 可以配置多个对象，表示拷贝目录文件到另一个目录，默认拷贝到 output.path
          { from: 'public' }
        ]
      })
    ]
  }

  return config
}
```

运行下面打包命令，`webpack` 会按照 `production` 模式进行打包。

```bash
yarn webpack --env production
```

## 一个环境对应一个配置文件

一般分为三个配置文件，分别是开发环境配置、生产环境配置以及公共配置文件。

安装使用 `webpack-merge` 插件对 `webpack` 配置进行合并和覆盖。

```javascript
// webpack.prod.js
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        // 可以配置多个对象，表示拷贝目录文件到另一个目录，默认拷贝到 output.path
        { from: 'public' }
      ]
    })
  ]
})
```