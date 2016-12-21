/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
const _ = require('lodash')
module.exports = {
  proxyRouter: function (req, res, next) {

    const RouterService = req.trailsApp.services.RouterService
    if (RouterService.isProxyRouterRequest(req)) {
      const t0 = process.hrtime()
      RouterService.isCached(req)
        .then(route => {
          if (route) {
            const t1 = process.hrtime(t0)
            const t = t1[1] / 1e6
            req.trailsApp.log.debug(`proxyRouter.render ${t}ms`)
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

          const t1 = process.hrtime(t0)
          const t = t1[1] / 1e6
          req.trailsApp.log.debug(`proxyRouter.render ${t}ms`)
          return next()
        })
        .catch((err) => {
          const t1 = process.hrtime(t0)
          const t = t1[1] / 1e6
          req.trailsApp.log.debug(`proxyRouter.render ${t}ms`)
          req.trailsApp.log.debug(err)
          req.proxyRouter = false
          return next()
        })
    }
    else {
      req.proxyRouter = false
      next()
    }
  }
}
