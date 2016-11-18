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
   * flatfileProxyRoute
   * @param req
   * @returns {Object} proxyroute
   */
  // TODO
  flatfileProxyRoute(req) {
    return {
      id: 1,
      meta: {},
      page: 'Hello World'
    }
  }

  /**
   * databaseProxyRoute
   * @param req
   * @returns {Object} proxyroute
   */
  // TODO
  databaseProxyRoute(req) {
    return {
      id: 1,
      meta: {},
      page: 'Hello World'
    }
  }

  /**
   * resolveProxyRoute
   * @param req
   * @returns {Object} proxyroute
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
    return Promise.resolve(data)
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

