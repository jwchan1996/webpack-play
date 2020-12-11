# 学会 webpack 从零到一系列

现阶段以 `webpack 4.x` 的特性与周边工具库进行实践，`webpack 5`由于部分特性改动以及周边工具库更新速度未跟得上暂时不做深入的实践。

## 系列文章

- [快速上手](/01-quickly-start/)  
- [配置文件](/02-configuration/)  
- [资源模块加载](/03-asset-load/)  
- [处理 ES6 代码](/04-babel-loader/)  
- [Loader 加载器机制](/05-loader-theory/)  
- [webpack 常用插件](/06-generally-used-plugins/)  
- [Plugin 插件机制](/07-plugin-theory/)  
- [webpack-dev-server](/08-webpack-dev-server/)  
- [HMR 模块热更新](/09-webpack-hmr/)  

> 以此仓库记录 webpack 的使用与原理

## webpack 5 需要注意的事项

`webpack 5` 默认打包生成的组织代码中包含了现代化浏览器所支持的 `const` 与箭头函数，而默认的 `target: 'web'` 属性在 `webpack 4` 下转换组织代码格式为 `es5`，如果需要 `webpack 5` 打包输出的组织代码也为 `es5`，需要配置 `target` 属性值为 `es5`。

```javascript
{
  target: 'es5'
}
```

![image.png](https://s3.ax1x.com/2020/12/05/DqW7c9.png)