# webpack 优化配置之 DefinePlugin

`webpack` 内置的 `DefinePlugin` 插件能够为代码注入全局成员，在 `production` 模式下，这个插件默认会启动起来，往 `node` 环境中注入一个 `process.env.NODE_ENV` 常量成员，很多第三方模块都是通过这个成员来判断运行环境从而判断是否执行打印日志等操作。

下面单独使用一下这个插件：

```javascript
// webpack.config.js
const webpack = require('webpack')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      // 这里值要求的是一个引号包括起来的代码片段，这里用 JSON.stringify() 方法进行转换
      // 或者使用 '"https://api.example.com"' 也是可以的
      API_BASE_URL: JSON.stringify('https://api.example.com')
    })
  ]
}
```

```javascript
// src/main.js
console.log(API_BASE_URL)
```

**注意**：这里 `DefinePlugin` 插件注入的成员值是一个引号包括起来的代码段，内部会直接替换到注入成员使用的代码里，这里如果只是传入 `API_BASE_URL: 'https://api.example.com'`，内部替换后使用该成员的代码就会是 `console.log(https://api.example.com)`，就会报语法错误。

![image.png](https://s3.ax1x.com/2020/12/12/rVBUp9.png)