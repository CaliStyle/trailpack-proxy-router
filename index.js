'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
const lib = require('./lib')

module.exports = class ProxyRouterTrailpack extends Trailpack {

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

    if (!this.app.config.proxyRouter) {
      return Promise.reject(new Error('No configuration found at config.proxyRouter!'))
    }

    return Promise.all([
      lib.Validator.validateDatabaseConfig(this.app.config.database),
      lib.Validator.validateProxyRouterConfig(this.app.config.proxyRouter),
      lib.Validator.validateMiddleware(this.app.config.web.middlewares)
    ])
  }

  /**
   * TODO document method
   */
  configure () {
    return Promise.all([
      lib.ProxyRouter.addRoutes(this.app),
      lib.ProxyRouter.ignoreRoutes(this.app),
      lib.ProxyRouter.alternateRoutes(this.app),
      lib.ProxyRouter.addPolicies(this.app),
      lib.ProxyRouter.addAgenda(this.app),
      lib.ProxyRouter.resolveGenerics(this.app),
      lib.ProxyRouter.copyDefaults(this.app)
    ])
  }

  /**
   * TODO document method
   */
  initialize () {
    // return Promise.all([
    lib.ProxyRouter.init(this.app)

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

