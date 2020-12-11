# 提取单个 CSS 文件并压缩

## 使用 MiniCssExtractPlugin 提取单个 CSS 文件

`mini-css-extract-plugin` 插件在工作时会自动提取 CSS 到单个文件，通过这个插件可以实现 CSS 文件的按需加载。

```bash
yarn add mini-css-extract-plugin --dev
```

`MiniCssExtractPlugin` 会自动提取 `CSS` 到单个文件，`MiniCssExtractPlugin.loader` 可以使样式文件通过 `link` 方式进行引入。

```javascript
// webpack.config.js
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,  // 代替 style-loader 嵌入 html style 标签的用法
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Extract Single Css',
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin()
  ]
}
```

**注意**：样式文件体质不大的情况下，用 `style-loader` 处理到 `style` 标签效果更佳。样式文件体积很大则可以使用 `MiniCssExtractPlugin` 插件单独提取到 `CSS` 文件中。

## 使用 OptimizeCssAssetsWebpackPlugin 压缩 CSS 代码

使用 `optimize-css-assets-webpack-plugin` 插件对 `CSS` 样式文件进行压缩。

```bash
yarn add optimize-css-assets-webpack-plugin --dev
```

```javascript
// webpack.config.js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  plugins: [
    new OptimizeCssAssetsWebpackPlugin()
  ]
}
```

`webpack` 建议将压缩类的插件放到 `minimizer` 配置数组当中，以便于可以通过 `minimizer` 选项统一控制。

使用 `production` 模式进行打包的时候 `minimizer` 属性会自动开启，压缩功能就会生效。

```bash
yarn webpack --mode production
```

以普通模式进行打包，`minimizer` 属性规则不会开启，也就不会进行压缩打包输出了。

```bash
yarn webpack
```

一旦配置了 `minimizer` 属性，`webpack` 就会认为我们需要自定义压缩处理，`webpack` 内置的 `js` 压缩就会被覆盖掉，所以我们需要在 `minimizer` 选项中配置 `js` 压缩。

`webpack` 内部使用的 `js` 压缩插件是 `terser-webpack-plugin` 。

```bash
yarn add terser-webpack-plugin --dev
```

```javascript
// webpack.config.js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  plugins: [
    // new OptimizeCssAssetsWebpackPlugin()
  ]
}
```

## 输出文件名 Hash

解决缓存问题，生产模式下，文件名使用 `Hash`。`webpack` 配置当中的文件名 `filename` 都支持 `hash`，有三种方式各不相同。

第一种是项目级别的 `hash`，只要文件改动，打包出来的文件 `hash` 名就会变化。

```javascript
new MiniCssExtractPlugin({
  filename: '[name]-[hash]-bundle.css'
})
```

第二种是 `chunk` 级别的 `hash`。

```javascript
new MiniCssExtractPlugin({
  filename: '[name]-[chunkhash]-bundle.css'
})
```

第三种是文件级别的 `hash`。

```javascript
new MiniCssExtractPlugin({
  filename: '[name]-[contenthash]-bundle.css'
})
```

还可以指定 `hash` 值的长度。

```javascript
new MiniCssExtractPlugin({
  filename: '[name]-[hash:8]-bundle.css'
})
```