# Plugin 插件机制

## 工作原理

相比于 `Loader`，`Plugin` 的能力范围要更宽一些。`Loader` 是在加载模块的环节去工作，而 `Plugin` 几乎触及到 `webpack` 工作的每一个环节。那么 `Plugin` 是怎么实现的呢？其实是利用了我们开发工程中常用的钩子机制去实现的。

`webpack` 为了能够更好的扩展，在整个打包过程的各个节点留下了很多预先定义好的钩子，这样插件 `Plugin` 就可以往这些节点上挂载不同的任务，可以轻松地去扩展 `webpack` 的能力。

![image.png](https://i.loli.net/2020/11/24/tTbVJ6Hu3lWm8xA.png)

## 实现一个插件

`webpack` 要求 `Plugin` 是一个函数或者是一个包含 `apply` 方法的对象。一般会把这个 `Plugin` 定义为一个类型，然后在这个类型中定义一个 `apply` 方法。在使用中就是利用这个类型去构建一个实例，从而调用实例的 `apply` 方法去使用。

下面自定义一个类，类当中 `apply` 方法会在 `webpack` 启动加载执行插件时自动调用。`apply` 方法接收一个 `compiler` 对象参数，这个 `compiler` 对象是 `webpack` 在工作中最核心的对象。这个对象包含了此次构建的所有信息，我们也是通过这个对象去注册钩子函数。

接下来是要实现一个清除打包后 `bundle` 文件没用的注释的功能。

![Dqchzn.png](https://s3.ax1x.com/2020/12/04/Dqchzn.png)

接下来就是要明确钩子执行的时机，以便于挂载我们自定义的任务。查看官网可以知道，`webpack` 的 `emit` 钩子会在即将往目录输出文件的时候执行。

通过 `compiler` 的 `hooks` 属性访问到 `emit` 钩子，通过 `tap` 方法去注册一个钩子函数。`tap` 方法接收两个参数，第一个参数是插件的名称，这里是 `MyPlugin`；第二个参数是挂载到钩子上的函数，函数接收一个参数 `compitaion`，可以理解为此次打包的上下文，此次打包的结果都放在这个对象中。通过 `compitation.assets` 属性可以获取到此次打包要输出的所有资源文件信息，这里 `compitation.assets` 属性值是一个对象，对象的键就是每个文件的名称。

```javascript
class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation -> 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name)   // 文件名称
        // console.log(compilation.assets[name].source())  // 文件对应的内容
        // 匹配 js 文件,对文件中的无用注释进行替换
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          // 对文件内容进行正则替换
          const withoutComments  = contents.replace(/\/\*\*+\*\//g, '')
          // 替换后的文件内容覆盖原结果文件
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}
```

通过判断处理 `js` 文件，获取文件的内容，以正则匹配的方式去替换掉代码中的注释。其中正则是以全局模式去替换，然后将替换完的结果覆盖到原有的结果当中。需要注意的是文件对象要求包含 `source` 方法以及 `size` 方法。

```javascript
// webpack.config.js
class MyPlugin {
  ...
}

module.exports = {
  ...
  ...
  plugins: [
    new MyPlugin()
  ]
}
```

将 `MyPlugin` 实例化对象配置到 `plugins` 属性，然后运行打包命令 `yarn build`，即可看到打包后文件的无用代码头注释被清除了。

## 总结

`webpack` 插件是通过在 `webpack` 生命周期的钩子上挂载任务函数从而实现扩展的。