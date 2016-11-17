'use strict'

const Service = require('trails-service')
const lib = require('../../lib')
/**
 * @module RouterControlsService
 * @description Positive and Negative Controls as a Service
 */
module.exports = class RouterControlsService extends Service {
  /**
   * addRun
   * @param data
   * @returns {Promise.<T>}
   */
  addRun(data){
    return lib.Validator.validateAddRunData(data)
      .then((values) => {

      })
  }
  /**
   * positive
   * @param data
   *    @param {String} data.state
   *    @param {String} data.demographic
   *    @param {Object} data.payload
   * @returns {Promise.<T>}
   */
  positive(data){
    return lib.Validator.validatePositiveData(data)
      .then((values) => {

      })
  }

  /**
   * negative
   * @param data
   *    @param {String} data.state
   *    @param {String} data.demographic
   *    @param {Object} data.payload
   * @returns {Promise.<T>}
   */
  negative(data){

    return lib.Validator.validateNegativeData(data)
      .then((values) => {

      })
  }
}

