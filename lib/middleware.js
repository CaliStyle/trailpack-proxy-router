/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
const _ = require('lodash')
module.exports = {
  proxyroute: function (req, res, next) {

    const RouterService = req.trailsApp.services.RouterService
    if (RouterService.isProxyRouteRequest(req)) {
      console.time('proxyrouter')
      RouterService.isCached(req)
        .then(route => {
          if (route) {
            console.timeEnd('proxyrouter')
            return next()
          }
          else {
            return RouterService.setPreReqRoute(req)
          }
        })
        .then(route => {
          req.route = route
          return RouterService.resolveProxyRoute(req)
        })
        .then(proxyrouter => {
          req.proxyrouter = proxyrouter
          req.locals = _.defaults(req.locals, { proxyrouter: req.proxyrouter })

          console.timeEnd('proxyrouter')
          return next()
        })
        .catch((err) => {
          req.trailsApp.log.debug(err)
          console.timeEnd('proxyrouter')
          return next()
        })
    }
    else {
      req.proxyroute = false
      next()
    }
  }
}
