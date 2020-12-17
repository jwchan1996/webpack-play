# 资源模块加载

这里打包后的项目预览建议全局安装使用 `serve` 这个开发服务器模块。

```bash
yarn add serve global
```

打包完成后，在项目根目录运行 `serve` 即可开启本地开发服务器，对打包结果进行预览。

## 模块处理

`webpack` 默认会把遇到的所有文件都当成是 `js` 文件去进行模块解析，其他类型的文件则需要配置对应的 `loader` 进行解析处理。

![image.png](https://i.loli.net/2020/11/22/qcJuljXbBkIo4xA.png)

对模块配置处理规则，每个规则对象必须包含两个属性，一个是 `test` 属性用来匹配文件类型，另一个是 `use` 属性指定使用的 `loader` 来处理文件。

比如下面处理 `css` 文件资源，指定两个 `loader` 进行处理，其中处理顺序是从后往前。

```javascript
// webpack.config.js

module.exports = {
  ...
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
  }
}
```

## 文件资源加载器

图片等资源无法像 `css` 一样可以使用 `js` 来描述，从而使用 `css-loader` 和 `style-loader` 处理，图片等资源文件需要使用 `file-loader` 进行处理。

![image.png](https://i.loli.net/2020/11/22/7KjbCRImylL2sTZ.png)

`webpack` 在打包时遇到了图片文件，根据配置文件的配置匹配到了文件加载器 `file-loader`，`file-loader` 会将文件拷贝到配置好的输出目录，然后将文件拷贝到输出目录后的文件路径作为当前模块的返回值返回。

下面是 `file-loader` 处理图片：

```javascript
// webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.gif$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash:8].[ext]'
          }
        }
      }
    ]
  }
}
```

## URL 加载器

![image.png](https://i.loli.net/2020/11/23/I8gtcTp1quRXJdk.png)
![image.png](https://i.loli.net/2020/11/23/yKZR4H2P6NMeA5v.png)
![image.png](https://i.loli.net/2020/11/23/M1wROX87TLnZB5c.png)

`url-loader` 可以转换一个资源文件为 `Data URLs`。

下面是 `url-loader` 的用法：

```javascript
// webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            // 10 KB 小于 10 KB 的图片使用 data urls 的方式加载
            // 超过 10 KB 的图片会使用 file-loader 单独提取存放
            limit: 10 * 1024 ,
            name: 'img/[name]-[hash:8].[ext]' // 打包输出文件名
          }
        }
      }
    ]
  }
}
```

如果按照这种方式使用 `url-loader`，则一定需要安装 `file-loader`，因为 `url-loader` 对于超出配置大小的文件会调用 `file-loader` 去处理。

## 模块加载方式

- 遵循 `ES Modules` 标准的 `import` 声明
- 遵循 `CommonJS` 标准的 `require` 函数

对于 `ES Modules` 的默认导出，`require` 导入的时候需要调用 `default` 属性去获取

- 遵循 `AMD` 标准的 `define` 函数和 `requrie` 函数

除非必要的情况，不应该在同一项目中混合使用多种标准，防止维护困难。

除了 `js` 代码当中的这三种方式以外，还有一些独立的加载器在工作时也会处理加载资源中一些导入的模块，即 `Loader` 加载的非 `JavaScript` 也会触发资源加载。

比如 `css-loader` 在加载 `css` 样式文件时，样式代码中的 `@import` 指令和 `url` 函数也会触发相关资源的加载，`html-loader` 在加载 `html` 代码中图片标签的 `src` 属性也会触发资源的加载。

比如：

- *样式代码中的 `@import` 指令和 `url` 函数

```css
/* src/main.css */

@import url('./reset.css');

body {
  margin: 0 auto;
  padding: 0 20px;
  max-width: 800px;
  background: #f4f8fb;
  background-image: url(bg.png);
}
```

- `*HTML` 代码中图片标签的 `src` 属性

```html
<!-- src/footer.html -->

<footer>
  <img src="./dog.jpg" alt="狗">
  <a href="./dog.jpg" download>下载</a>
</footer>
```

经过版本迭代，最新版的 `html-loader` 的用法已经变了很多，更多详情参考[官方仓库](https://github.com/webpack-contrib/html-loader)

```javascript
// webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
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
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```