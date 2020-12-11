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

  module.hot.accept('./bg.png', () => {
    img.src = background
    console.log(background)
  })
}
