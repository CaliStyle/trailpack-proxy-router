'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')

describe('proxyroute middleware', () => {
  let request

  before((done) => {
    request = supertest('http://localhost:3000')
    done()
  })
  it('should make test.jpg request', (done) => {
    request
      .get('/test.jpg')
      .expect(200)
      .end((err, res) => {
        assert(res.type, 'image/jpeg')
        done(err)
      })
  })
  it('should make index.html request', (done) => {
    request
      .get('/')
      .expect(200)
      .end((err, res) => {
        assert(res.text)
        done(err)
      })
  })
  it('should make index as json request', (done) => {
    request
      .get('/')
      .set('Accept', 'application/json') //set header for this test
      .expect(200)
      .end((err, res) => {
        assert.strictEqual(res.body.id, null)
        assert(res.body.version, '0.0.1')
        assert(res.body.series, 'a0')
        assert(res.body.meta, { title: 'Homepage Hello World', keywords: 'proxy-engine, amazing' })
        assert(res.body.document)
        done(err)
      })
  })
  it('should match pattern /hello/:world', (done) => {
    request
      .get('/hello/earth')
      .expect(200)
      .end((err, res) => {
        const expectedHtml = [
          '<h1>Hi There, I\'m :world</h1>\n'
        ].join('\n')
        assert(res.text, expectedHtml)
        done(err)
      })
  })
  it('should match pattern /hello/saturn', (done) => {
    request
      .get('/hello/saturn')
      .expect(200)
      .end((err, res) => {
        // console.log(res)
        const expectedHtml = [
          '<h1>Hi There, I\'m Saturn</h1>\n'
        ].join('\n')
        assert(res.text, expectedHtml)
        done(err)
      })
  })
})
