'use strict'

const Service = require('trails-service')

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
   * @returns {Promise.<{id: number, meta: {}, page: string}>}
   */
  get() {
    return Promise.resolve({
      id: 1,
      meta: {},
      page: 'Hello World'
    })
  }

  /**
   * create
   * @param pagePath
   * @param options
   * @returns {Route}
   */
  create(pagePath, options) {
    const FootprintService = this.app.services.FootprintService
    return FootprintService.create('Route', {
      path: pagePath
    })
  }
  update(pagePath, options){

  }
  destroy(pagePath, options){
    const FootprintService = this.app.services.FootprintService
    return FootprintService.destroy('Route', {
      path: pagePath
    })
  }
}
