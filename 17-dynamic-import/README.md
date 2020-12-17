# webpack 优化配置之 Code Splitting 动态导入

所有模块打包在一起，会导致 `bundle` 文件体积过大。而实际上应用在开始工作时，并不是每个模块在启动时都是必须要加载进来的。更合理的做法是将代码通过合理的规则拆分成多个 `bundle`，根据应用的运行需要进行按需加载这些模块，这样可以大大提高应用的响应速度与运行效率。

`webpack` 实现分包的方式有两种：

- 多入口打包
- 动态导入

下面来看一下如何配置动态导入。

所谓动态导入，也就是按需加载的方式。`webpack` 支持动态导入的方式实现按需加载，所有动态导入的模块都会被自动分包。

相比于多入口的方式，动态导入方式更加灵活，因为可以通过代码逻辑去控制需不需要加载某个模块，或者什么时候加载。按照 `ES Modules` 动态导入的方式调用方法，`webpack` 在打包的时候会自动按照动态导入的方式进行模块分包和按需加载。下面分别对比非动态导入方式与动态导入方式的写法与打包结果。

![image.png](https://i.loli.net/2020/11/28/cdO3Qs4LbYfMjSk.png)

非动态导入方式以及打包结果：

```javascript
// src/index.js
import posts from './posts/posts'
import album from './album/album'

const render = () => {
  const hash = window.location.hash || '#posts'

  const mainElement = document.querySelector('.main')

  mainElement.innerHTML = ''

  if (hash === '#posts') {
    mainElement.appendChild(posts())
  } else if (hash === '#album') {
    mainElement.appendChild(album())
  }
}

render()

window.addEventListener('hashchange', render)
```

```bash
# 打包结果 
├── dist
│   ├── index.html
│   └── main.bundle.js  # 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称
```

动态导入方式以及打包结果：

```diff
- import posts from './posts/posts'
- import album from './album/album'

  const render = () => {
    const hash = window.location.hash || '#posts'

    const mainElement = document.querySelector('.main')

    mainElement.innerHTML = ''

    if (hash === '#posts') {
-     mainElement.appendChild(posts())
+     import('./posts/posts').then(({ default: posts }) => {
+       mainElement.appendChild(posts())
+     })
    } else if (hash === '#album') {
-     mainElement.appendChild(album())
+     import('./album/album').then(({ default: album }) => {
+       mainElement.appendChild(album())
+     })
    }
  }

  render()

  window.addEventListener('hashchange', render)
```

```bash
# 打包结果 
├── dist
│   ├── 1.bundle.js
│   ├── 2.bundle.js
│   ├── index.html
│   └── main.bundle.js  # 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称
```

如果使用的是单页面开发框架 `vue` 和 `react`，项目中的路由映射组件就可以实现这种动态导入按需引用的加载方式。

从打包结果可以发现，通过动态导入的方式导入的模块打包后的文件名就是一个序号，如果需要给这些文件命名的话，可以使用 `webpack` 特有的魔法注释来实现。具体就是在调用 `import` 方法的参数位置添加一个行内注释。

特定的格式：

```javascript
/* webpackChunkName: posts */
```

添加行内注释：

```diff
  const render = () => {
    const hash = window.location.hash || '#posts'

    const mainElement = document.querySelector('.main')

    mainElement.innerHTML = ''

    if (hash === '#posts') {
-     import('./posts/posts').then(({ default: posts }) => {
+     import(/* webpackChunkName: 'posts' */'./posts/posts').then(({ default: posts }) => {
+       mainElement.appendChild(posts())
+     })
    } else if (hash === '#album') {
-     import('./album/album').then(({ default: album }) => {
+     import(/* webpackChunkName: 'album' */'./album/album').then(({ default: album }) => {
+       mainElement.appendChild(album())
+     })
    }
  }

  render()

  window.addEventListener('hashchange', render)
```

```bash
# 打包结果 
├── dist
│   ├── album.bundle.js # 通过行内注释指定 album 名称生成文件名
│   ├── index.html
│   ├── main.bundle.js  # 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称
│   └── posts.bundle.js # 通过行内注释指定 posts 名称生成文件名
```

如果两个模块的魔法注释名字一样，那么这两个模块会被打包合并在一起。比如都是 `/* webpackChunkName: 'components' */`，则打包出来是：

```bash
# 打包结果 
├── dist
│   ├── components.bundle.js # 通过行内注释指定 components 名称生成文件名
│   ├── index.html 
│   └── main.bundle.js # 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称
```