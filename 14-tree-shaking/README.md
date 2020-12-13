# webpack 优化配置之 Tree-shaking

`webpack` 中支持 `tree-shaking`，在生产模式下会将未引用代码（`dead-code`）剔除掉，不参与代码打包。

`tree-shaking` 不是指 `webpack` 中的某一个配置选项，而是一组功能搭配使用后的优化效果，这组功能会在 `production` 模式下自动启用，下面介绍 `tree-shaking` 在其他模式下怎么一步一步地开启。

以这个项目为例：

```javascript
// src/component.js
export const Button = () => {
  return document.createElement('button')

  // 无用代码
  console.log('dead-code')
}

// 无用代码，没有被导入
export const Link = () => {
  return document.createElement('a')
}

// 无用代码，没有被导入
export const Heading = level => {
  return document.createElement('h' + level)
}
```

```javascript
// src/index.js
import { Button } from './components'
// 这里只导入了 Button 函数
document.body.appendChild(Button())
```

直接使用 `none` 模式执行打包命令 `yarn webpack`，可以看到打包结果中这些没用到的成员 `Link` 和 `Heading` 依然被打包导出了。

![image.png](https://i.loli.net/2020/11/27/DVGe1Tk6QulKg5F.png)

设置 `webpack` 配置文件的 `optimization` 属性，这个属性是集中配置 `webpack` 中的优化功能的。首先配置 `optimization` 的 `usedExports` 功能，表示只导出被外部使用了的成员。

```javascript
optimization: {
  // 模块只导出被使用的成员
  usedExports: true,
}
```

重新打包后可以发现，没有被外部引用的成员 `Link` 和 `Heading` 就没有被导出了。

![image.png](https://i.loli.net/2020/11/27/x2Q59HjglUd1uYy.png)

接下来就可以开启代码压缩功能，去掉无用的代码被压缩有用的代码。配置 `optimization` 中的 `minimize` 属性，开启压缩功能。

```javascript
optimization: {
  // 模块只导出被使用的成员
  usedExports: true,
  // 压缩输出结果
  minimize: true
}
```

重新打包发现，没用到的代码全被移除掉了。

![image.png](https://i.loli.net/2020/11/27/1KjClBZMkY6rthO.png)

还可以使用 `concatenateModules` 属性继续优化输出。普通打包结果是将每一个模块单独放到一个函数当中，如果我们的模块很多，就会出现很多这样的模块函数。开启 `concatenateModules` 功能可以尽可能地将所有模块合并输出到一个函数中。

配置：

```javascript
optimization: {
  // 模块只导出被使用的成员
  usedExports: true,
  // 尽可能合并所有模块到一个函数中
  concatenateModules: true,
  // 压缩输出结果
  minimize: true
}
```

打包后：

```javascript
// dist/bundle.js
(()=>{"use strict";document.body.appendChild(document.createElement("button"))})();
```

**总结**：`optimization` 对象中的 `usedExports` 负责标记【枯树叶】，`minimize` 负责【摇掉】它们，`concatenateModules` 能合并所有模块到一个函数中。