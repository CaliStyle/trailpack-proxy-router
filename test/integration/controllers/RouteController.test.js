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
      .send({})
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make bindToFL post request', (done) => {
    request
      .post('/route/buildToFL')
      .send({})
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make addPage post request', (done) => {
    request
      .post('/route/addPage')
      .send({
        identifier: '/hello/jupiter'
      })
      .expect(200)
      .end((err, res) => {
        console.log(res.body)
        done(err)
      })
  })
  it('should make editPage post request', (done) => {
    request
      .post('/route/editPage')
      .send({
        identifier: '/hello/jupiter',
        options: {}
      })
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make removePage post request', (done) => {
    request
      .post('/route/removePage')
      .send({
        identifier: '/hello/jupiter'
      })
      .expect(200)
      .end((err, res) => {
        console.log(res.body)
        done(err)
      })
  })
  it('should make addSeries post request', (done) => {
    request
      .post('/route/addSeries')
      .send({
        identifier: '/',
        document: 'Hello'
      })
      .expect(200)
      .end((err, res) => {
        console.log(res.body)
        assert.equal(res.body.path, '/')
        assert.equal(res.body.series, 'c0')
        assert.equal(res.body.version, '0.0.0')
        assert.equal(res.body.document, 'Hello')
        done(err)
      })
  })
  it('should make editSeries post request', (done) => {
    request
      .post('/route/editSeries')
      .send({
        identifier: '/',
        version: '0.0.0',
        series: 'c0',
        document: 'Updated Hello'
      })
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.path, '/')
        assert.equal(res.body.series, 'c0')
        assert.equal(res.body.version, '0.0.0')
        assert.equal(res.body.document, 'Updated Hello')
        done(err)
      })
  })
  it('should make removeSeries post request', (done) => {
    request
      .post('/route/removeSeries')
      .send({
        identifier: '/',
        series: 'c0'
      })
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.series,'c0')
        assert.equal(res.body.path,'/')
        done(err)
      })
  })
  it('should make positive control post request', (done) => {
    request
      .post('/route/control?type=positive')
      .send({
        identifier: '/',
        demographic: 'test',
        payload: {
          'event:click': 1
        }
      })
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make negative control post request', (done) => {
    request
      .post('/route/control?type=negative')
      .send({
        identifier: '/',
        demographic: 'test',
        payload: {
          'event:click': 1
        }
      })
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
})
