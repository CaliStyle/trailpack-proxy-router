/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const Service = require('trails-service')

/**
 * @module RouterService
 * @description Route Service
 */
module.exports = class RouterService extends Service {
  /**
   * isProxyRouteRequest
   * @param req
   * @returns {boolean} if url matches proxyroute pattern
   */
  isProxyRouteRequest(req) {
    // console.log(req)

    // transform the method to lowercase and check if Get Request
    if ( req.method.toLowerCase() != 'get') {
      this.app.log.silly('proxyroute:not GET request')
      return false
    }

    // If a Static asset
    if (/(?:\.([^.]+))?$/.test(req.originalUrl)) {
      this.app.log.debug('proxyroute:static assest')
      return false
    }
    // else return isProxyRouteRequest (true)
    return true
  }

  /**
   * resolveProxyRoute
   * @param req
   * @returns {Object} proxyroute
   */
  resolveProxyRoute(req) {
    if (this.app.config.proxyroute.forceFL) {
      return {
        id: 1,
        meta: {},
        page: 'Hello World'
      }
    }
    else {
      return {
        id: 1,
        meta: {},
        page: 'Hello World'
      }
    }
  }
}

