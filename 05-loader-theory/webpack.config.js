const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          // 'html-loader',  // 使用 js 描述 html 模块内容
          './markdown-loader'
        ]
      }
    ]
  }
}