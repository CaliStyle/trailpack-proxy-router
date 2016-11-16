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
  }
}
