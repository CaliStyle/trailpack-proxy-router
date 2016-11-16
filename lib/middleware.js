/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
module.exports = {
  proxyroute: function (req, res, next) {
    // console.log(req)
    next()
  }
}
