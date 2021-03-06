'use strict'
const _ = require('lodash')
const Policy = require('trails/policy')

/**
 * @module ProxyRouterPolicy
 * @description Proxy Router Add proxyRouter
 */
module.exports = class ProxyRouterPolicy extends Policy {
  proxyRouter(req, res, next) {
    const RouterService = this.app.services.RouterService
    if (RouterService.isProxyRouterRequest(req)) {
      // Time Event
      const t0 = process.hrtime()
      let t1
      let t
      // Check cache
      RouterService.isCached(req)
        .then(route => {
          if (route) {
            // Log Time
            t1 = process.hrtime(t0)
            t = t1[1] / 1e6
            this.app.log.debug(`proxyRouter.render ${t}ms`)
            // Continue to next middleware
            return next()
          }
          else {
            return
          }
        })
        .then(route => {
          // Set req.route
          req.route = route
          // Resolve the route
          return RouterService.resolveProxyRoute(req)
        })
        .then(proxyRouter => {
          // set request proxyRouter attribute
          req.proxyRouter = proxyRouter
          // set the locals (used in ejs and other template engines)
          req.locals = _.defaults(req.locals, { proxyRouter: req.proxyRouter })
          // Log Time
          t1 = process.hrtime(t0)
          t = t1[1] / 1e6
          this.app.log.debug(`proxyRouter.render ${t}ms`)
          return next()
        })
        .catch((err) => {
          // Log Time
          t1 = process.hrtime(t0)
          t = t1[1] / 1e6
          this.app.log.debug(`proxyRouter.render ${t}ms`)
          this.app.log.debug(err)
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

