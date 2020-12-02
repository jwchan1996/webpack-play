const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // 本项目 index.html 文件与打包后的 static 目录不在同一目录下
    // 在生产模式下资源文件加载的时候需要拼接 dist 目录才能找到 static 下的资源
    publicPath: 'dist/'  
    // 后面阶段会用插件将 index.html 拷贝到 dist 目录，这里 publicPath 就可以不配置了，默认是 ""，表示相对路径
    // 当然，这个还有一个作用就是为资源配 cdn 前缀
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, // 10 KB
            name: 'static/img/[name]-[hash:8].[ext]'
          }
        }
      }
    ]
  }
}
