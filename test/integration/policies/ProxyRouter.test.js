'use strict'
/* global describe, it */

const assert = require('assert')

describe('ProxyRouter', () => {
  it('should exist', () => {
    assert(global.app.api.policies['ProxyRouter'])
  })
})
