'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')

module.exports = class RouterTrailpack extends Trailpack {

  /**
   * TODO document method
   */
  validate () {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack only works for express!'))
    }

    if (!this.app.config.proxyrouter) {
      return Promise.reject(new Error('No configuration found at config.stripe!'))
    }
  }

  /**
   * TODO document method
   */
  configure () {

  }

  /**
   * TODO document method
   */
  initialize () {
    lib.ProxyRoute.init(this.app)
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

