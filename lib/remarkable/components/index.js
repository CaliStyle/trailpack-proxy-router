/* eslint no-console: [0] */
'use strict'

const _ = require('lodash')

function ComponentsPlugin(md, options) {
  const opts = _.defaults(options, {})
  md.core.ruler.push('html-components', parser(md, opts), {alt: []})
}

function parser(md, options) {
  return function(state) {
    const tokens = state.tokens
    const len = tokens.length
    let i = -1
    while (++i < len) {
      const token = tokens[i]
      console.log(token)
      _.each(token.children, child => {
        const exp = new RegExp('(<([^>]+)>)','gi')
        if (exp.test(child.content)) {
          child.type = 'htmltag'
        }
      })
    }
  }
}
module.exports = ComponentsPlugin
