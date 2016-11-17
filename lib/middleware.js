/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'
module.exports = {
  proxyroute: function (req, res, next) {

    const RouterService = req.trailsApp.services.RouterService

    if (!RouterService.isProxyRouteRequest(req)) {
      req.proxyroute = 'hello world'
    }
    next()
  }
}
