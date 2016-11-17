'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')

describe('RouteController', () => {
  let request

  before((done) => {
    request = supertest('http://localhost:3000')
    done()
  })

  it('should exist', () => {
    assert(global.app.api.controllers['RouteController'])
  })

  it('should make bindToDB post request', (done) => {
    request
      .post('/route/buildToDB')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make bindToFL post request', (done) => {
    request
      .post('/route/buildToFL')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
})
