/* eslint no-console: [0] */
'use strict'

function components(str, options) {
  const exp = new RegExp('(<([^>]+)>)','gi')
  if (exp.test(str)) {
    console.log('HTML!', str)
    return `${str}`
  }
  else {
    return str
  }

}
module.exports = components

// module.exports = function (md) {
//   return components.bind(null, md)
// }
//
// function get(state, line) {
//   const pos = state.bMarks[line]
//   const max = state.eMarks[line]
//   return state.src.substr(pos, max - pos)
// }
//
// function components(md, state, start, end) {
//   console.log('YES?', start, state.blkIndent)
//   // if (start !== 0 || state.blkIndent !== 0) {
//   // if (state.blkIndent !== 0) {
//   //   return false
//   // }
//   // console.log('YES2?')
//   // if (state.tShift[start] < 0) {
//   //   return false
//   // }
//
//   const data = []
//   let line = start
//   while (line < end) {
//     line++
//     const str = get(state, line)
//     // if (str.match(/^---$/)) {
//     //   break
//     // }
//     if (state.tShift[line] < 0) {
//       break
//     }
//     console.log(str)
//     data.push(str)
//   }
//
//   state.line = line + 1
//   return true
// }


