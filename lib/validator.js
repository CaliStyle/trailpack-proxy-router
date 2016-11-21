/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const joi = require('joi')
const lib = require('.')

module.exports = {
  validateDatabaseConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, lib.Schemas.databaseConfig, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  validateProxyrouteConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, lib.Schemas.proxyrouteConfig, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  validateMiddleware (middlewares) {
    return new Promise((resolve, reject) => {
      // console.log(middlewares.order)
      joi.validate(middlewares, lib.Schemas.proxyrouteMiddleware, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  // Validate a Page
  validatePageData (data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, lib.Schemas.pageData, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  validatePageRemoveData (data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, lib.Schemas.pageRemoveData, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  // Validate a Series
  validateSeriesData (data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, lib.Schemas.seriesData, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  validateSeriesRemoveData (data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, lib.Schemas.seriesRemoveData, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  // Validate a Run
  validateAddRunData (data) {
    return new Promise((resolve, reject) => {
      // console.log(middlewares.order)
      joi.validate(data, lib.Schemas.addRun, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  // Validate a Control
  validateControlData (data) {
    return new Promise((resolve, reject) => {
      // console.log(middlewares.order)
      joi.validate(data, lib.Schemas.controlData, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  }
}
