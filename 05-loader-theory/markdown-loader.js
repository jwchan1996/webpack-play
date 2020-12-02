const marked = require('marked')

module.exports = source => {
  const html = marked(source)
  return `module.exports = ${JSON.stringify(html)}`
}

// module.exports = source => {
//   const html = marked(source)
//   return html
// }