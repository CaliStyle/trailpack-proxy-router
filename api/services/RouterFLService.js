/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const Service = require('trails-service')

/**
 * @module RouterFLService
 * @description Binds Router Database to Flat Files
 */
module.exports = class RouterFLService extends Service {
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
   * @returns {Promise.<{id: number, meta: object, page: string}>}
   */
  get(req) {
    console.log('orginal: ', req.originalUrl, 'base: ', req.baseUrl)

    return Promise.resolve({
      id: 1,
      meta: {},
      page: 'Hello World'
    })
  }
}

