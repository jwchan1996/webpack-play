const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
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
        test: /\.(png|jpg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            // 10 KB 小于 10 KB 的图片使用 url data 的方式加载
            // 超过 10 KB 的图片会使用 file-loader 单独提取存放
            limit: 10 * 1024 ,
            name: 'img/[name]-[hash:8].[ext]'
          }
        }
      },
      // 以单独文件提取
      {
        test: /\.gif$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash:8].[ext]'
          }
        }
      },
      // 处理 html 文件
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src',
                },
                {
                  tag: 'a',
                  attribute: 'href',
                  type: 'src',
                },
              ]
            }
          }
        }
      }
    ]
  }
}
