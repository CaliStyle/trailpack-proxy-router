'use strict'
/* global describe, it */
const assert = require('assert')

describe('RouterSitemapService', () => {
  it('should exist', () => {
    assert(global.app.api.services['RouterSitemapService'])
  })
  it('should build children from flat file', (done) => {
    const out = global.app.services.RouterSitemapService.initFL()
    console.log('THIS META', out)
    assert.ok(out.title)
    assert.ok(out.path)
    assert.ok(out.children)
    assert.ok(out.meta)
    assert.ok(out.changefreq)
    assert.ok(out.lastmod)
    assert.ok(out.priority)
    // console.log(out)
    done()
  })
})
