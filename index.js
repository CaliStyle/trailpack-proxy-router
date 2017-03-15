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

    if (!_.includes(_.keys(this.app.packs), 'proxy-engine')) {
      return Promise.reject(new Error('This Trailpack requires trailpack-proxy-engine!'))
    }

    if (!_.includes(_.keys(this.app.packs), 'proxy-generics')) {
      return Promise.reject(new Error('This Trailpack requires trailpack-proxy-generics!'))
    }

    if (!this.app.config.proxyRouter) {
      return Promise.reject(new Error('No configuration found at config.proxyRouter!'))
    }

    if (!this.app.config.proxyEngine) {
      return Promise.reject(new Error('No configuration found at config.proxyEngine!'))
    }

    if (!this.app.config.proxyGenerics) {
      return Promise.reject(new Error('No configuration found at config.proxyGenerics!'))
    }

    if (
      this.app.config.policies
      && this.app.config.policies['*']
      && this.app.config.policies['*'].indexOf('CheckPermissions.checkRoute') === -1
    ) {
      this.app.log.warn('ProxyRouter Routes are unlocked! add \'*\' : [\'CheckPermissions.checkRoute\'] to config/policies.js')
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
      lib.ProxyRouter.resolveGenerics(this.app),
      lib.ProxyRouter.copyDefaults(this.app),
      lib.ProxyRouter.addCrons(this.app),
      lib.ProxyRouter.addEvents(this.app),
      lib.ProxyRouter.addTasks(this.app)
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

