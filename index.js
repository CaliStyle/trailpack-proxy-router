'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
const lib = require('./lib')

module.exports = class RouterTrailpack extends Trailpack {

  /**
   * TODO document method
   */
  validate () {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack only works for express!'))
    }

    if (!_.includes(_.keys(this.app.packs), 'sequelize')) {
      return Promise.reject(new Error('This Trailpack only works for Sequelize!'))
    }

    if (!this.app.config.proxyrouter) {
      return Promise.reject(new Error('No configuration found at config.proxyrouter!'))
    }

    return Promise.all([
      lib.Validator.validateDatabaseConfig(this.app.config.database),
      lib.Validator.validateProxyrouteConfig(this.app.config.proxyroute),
      lib.Validator.validateMiddleware(this.app.config.web.middlewares)
    ])
  }

  /**
   * TODO document method
   */
  configure () {
    return Promise.all([
      lib.ProxyRoute.addRoutes(this.app),
      lib.ProxyRoute.ignoreRoutes(this.app),
      lib.ProxyRoute.alternateRoutes(this.app)
    ])
  }

  /**
   * TODO document method
   */
  initialize () {
    // return Promise.all([
    lib.ProxyRoute.init(this.app)

    // ])
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

