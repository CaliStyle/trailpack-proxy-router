'use strict'
// const _ = require('lodash')

module.exports = class extends Error {
  constructor(error) {
    super(error)

    error.name = ''
    this.name = error.toString()
    this.error = 'Conflict'
    this.statusCode = '409'
  }
}