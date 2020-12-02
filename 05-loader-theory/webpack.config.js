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
          // 'html-loader',
          './markdown-loader'
        ]
      }
    ]
  }
}