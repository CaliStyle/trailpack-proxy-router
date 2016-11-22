/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const Service = require('trails-service')
// const _ = require('lodash')

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
    // transform the method to lowercase and check if Get Request, if not, skip
    if ( req.method.toLowerCase() !== 'get') {
      this.app.log.silly('proxyroute:not GET request')
      return false
    }

    // TODO If a Static asset then skip
    // if (/(?:\.([^.]+))?$/.test(req.originalUrl)) {
    //   this.app.log.debug('proxyroute:static assest')
    //   return false
    // }
    // console.log(/(?:\.([^.]+))?$/.test(req.originalUrl))

    // Check if this has an explicit ignore
    const pathToRegexp = require('path-to-regexp')
    let ignore = false
    this.app.config.proxyroute.ignoreRoutes.forEach((route) => {
      // If another catchall route already ignored, break immediately
      if (ignore) {
        return
      }
      // If route has a config with ignore
      const re = pathToRegexp(route, [])
      if (re.exec(req.originalUrl)) {
        ignore = true
        return
      }
    })
    // If this route is ignored.
    if (ignore) {
      return false
    }

    // else return isProxyRouteRequest (true)
    return true
  }
  // TODO
  pickSeries() {

  }
  /**
   * flatfileProxyRoute
   * @param req
   * @returns {Object} proxyroute
   */
  // TODO
  flatfileProxyRoute(req) {
    const RouterFLService = this.app.services.RouterFLService
    return RouterFLService.get(req)
  }

  /**
   * databaseProxyRoute
   * @param req
   * @returns {Promise.<proxyroute>}
   */
  // TODO
  databaseProxyRoute(req) {
    const RouterDBService = this.app.services.RouterDBService
    return RouterDBService.get(req)
  }

  /**
   * resolveProxyRoute
   * @param req
   * @returns {Promise.<proxyroute>}
   */
  resolveProxyRoute(req) {
    if (this.app.config.proxyroute.forceFL) {
      return this.flatfileProxyRoute(req)
    }
    else {
      return this.databaseProxyRoute(req)
    }
  }

  /**
   * addPage
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  addPage(data) {
    return new Promise((resolve, reject) => {
      if (this.app.config.proxyroute.forceFL) {
        return resolve(data)
      }
      return resolve(data)
    })
  }
  /**
   * updatePage
   * @param data
   * @returns {Object} proxyroute
   */
  // TODO
  updatePage(data) {
    return Promise.resolve(data)
  }
  /**
   * removePage
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  removePage(data) {
    return Promise.resolve(data)
  }

  /**
   * addSeries
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  addSeries(data) {
    return Promise.resolve(data)
  }

  /**
   * updateSeries
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  updateSeries(data) {
    return Promise.resolve(data)
  }

  /**
   * removeSeries
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  removeSeries(data) {
    return Promise.resolve(data)
  }
}

