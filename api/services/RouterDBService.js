/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const Service = require('trails-service')
const _ = require('lodash')
/**
 * @module RouterDBService
 * @description Binds Flat Files to Router Database
 */
module.exports = class RouterDBService extends Service {
  // TODO
  /**
   * build
   * @returns {Promise.<T>}
   */
  build() {
    return Promise.resolve()
  }
  /**
   * get
   * @param req
   * @returns {Promise.<{id: number, meta: {}, page: string}>}
   */
  get(req) {
    console.log('RouterDBService.get orginal:', req.originalUrl, 'base:', req.baseUrl)
    // const RouterService = this.app.services.RouterService
    // const FootprintService = this.app.services.FootprintService
    // return FootprintService.find('RouteDocument', id)
    return Promise.resolve({
      id: 1,
      meta: {},
      page: 'Hello World'
    })

  }

  /**
   * create
   * @param regPath
   * @param options
   * @returns {Route}
   */
  create(regPath, options) {
    const FootprintService = this.app.services.FootprintService
    return FootprintService.create('Route', {
      path: regPath
    })
  }

  /**
   * update
   * @param regPath
   * @param options
   * @returns {*|Progress|Object|Promise}
   */
  update(regPath, options){
    const FootprintService = this.app.services.FootprintService
    const update = {}
    _.each(options, (val, opt) => {
      update[opt] = val
    })
    return FootprintService.update('Route', { path: regPath }, update)
  }

  /**
   * destroy
   * @param regPath
   * @param options
   * @returns {*|Promise}
   */
  destroy(regPath, options){
    const FootprintService = this.app.services.FootprintService
    return FootprintService.destroy('Route', {
      path: regPath
    })
  }
  // TODO
  resolveDBFromFlatFileString(orgPath, options) {}
}
