# HMR 模块热更新

模块热更新（`Hot Module Replacement`），简称 `HMR`。`webpack` 中最强大的功能之一，极大地提高了开发效率。

## 开启热更新

如何开启 `HMR` 呢？因为 `HMR` 已经集成在 `webpack-dev-server` 中，可以在运行 `webpack-dev-server` 命令的时候使用 `--hot` 参数开启热更新。

```bash
yarn webpack-dev-server --hot
```

> 注意：在 webpack 5 与 webpack-cli 4.0 以上版本，webpack-dev-server 启动命令变为 webpack serve

也可以通过配合文件开启，其中开启 `HMR` 需要瞒满足链各个条件：

1. 配置 devServer.hot 为 true
2. 配置 webpack.HotModuleReplacementPlugin 插件

> 请注意：webpack 要完全启用 HMR 需要使用 webpack.HotModuleReplacementPlugin。如果 webpack 或 webpack-dev-server 通过命令行添加 --hot 选项启动，这个插件会自动添加，所以不需要将它添加到 webpack.config.js 中。

但是，实际使用 `webpack-dev-server` 时发现，在 `webpack.config.js` 中只配置 `devServer.hot` 为 `true`，而未配置 `webpack.HotModuleReplacementPlugin` 的情况下，依赖可以正常使用 `HMR`。通过 `webpack-dev-server` 源码可知，它内部通过判断自动完成了这个插件的加载使用。

```javascript
// webpack.config.js
const webpack = require('webpack')

module.exports = {
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

至此，我们发现修改样式文件可以实现不刷新页面更新内容，而修改 `js` 文件时页面却刷新了。

`webpack` 中的 `HMR` 并不是开箱即用的，需要我们手动处理模块热更新逻辑。其中样式文件是通过 `style-loader` 处理了热更新逻辑，因为修改后的样式只要覆盖之前页面的样式即可实现热更新。而 `js` 文件的修改，`js` 的执行方式都是没有规律的，`webpack` 无法提供一个通用的实现热更新逻辑的 `Loader`。

那为什么有些项目不需要手动实现 `js` 的热更新逻辑呢？因为有些项目是通过脚手架创建的，`js` 文件是按照一定的规范的，脚手架项目内部集成了 `HMR` 方案。

**总结**：我们需要手动处理 `js` 模块更新后的热更新逻辑。

## 使用 HMR API 处理热更新逻辑

`webpack.HotModuleReplacementPlugin` 为 `js` 提供了一套处理 `HMR` 的 `API`，我们需要使用这些 `API` 去处理 `js` 更改后的代码如何更新到当前页面中。

这套 `API` 为 `module` 对象提供了 `hot` 属性，这个属性也是个对象，这个对象是 `HMR` 的核心对象。他提供了一个 `accept` 方法，用来注册当某个模块更新过后的处理函数。这个 `accept` 方法接收的第一个参数是依赖模块的路径，第二个是依赖更新过后的处理函数。

```javascript
// src/main.js
import createEditor from './editor'
import background from './bg.png'
import './global.css'

const editor = createEditor()
document.body.appendChild(editor)

const img = new Image()
img.src = background
document.body.appendChild(img)

// ============ 以下用于处理 HMR，与业务代码无关 ============

// webpack 开启热更新会注入 module.hot 变量，由此判断
if (module.hot) {
  // 监听对应模块，更新会触发对应函数
  module.hot.accept('./editor', () => {
    console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
  })
}
```

一旦使用 `API` 对文件进行 `HMR` 逻辑处理了，修改文件就不会再触发自动刷新页面了。

### 处理 JS 模块的热更新

下面是专门针对当前 `editor.js` 文件的热更新逻辑，并非是通用的热更新处理逻辑。

```javascript
// src/main.js

// ============ 以下用于处理 HMR，与业务代码无关 ============

// webpack 开启热更新会注入 module.hot 变量，由此判断
if (module.hot) {
  // 保存上一次的编辑器模块状态
  let lastEditor = editor
  // 监听对应模块，更新会触发对应函数
  module.hot.accept('./editor', () => {
    
    console.log('editor 模块更新了，需要这里手动处理热替换逻辑')

    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })
}
```

### 处理图片模块的热更新逻辑

```javascript
// src/main.js

if (module.hot) {
  module.hot.accept('./bg.png', () => {
    img.src = background
    console.log(background)
  })
}
```

## HMR 注意事项

- 如果热更新逻辑出现错误，会自动使用页面刷新的方式去更新页面。这样一来，就不利于发现错误信息，而且也无法实现无刷新更新页面。我们可以将 `devServer.hot` 替换为 `devServer.hotOnly`，这样在热更新逻辑出错的情况下是不会进行刷新的。

```javascript
devServer: {
  // hot: true,
  hotOnly: true
}
```

- 没启用 `HMR` 的情况下，`HMR API` 报错，那就需要在编写 `HMR` 逻辑的时候判断一下是否启用 `HMR`。

```javascript
if (module.hot) {
    // 热更新逻辑
}
```

- 代码中写了很多业务无关代码。在没开启 `HMR` 的情况下，只进行 `webpack` 打包，那些 `HMR` 相关的判断代码会被编译为：

```javascript
if (false) {} 
```