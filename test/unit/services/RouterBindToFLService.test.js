'use strict'
/* global describe, it */
const assert = require('assert')

describe('RouterBindToFLService', () => {
  it('should exist', () => {
    assert(global.app.api.services['RouterBindToFLService'])
  })
})
