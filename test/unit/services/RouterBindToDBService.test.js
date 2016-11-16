'use strict'
/* global describe, it */
const assert = require('assert')

describe('RouterBindToDBService', () => {
  it('should exist', () => {
    assert(global.app.api.services['RouterBindToDBService'])
  })
})
