# 使用 Source Map 提高开发效率

## 什么是 Source Map

打包编译后的代码与开发时候的代码有很大的差异，如果需要调试应用，或者应用出现错误，将很难定位错误。因为此时调试和报错都是基于转换过后的代码，`Sourse Map` （源代码地图）就是解决这种问题的。

![image.png](https://i.loli.net/2020/11/26/QEwyg38CR71mMeP.png)

很多第三方库都有 `Source Map` 文件。一般会以注释的方式引入 `Source Map` 文件，在最新版的 `jQuery` 里去除了 `Source map` 的注释，这里我们可以手动将 `Source Map` 引入进来。在加载到 `jquery-3.4.1.min.js` 文件的时候，控制台调试器会根据 `Source Map` 注释自动加载 `Source map` 文件，根据 `Source Map` 内容逆向解析出对应的源代码，以便于我们的代码调试。因为有了映射关系，出现错误就很容易定位源代码位置。

![image.png](https://i.loli.net/2020/11/26/ULIeFOWJVdvBT61.png)

**总结**：`Source Map` 的作用就是解决了前端引入了自动构建方式所导致的源代码与运行代码不一致产生的问题。

## 配置 Source Map

`webpack` 提供了多种 `Source Map` 类型的配置。

![image.png](https://i.loli.net/2020/11/26/sQAo62I5badixOl.png)

打包后：

![image.png](https://i.loli.net/2020/11/26/U2R561gcNbdCXTu.png)

可以看到打包后的 `bundle` 文件自动添加了 `Source Map` 的注释。运行代码时，根据控制台错误信息就可以直接定位到源代码。

![image.png](https://i.loli.net/2020/11/26/VFj7XJ5Kl81WqTd.png)

`webpack` 还支持多种 `Source Map` 模式。

![image.png](https://i.loli.net/2020/11/26/7TsLVRtEcxwWXqb.png)

## eval 模式的 Source map

`eval` 是 `js` 的一个函数，可以用来运行字符串中 `js` 代码。

```javascript
eval('console.log(123)')    // 123
```

在控制台中运行这段代码，默认会运行在虚拟机环境中。

![image.png](https://i.loli.net/2020/11/26/GfTtaAKUx1whm5S.png)

我们可以通过 `sourceURL` 声明这段代码所属的文件路径。

```javascript
eval('console.log(123)  //# sourceURL=./foo/bar.js')    // 123
```

![image.png](https://i.loli.net/2020/11/26/NuRsAOdJxVwC3ID.png)

这时候所声明的这段代码的运行环境就是 `./foo/bar.js`，这就意味着我们可以通过 `sourceURL` 改变 `eval` 执行的这段代码的所属环境的名称，其实依然是运行在虚拟机环境，只不过是告诉了 `js` 引擎这段代码执行的路径名称，只是一个标识。下面将 `devtool` 属性设置为 `"eval"`：

![image.png](https://i.loli.net/2020/11/26/SmIHd48YVcBuXtq.png)

打包后：

根据控制台提示可以找到错误出现的文件，打开文件会发现这是打包转换过后的代码。因为这种模式下 `webpack` 会把所有打包的模块代码放到 `eval` 函数去执行，并且通过 `eval` 函数所传入字符串的最后用 `sourceURL` 方式去说明对应的文件路径。

![image.png](https://i.loli.net/2020/11/26/V4a1swXdfegvxUO.png)
![image.png](https://i.loli.net/2020/11/26/PYfa8hb9lXZE4Sv.png)

`eval` 模式下不会生成 `Source Map` 文件，出现错误时可以根据 `sourceURL` 在控制台定位出错的文件，但仅仅只是定位到文件。因为 `eval` 模式不需要生成 `Source Map` 文件，所以构建速度是最快的。

## devtool 模式对比

不同的 `devtool` 模式有不同的差异，下面对这些不同的方式进行横向对比。

![image.png](https://i.loli.net/2020/11/26/rMvbf8gnJ96omsy.png)

`webpack.config.js` 文件可以导出一个对象或数组。

![image.png](https://i.loli.net/2020/11/26/UvGNTiHulxFwBfR.png)

运行打包命令后，会根据不同模式打包出不同的文件。

![image.png](https://i.loli.net/2020/11/26/FZRonIXTCLp5sWw.png)

使用开发服务器把 `dist` 目录运行起来。

关于开发服务器可以使用 `browser-sync` 也可以使用 `serve`，这里使用 `serve`。

```bash
yarn add global serve
```
```bash
serve dist
```

![image.png](https://i.loli.net/2020/11/26/ygnkuVFWLHPlTxc.png)

- eval
- eval-source-map
- cheap-eval-source-map
- cheap-module-eval-source-map
- cheap-source-map
- inline-source-map
- hidden-source-map
- nosources-source-map

**注意**：webpack 5 对 devtool 属性值更为严格，规定了一定的顺序。

![image.png](https://s3.ax1x.com/2020/12/11/rAMA4e.png)

由模式的命名特点可以总结：

```bash
eval -> 是否使用 eval 执行模块代码
cheap -> Source Map 是否只包含行信息
module -> 是否能够得到 Loader 处理之前的源代码
```

## 选择 Source Map 模式

理解不同模式的区别，选择适合的 `Source Map`。开发模式下使用 `cheap-module-eval-source-map`，生产模式下使用 `none`。

> 最新的 webpack 5 对 devtool 格式更严格，webpack 5 开发模式下的 devtool 模式应该是 eval-cheap-module-source-map。