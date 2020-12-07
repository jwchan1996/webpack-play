# webpack-dev-server

> 注意：当前 webpack-dev-server 3.x 版本暂时不支持 webpack 5 与 webpack-cli 4，所以当前示例代码使用的是 webpack@4.x 与 webpack-cli@3.x 版本。

![image.png](https://i.loli.net/2020/11/24/Hq3u46h7sZkyxGi.png)

一般理想的开发环境如下：

- 以 `HTTP Server` 运行。项目以 `http` 服务的方式去运行，而不是以文件的形式预览。一是更接近生产环境，二是 `ajax` 不支持在文件 `file` 协议中使用。
- 自动编译、自动更新。修改源代码后，`webpack` 能够自动进行构建，浏览器及时显示最新的结果，这样能大大地减少开发中的重复操作。
- 提供 `Source Map` 支持。代码出现错误，能够快速定位错误代码位置。

## 实现自动编译

代替人工手动输入打包命令的方式，可以使用 `webpack-cli` 的 `watch` 工作模式。`watch` 模式下，`webpack-cli` 会监听文件变化，一旦文件变换会自动重新打包。

```bash
yarn webpack --watch
```

## 自动刷新页面

下面要实现文件编译过后自动刷新浏览器，可以使用 `browser-sync` 实现。

监听构建打包后的 `dist` 文件夹下所有文件的变化：

```bash
browser-sync dist --files "**/*"
```

**注意**：以上使用 `webpack-cli` `watch` 实现自动构建以及使用 `browser-sync` 实现自动刷新的方式也有弊端。一是操作上麻烦，需要同时使用两个工具；二是开发效率降低，`webpack` 会不断的将文件写入磁盘，然后 `browser-sync` 从磁盘读出来，一次过程需要两次磁盘读写操作。

还需要更高效的方案，如使用 `webpack-dev-server` 工具。

## Webpack Dev Server

`webpack-dev-server` 是 `webpack` 官方提供的开发工具，提供了开发的 `HTTP Server`，集成了 【自动编译】和【自动刷新浏览器】等功能。

```bash
yarn add webpack-dev-server --dev
```

运行了 `webpack-dev-server` 命令后，它的内部会自动将项目进行打包并启动一个开发服务器，监听文件变化并同步浏览器页面，其中项目打包后的文件是放在内存当中的，而不是进行磁盘的读写，大大提高了开发的效率。

> 运行命令时增加 --open 参数，会自动打开浏览器页面，打开项目的预览地址了。当然，也可以通过配置文件实现。

下面是配置 `webpack-dev-server` 的一些选项，更详细的配置可自行前往官网查看。

```javascript
// webpack.config.js
module.exports = {
  ...
  devServer: {
    hot: true,  // 开启模块热更新
    open: true  // 自动打开服务浏览器运行地址
  }
}
```

其中，实际开发中会发现，修改 `css` 样式文件能实现无刷新更新页面，而修改 `js` 文件则会触发页面刷新，这是因为 `webpack` 中的热更新不能开箱即用的，需要手动处理热更新逻辑。其中样式文件是通过 `style-loader` 处理了热更新逻辑，因为修改后的样式只要覆盖之前页面的样式即可实现热更新。而 `js` 文件的修改，`js` 的执行方式都是没有规律的，`webpack` 无法提供一个通用的实现热更新逻辑的 `Loader`。

关于 `webpack` 热更新的相关会在往后的文章说到。

## Webpack Dev Server 静态资源访问

`webpack-dev-server` 默认会将构建结果输出的文件全部作为开发服务器的资源文件，只要是通过 `webpack` 打包生成的文件，都可以直接访问的到。

如果有些静态资源文件也需要被开发服务器访问的话，就要另外地告诉 `webpack-dev-server`，配置额外的静态资源目录。增加 `devServer` 配置，给 `contentBase` 属性指定可以读取静态资源的目录。

```javascript
// webpack.config.js
module.exports = {
  ...
  devServer: {
    contentBase: './public'
  }
}
```

所以为了加快打包构建速度，一般开发阶段不使用 `copy-webpack-plugin` 静态资源拷贝插件，因为 `devServer` 的 `contentBase` 选项能够代替相关功能。