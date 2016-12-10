/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
const _ = require('lodash')
module.exports = {
  proxyRouter: function (req, res, next) {

    const RouterService = req.trailsApp.services.RouterService
    if (RouterService.isProxyRouteRequest(req)) {
      console.time('proxyRouter')
      RouterService.isCached(req)
        .then(route => {
          if (route) {
            console.timeEnd('proxyRouter')
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
        .then(proxyRouter => {
          req.proxyRouter = proxyRouter
          req.locals = _.defaults(req.locals, { proxyRouter: req.proxyRouter })

          console.timeEnd('proxyRouter')
          return next()
        })
        .catch((err) => {
          req.trailsApp.log.debug(err)
          console.timeEnd('proxyRouter')
          return next()
        })
    }
    else {
      req.proxyRouter = false
      next()
    }
  }
}
