/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const _ = require('lodash')
const routes = require('./routes')
const policies = require('./policies')

module.exports = {

  /**
   * init - Initialize
   * @param app
   */
  init: (app) => {
    if (!app.proxyRouter) {
      app.proxyRouter = {}
    }
    if (app.config.proxyRouter.forceFL) {
      app.services.RouterSitemapService.initFL()
    }
    else {
      // TODO sitemap DB
    }
    return Promise.resolve({})
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
      if (route.config && route.config.app && route.config.app.proxyRouter && route.config.app.proxyRouter.ingnore) {
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
   * resolveGenerics - adds default generics if missing from configuration
   * @param app
   * @returns {Promise.<{}>}
   */
  resolveGenerics: (app) => {
    if (!app.config.proxyGenerics) {
      app.config.proxyGenerics = {}
    }
    if (!app.config.proxyGenerics.render_service) {
      app.config.proxyGenerics.render_service = {
        adapter: require('proxy-generics-render'),
        options: {
          // Must always be set to true
          html: true
        },
        plugins: [
          // Example Plugin (markdownit-meta is required and already installed)
          // {
          //   plugin: require('markdownit-meta'),
          //   options: {}
          // }
        ]
      }
    }
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
  },
  /**
   * add Cron Jobs to Proxy Engine
   * @param app
   * @returns {Promise.<{}>}
   */
  addCrons: (app) => {
    if (!app.api.crons) {
      app.api.crons  = {}
    }
    return Promise.resolve({})
  },
  /**
   * add Events to Proxy Engine
   * @param app
   * @returns {Promise.<{}>}
   */
  addEvents: (app) => {
    if (!app.api.events) {
      app.api.events  = {}
    }
    return Promise.resolve({})
  },
  /**
   * add Tasks to Proxy Engine
   * @param app
   * @returns {Promise.<{}>}
   */
  addTasks: (app) => {
    if (!app.api.tasks) {
      app.api.tasks  = {}
    }
    return Promise.resolve({})
  }
}
