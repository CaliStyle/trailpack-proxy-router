/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const _ = require('lodash')
const routes = require('./routes')
const policies = require('./policies')
const agenda = require('./agenda')

module.exports = {

  /**
   * init - Initialize
   * @param app
   */
  init: (app) => {
    // const proxyroute = app.services.ProxyRouteService.proxyroute
  },

  /**
   * addRoutes - Add the Proxy Router controller routes
   * @param app
   */
  addRoutes: (app) => {
    const prefix = _.get(app.config, 'proxyRouter.prefix') || _.get(app.config, 'footprints.prefix')
    const routerUtil = app.packs.router.util
    if (prefix){
      routes.forEach(route => {
        route.path = prefix + route.path
      })
    }
    app.config.routes = routerUtil.mergeRoutes(routes, app.config.routes)
    return Promise.resolve({})
  },

  /**
   * ignoreRoutes - Add ignored routes
   * @param app
   */
  ignoreRoutes: (app) => {
    app.config.proxyRouter.ignoreRoutes = []

    app.config.routes.forEach((route) => {
      // If the route is not a GET route
      if (route.method !== 'GET' && (_.isObject(route.method) && route.method.indexOf('GET') == -1)) {
        return
      }
      // If route has a config with ignore
      if (route.config && route.config.app && route.config.app.proxyrouter && route.config.app.proxyrouter.ingnore) {
        app.config.proxyRouter.ignoreRoutes.push(route.path)
      }
      return
    })
    app.config.proxyRouter.ignoreRoutes.reverse()
    return Promise.resolve({})
  },
  /**
   * alternateRoutes - Add alternate routes (routes that have dynamic params)
   * @param app
   */
  alternateRoutes: (app) => {
    app.config.proxyRouter.alternateRoutes = []

    app.config.routes.forEach((route) => {
      // If the route is not a GET route
      if (route.method !== 'GET' && (_.isObject(route.method) && route.method.indexOf('GET') == -1)) {
        return
      }
      // If route has a config with ignore
      if (route.path.indexOf(':') > -1 || route.path.indexOf('*') > -1) {
        app.config.proxyRouter.alternateRoutes.push(route.path)
      }
      return
    })
    app.config.proxyRouter.alternateRoutes.reverse()
    return Promise.resolve({})
  },
  /**
   *
   * @param app
   * @returns {Promise.<{}>}
   */
  addPolicies: (app) => {
    app.config.policies = _.merge(policies, app.config.policies)
    return Promise.resolve({})
  },
  /**
   *
   * @param app
   * @returns {Promise.<{}>}
   */
  addAgenda: (app) => {
    if (!app.config.proxyAgenda) {
      app.config.proxyAgenda = []
    }
    app.config.proxyAgenda = _.union(agenda, app.config.proxyAgenda)
    return Promise.resolve({})
  },
  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app) => {
    app.config.proxyRouterDefaults = _.clone(app.config.proxyRouter)
    return Promise.resolve({})
  }
}
