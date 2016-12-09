'use strict'

const Service = require('trails/service')
const lib = require('../../lib')
/**
 * @module RouterControlsService
 * @description Positive and Negative Controls as a Service
 */
module.exports = class RouterControlsService extends Service {
  /**
   * addRun increments the run on a Route Document
   * @param data
   * @returns {Promise.<{}>}
   */
  // TODO
  addRun(data){
    return lib.Validator.validateAddRunData(data)
      .then((values) => {
        return data
      })
  }
  /**
   * positive
   * @param data increments a positive score on a Route Document
   *    @param {String} data.state
   *    @param {String} data.demographic
   *    @param {Object} data.payload
   * @returns {Promise.<{data: string, demographic: string, payload: {}}>}
   */
  // TODO
  positive(data){
    return lib.Validator.validateControlData(data)
      .then((values) => {
        return data
      })
  }

  /**
   * negative
   * @param data increments a negative score on a Route Document
   *    @param {String} data.state
   *    @param {String} data.demographic
   *    @param {Object} data.payload
   * @returns {Promise.<{data: string, demographic: string, payload: {}}>}
   */
  // TODO
  negative(data){
    return lib.Validator.validateControlData(data)
      .then((values) => {
        return data
      })
  }
}

