import './main.css'

import createHeading from './heading.js'

import png from './cat.png'
import gif from './eat.gif'

import footerHtml from './footer.html'

const img1 = new Image()
img1.src = png
const img2 = new Image()
img2.src = gif

const heading = createHeading()

document.body.append(img1)
document.body.append(img2)

document.body.append(heading)

document.write(footerHtml)