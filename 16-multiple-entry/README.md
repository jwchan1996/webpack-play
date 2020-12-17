# webpack 优化配置之 Code Splitting 多入口打包

所有模块打包在一起，会导致 `bundle` 文件体积过大。而实际上应用在开始工作时，并不是每个模块在启动时都是必须要加载进来的。更合理的做法是将代码通过合理的规则拆分成多个 `bundle`，根据应用的运行需要进行按需加载这些模块，这样可以大大提高应用的响应速度与运行效率。

`webpack` 实现分包的方式有两种：

- 多入口打包
- 动态导入

下面来看一下如何配置多入口打包。

多入口打包一般是用于传统的多页面程序，最常见的划分规则是一个页面对应一个入口，对于不同的页面的公共部分单独提取到公共文件中。

下面是一个具有多页面的应用，下面将 `webpack` 的单入口配置为多入口。

```diff
// webpack.config.js
  const path = require('path')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    mode: 'none',
-   entry: '/src/index.js',
+   entry: {
+     index: './src/index.js',
+     album: './src/album.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
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
        }
      ]
    },
    plugins: [
      // CleanWebpackPlugin 默认根据配置的 output.path 路径进行清空，不配置 output.path 不生效
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Multi Entry',
        template: './src/index.html',
        filename: 'index.html',
+        // 允许插入到模板中的一些 chunk，不配置此项默认会将 entry 中所有的 chunk 注入到模板中
+       chunks: ['index'] 
      }),
+     new HtmlWebpackPlugin({
+       title: 'Multi Entry',
+       template: './src/album.html',
+       filename: 'album.html',
+       chunks: ['album']
+     })
    ]
  }

```

配置后，既可以进行正常的多入口打包，可以看到输出了多个 html 入口文件。

```bash
├── dist
│   ├── album.bundle.js
│   ├── album.js
│   ├── index.bundle.js
│   └── index.js
```

多入口打包下，不同入口中肯定会有公共模块，按照上面方法的话 bundle 中会有相同的模块出现。

那怎么提取公共模块呢？配置如下面所示，打包后会多出个公共模块文件。

```diff
// webpack.config.js
...
...

  module.exports = {
    ...
    ...
+   optimization: {
+     splitChunks: {
+       // 对所有的 chunk 提取公共 chunk
+       chunks: 'all',
+       // webpack 5 不再支持自动命名，需要手动配置
+       name: 'common-chunk'
+     }
+   },
    module: {
      ...
      ...
    }
  }
```

运行打包命令后:

```bash
├── dist
│   ├── album.bundle.js
│   ├── album.js
│   ├── common-chunk.bundle.js
│   ├── index.bundle.js
│   └── index.js
```