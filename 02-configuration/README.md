# 配置文件

`webpack 4` 之后的版本支持零配置启动打包，默认按照约定入口跟输出是 `src/index.js` `->` `dist/main.js`。但是，往往我们需要自定义这些路径，需通过 `webpack.config.js` 进行配置。

```javascript
// webpack.config.js

const path = require('path')

module.exports = {
  entry: './src/main.js', // 打包入口文件
  output: {
    filename: 'bundle.js',  // 打包输出文件名
    path: path.resolve(__dirname, 'dist')   // 打包输出文件目录
  }
}
```

然后运行 `yarn webpack` 命令即可完成打包，可在配置的输出目录找到打包后的文件。

其中打包后的代码是经过压缩的，原因是 `webpack` 内置插件会对 `js` 代码进行压缩。

关于 `scripts` 命令，一般我们都会在 `package.json` 文件的 `scripts` 中定义需要执行的命令，比如：

```javascript
{
  "scripts": {
    "build": "webpack"
  }
}
```

这时候我们可以通过 `yarn build` 或者通过 `npm run build` 来实现打包，与 `yarn webpack` 是一样的效果。

