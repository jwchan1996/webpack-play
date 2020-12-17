# webpack 快速上手

下面是一个基于 `webpack` 的项目的快速上手

## 初始化项目

```bash
yarn init --yes
```

## 安装依赖

```bash
yarn add webpack webpack-cli --dev
```

## 编写代码

在项目根目录新建 `index.html`，在 `src` 目录下新建 `index.js`  
在 `index.html` 中使用 `script` 标签引入 `index.js`

```javascript
// src/index.js

function log () {
  console.log('webpack 快速上手')
  console.log('默认约定打包入口与输出')
}

log()
```

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>01-quickly-start</title>
</head>
<body>
  <script src="./src/index.js"></script>
</body>
</html>
```

## 打包编译

`webpack` 4 之后的版本支持零配置启动打包，默认按照约定入口跟输出是 `src/index.js` `->` `dist/main.js`。

运行打包命令 `yarn webpack`，即可看到输出目录 `dist` 中的打包结果。

```javascript
// dist/main.js

console.log("webpack 快速上手"),console.log("默认约定打包入口与输出");
```