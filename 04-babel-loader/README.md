# 使用 babel-loader 处理 ES6 代码

`webpack` 默认的 `js` 加载器只是将 `js` 代码模块化，并不包含代码特性的转换，所以对于新的 `ES` 特性，需要使用 `babel-loader` 加载器进行代码转换。因为 `babel-loader` 依赖 `babel` 代码转换的核心模块，所以需要安装 `@babel/core` 以及用于完成具体特性转换的插件集合 `@babel/preset-env`。

因为严格意义上来说 `babel` 只是 `js` 代码的转换平台，所以我们需要通过 `babel` 使用不同的插件去转换代码当中具体的特性，需要配置 `babel` 所需要的插件。

```bash
yarn add babel-loader @babel/core @babel/preset-env --dev
```

在 `webpack.config.js` 中对 `babel-loader` 进行配置：

```javascript
// webpack.config.js

module.exports = {
  ...
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
      }
    ]
  }
}
```

其中 `presets` 选项可以预设需要转换的 `js` 代码的目标环境，这里 `@babel/preset-env` 是包含了所有 `ES6` 新特性转换的插件集合，默认会把所有 `ES6` 新特性转换为 `ES5。`

`除此之外，presets` 还可以指定需要兼容的浏览器，这样 `babel-loader` 就会根据预设的 `targets` 转换出兼容浏览器版本的代码。

```javascript
// webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'targets': {
                    'chrome': '58',
                    'ie': '11'
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
```

还可以使用 .babelrc、babel.config.js 等文件配置方式进行配置，具体使用方法参考[官网](https://www.babeljs.cn/docs/7.2.0/configuration)。

配置好后，运行打包命令 `yarn build`，即可在打包结果看到 `ES6` 代码全部被转换为 `ES5` 代码。

> 这里引申一下 output.publicPath 配置

打开 `webpack.config.js` 文件，可以看到 `output` 的 `publicPath` 选项配置为了 `dist/`。之所以这样配置，是因为本项目 `index.html` 文件与打包后的资源 `static` 目录不在同一目录下，在生产模式下资源文件加载的时候需要拼接 `dist` 目录才能找到 `static` 下的资源。

```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/'  
  }
}
```

当前项目，不配置 `publicPath` 的情况下，下面是打包后嵌入 `html` 的 `style` 标签样式引用的资源路径：

```css
body {
  margin: 0 auto;
  padding: 0 20px;
  max-width: 800px;
  background-image: url(./static/img/bg-67a8da92.png);
}
```

此时使用 `serve` 命令在根目录启动开发服务器，因为 `index.html` 文件与 `static` 目录不在同一层级，所以加载资源会出现 `404` 的错误。

配置 `publicPath` 后，打包后的资源路径可以正常加载：

```css
body {
  margin: 0 auto;
  padding: 0 20px;
  max-width: 800px;
  background-image: url(./dist/static/img/bg-67a8da92.png);
}
```

后面阶段会用插件将 `index.html` 拷贝到 `dist` 目录，这里 `publicPath` 就可以不进行配置，默认是 `""`，表示相对路径。当然，配置 `publicPath` 选项还有一个作用就是为资源配 `CDN` 前缀。

比如：

```javascript
{
  publicPath: 'https://cdn.example.com/'
}
```

打包后的资源路径会变为：

```css
body {
  background-image: url(https://cdn.example.com/static/img/bg-67a8da92.png);
}
```