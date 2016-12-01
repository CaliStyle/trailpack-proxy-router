/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
const _ = require('lodash')
module.exports = {
  proxyroute: function (req, res, next) {

    const RouterService = req.trailsApp.services.RouterService
    if (RouterService.isProxyRouteRequest(req)) {
      console.time('proxyroute')
      RouterService.isCached(req)
        .then(route => {
          if (route) {
            console.timeEnd('proxyroute')
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
        .then(proxyroute => {
          req.proxyroute = proxyroute
          req.locals = _.defaults(req.locals, { proxyroute: req.proxyroute })

          console.timeEnd('proxyroute')
          return next()
        })
        .catch((err) => {
          req.trailsApp.log.debug(err)
          console.timeEnd('proxyroute')
          return next()
        })
    }
    else {
      req.proxyroute = false
      next()
    }
  }
}
