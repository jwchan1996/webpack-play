# Loader 加载器机制

## webpack 核心原理

一个项目中会有各种各样的文件，`webpack` 会根据配置找到一个文件作为打包的入口，一般情况下这个入口都会是 `js` 文件，会顺着入口文件的代码，根据文件依赖关系，根据代码中出现的 `import` 或 `require` 语句解析推断出来该文件所依赖的资源模块，然后分别去解析每个资源模块对应的依赖，最后形成整个项目中所用到资源的依赖关系树。

![image.png](https://i.loli.net/2020/11/24/QeKXT5DVR48aHly.png)

有了依赖关系树过后，`webpack` 会递归依赖关系树，找到每个节点所对应的资源文件，然后根据 `modules` 配置的 `rules` 规则找到这个模块对应的加载器，从而交给对应的加载器去加载这个模块，最后会把加载的结果放到 `bundle` 中，也就是打包结果中，从而实现整个项目的打包。

整个过程中，**Loader 机制起了很重要的作用，是 webpack 的核心**。没有 `Loader` 就没法处理各种类型资源的加载，`webpack` 只能算是代码打包或合并的工具。

## Loader 的工作原理

`webpack` 中处理资源加载的 `Loader` 会形成一个管道，不管使用多少个 `Loader` 处理资源，最终要求的是 `Loader` 要返回一段 `js` 代码。

下面尝试写一个处理 `markdown` 文件的 `loader，实现读取` md 内容并转换为 `html` 显示在网页。在根目录下新建 `markdown-loader.js` 文件。

`Loader` 加载器导出的是一个函数，函数接收处理的资源内容为参数。这里使用 `JSON.stringify()` 方法对 md 资源内容进行字符串转移，避免 `js` 加载时发生歧义从而报错。

```javascript
// markdown-loader.js
module.exports = source => {
  return `module.exports = ${JSON.stringify(source)}`
}
```

当然，也支持使用 `ESM` 的语法 `export default` 进行导出。

然后配置 `webpack.config.js` 文件对 `md` `文件进行处理，webpack` 支持直接使用符合 `npm` 模块规范的 `js` 文件作为 `Loader。`

```javascript
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
          './markdown-loader'
        ]
      }
    ]
  }
}
```

下面是打包后生成的 `bundle` 文件：

```javascript
// bundle.js
(()=>{var r={714:r=>{r.exports="# Loader 加载器机制\r\n\r\n## webpack 核心原理\r\n\r\n一个项目中会有各种各样的文件，`webpack` 会根据配置找到一个文件作为打包的入口，一般情况下这个入口都会是 `js` 文件，会顺着入口文件的代码，根据文件依赖关系，根据代码中出现的 `import` 或 `require` 语句解析推断出来该文件所依赖的资源模块，然后分别去解析每个资源模块对应的依赖，最后形成整个项目中所用到资源的依赖关系树。"}},e={};function t(n){if(e[n])return e[n].exports;var o=e[n]={exports:{}};return r[n](o,o.exports,t),o.exports}t.n=r=>{var e=r&&r.__esModule?()=>r.default:()=>r;return t.d(e,{a:e}),e},t.d=(r,e)=>{for(var n in e)t.o(e,n)&&!t.o(r,n)&&Object.defineProperty(r,n,{enumerable:!0,get:e[n]})},t.o=(r,e)=>Object.prototype.hasOwnProperty.call(r,e),(()=>{"use strict";var r=t(714),e=t.n(r);document.write(e())})()})();
```

此时直接运行 `serve` 启动开发服务器，打开页面显然无法达到我们想要的效果，因为代码根本还没转成 `html`。

`webpack` 中 `Loader` 的工作身份有两种类型：

- 第一种是独立工作的，返回的是一段 `js` 代码
- 第二种是需要配合其他 `Loader` 进行工作，返回一段字符串交给下一个 `Loader` 处理

### 独立工作的 Loader

在 `markdown-loader.js` 中引入第三方库，将 `md` 内容转换为 `html` 内容，然后返回一段 `js` 代码。

```javascript
// markdown-loader.js
const marked = require('marked')

module.exports = source => {
  const html = marked(source)
  return `module.exports = ${JSON.stringify(html)}`
}
```

打包后，启动开发服务器，即可看到 `md` 转换的 `html` 内容，下面是网页显示效果。

![image.png](https://i.loli.net/2020/12/02/UBDIPtmysVCuYRg.png)

### 配合其他 Loader 工作的 Loader

将 `markdown-loader` 作为中间加载器，返回处理好的 `html` 字符串，交给下一个 `loader` ，也就是 `html-loader` 进行处理。

```javascript
// markdown-loader.js
const marked = require('marked')

module.exports = source => {
  const html = marked(source)
  return html
}
```

返回 `html` 字符串交给 `html-loader` 进行处理，配置 `rules` ：

```javascript
// webpack.config.js
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
          'html-loader'   // 使用 js 描述 html 内容
          './markdown-loader'
        ]
      }
    ]
  }
}
```

打包后，也能在网页正常显示转换后的 `html` 内容。

至此，我们就实现了一个简单的 `Loader` 啦。