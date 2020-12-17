# 插件机制与常用插件

## 插件机制

插件机制是 `webpack` 的另一个核心机制，目的是增强 `webpack` 在项目中的自动化能力。`Loader` 专注实现资源模块加载，从而是实现整体项目的打包，而 `Plugin` 是为了解决除了资源打包外的所有自动化工作。

例如使用对应的 `Plugin` 可以在打包前自动清除 `dist` 目录，可以拷贝不需要参与打包的静态资源文件到输出目录，可以压缩打包后的输出代码。

使用 `webpack` + `plugin` 可以实现绝大多数前端工程化的工作。

## 常用插件

### 自动清除输出目录插件 clean-webpack-plugin

`clean-webpack-plugin` 插件会在 `webpack` 打包过程中自动清除 `output.path` 目录下的所有文件。

#### 安装依赖

```bash
yarn add clean-webpack-plugin --dev
```

#### 配置使用插件

```javascript
// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  ...
  ...
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

### 自动生成 HTML 插件

除了自动清除 `dist` 目录之外，还有一个常见的需求就是自动生成使用打包结果 `bundle.js` 的 `html`。在此之前我们的 `html` 都是通过硬编码的方式存在项目的根目录下的。

这种硬编码方式有两个问题。一是我们发布项目时要同时发布 `index.html` 和 `dist` 目录的打包结果，这样相对麻烦一些，而且上线时还要确保 `html` 中 `script` 标签引用的路径是正确的。二是如果我们输出的目录或输出的文件名改变了的话，也就是打包配置发生了变化，`index.html` 中的 `script` 标签引用的路径也就需要我们手动地修改。

解决上面问题的最好办法就是通过 `webpack` 自动去生成 `html` 文件，也就是让 `html` 也去参与 `webpack` 的构建过程。在构建过程中，`webpack` 知道生成了多少个 `bundle`，会自动地将这些打包生成的 `bundle` 添加到页面当中。这样一方面 `html` 会输出到了 `dist` 目录，只要将 `dist` 目录发布出去即可。另一方面 `html` 中对于 `bundle` 的引用是动态地注入进来的，不需要手动硬编码，可以确保路径的引用是正常的。

具体的实现需要借助第三方插件 `html-webpack-plugin` 来完成。

#### 安装依赖

```bash
yarn add html-webpack-plugin --dev
```

#### 配置使用插件

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  ...
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```

#### 使用插件构建打包

此时运行打包命令默认会找到根目录下的 `index.html` 作为生成 `html` 的模板，生成 `html` 的文件名默认也是 `index.html`。

`HtmlWebpackPlugin` 插件生成的 `index.html` 如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"><script defer src="bundle.js"></script></head>
  <body>
  </body>
</html>
```

可以看到，打包后的 `bundle` 文件自动以 `script` 标签注入到生成的 `index.html` 文件中。

`HtmlWebpackPlugin` 插件还有许多配置，具体可以参考[官网](https://github.com/jantimon/html-webpack-plugin)

#### 进一步优化配置

自动生成的 `html` 文件可以进一步优化或自定义，比如默认生成的 `html` 标题需要修改。对于简单的自定义可以通过修改 `html-webpack-plugin` 插件的配置去实现。

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack-play'
    })
  ]
}
```

重新运行打包命令，生成的 `html` 文件的 `title` 标签会替换成 `<title>webpack-play</title>`。

还可以在生成 `html` 页面的源页面添加模板，`html-webpack-plugin` 通过模板去生成对应的页面。对于页面中需要通过模板生成的内容，可以通过 `lodash template` 语法去输出，其中可以通过 `htmlWebpackPlugin.options` 属性获取到 `html-webpack-plugin` 实例对象的配置对象，`htmlWebpackPlugin` 这个变量是 `html-webpack-plugin` 插件内部提供的一个变量。

源文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webpack Plugins</title>
</head>
<body>
  <script src="dist/bundle.js"></script>
</body>
</html>
```

配置插件模板：

```javascript
plugins: [
  new HtmlWebpackPlugin({
    title: 'webpack-play',
    template: './index.html'
  })
]
```

根据 `loadash template` 语法修改模板，注入插件配置的变量：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <div><%= htmlWebpackPlugin.options.title %></div>
</body>
</html>
```

打包后：

```html
<!-- dist/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack-play</title>
<script defer src="bundle.js"></script></head>
<body>
  <div>webpack-play</div>
</body>
</html>
```

还有一个常见的需求是同时输出多个页面文件，除非我们的应用是单页面应用，否则会有多个 `html` 文件，需要输出多个页面文件。

如果我们需要创建多个 `html` 文件，可以在 `webpack` 的 `plugins` 属性添加多个 `HtmlWebpackPlugin` 实例对象。

```javascript
plugins: [
  new HtmlWebpackPlugin({
    title: 'webpack-play',
    template: './index.html'
  }),
  // 配置多个 HtmlWebpackPlugin 对象可以生成多个 html
  new HtmlWebpackPlugin({
    filename: 'about.html'
  })
]
```

### 静态文件拷贝插件

在我们的项目当中，还有一些不需要参与构建的静态文件，最终也需要发布到线上。例如网页图标 `favicon.ico`，一般放到项目的 `public` 目录下。将这些静态文件复制到打包后的目录，需要借助 `copy-webpack-plugin` 插件。

#### 安装依赖

```bash
yarn add copy-webpack-plugin --dev
```

#### 配置使用插件

```javascript
plugins: [
  new CopyWebpackPlugin({
    patterns: [
      // 可以配置多个对象，表示拷贝目录文件到另一个目录，默认拷贝到 output.path
      // { from: 'public', to: 'dist' },
      { from: 'public' }
    ]
  })
]
```

> 补充：webpack 提供的 ProgressPlugin 插件可以实时输出 webpack 的打包进度，用法是 new webpack.ProgressPlugin()