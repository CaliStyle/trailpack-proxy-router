/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
const _ = require('lodash')
module.exports = {
  proxyRouter: function (req, res, next) {

    const RouterService = req.trailsApp.services.RouterService
    if (RouterService.isProxyRouterRequest(req)) {
      // Time Event
      const t0 = process.hrtime()
      let t1
      let t
      // Check cache
      RouterService.isCached(req)
        .then(route => {
          if (route) {
            // console.log('HERE?', route)
            // set request proxyRouter attribute
            req.proxyRouter = route
            req.locals = _.defaults(req.locals, { proxyRouter: req.proxyRouter })

            // Log Time
            t1 = process.hrtime(t0)
            t = t1[1] / 1e6
            req.trailsApp.log.debug(`proxyRouter.render ${t}ms`)
            // Continue to next middleware
            return next()
          }
          else {
            // Otherwise set the prerequisites for the route
            return RouterService.setPreReqRoute(req)
          }
        })
        .then(route => {
          if (!route) {
            return
          }
          // Set req.route
          req.route = route
          // Resolve the route
          return RouterService.resolveProxyRoute(req)
        })
        .then(proxyRouter => {
          if (!proxyRouter) {
            return
          }
          // set request proxyRouter attribute
          req.proxyRouter = proxyRouter
          // set the locals (used in ejs and other template engines)
          req.locals = _.defaults(req.locals, { proxyRouter: req.proxyRouter })
          // Log Time
          t1 = process.hrtime(t0)
          t = t1[1] / 1e6
          req.trailsApp.log.debug(`proxyRouter.render ${t}ms`)
          return next()
        })
        .catch((err) => {
          // Log Time
          t1 = process.hrtime(t0)
          t = t1[1] / 1e6
          req.trailsApp.log.debug(`proxyRouter.render ${t}ms`)
          req.trailsApp.log.debug(err)
          // set the request attribute to false
          req.proxyRouter = false
          // Continue to next middleware
          return next()
        })
    }
    else {
      // Otherwise, set the request attribute to false
      req.proxyRouter = false
      next()
    }
  }
}
