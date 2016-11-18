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
  validatePageData (data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, lib.Schemas.page, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  validateSeriesData (data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, lib.Schemas.series, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
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
  validatePositiveData (data) {
    return new Promise((resolve, reject) => {
      // console.log(middlewares.order)
      joi.validate(data, lib.Schemas.positive, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  },
  validateNegativeData (data) {
    return new Promise((resolve, reject) => {
      // console.log(middlewares.order)
      joi.validate(data, lib.Schemas.negative, (err, value) => {
        if (err) {
          return reject(err)
        }
        return resolve(value)
      })
    })
  }
}
