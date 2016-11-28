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
      .post('/route/buildToDB',{})
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make bindToFL post request', (done) => {
    request
      .post('/route/buildToFL',{})
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make addPage post request', (done) => {
    request
      .post('/route/addPage')
      .send({
        identifier: '/hello/earth'
      })
      .expect(200)
      .end((err, res) => {
        console.log(res.body)
        done(err)
      })
  })
  // NEGATIVE
  it('should fail addPage post request as it was just created', (done) => {
    request
      .post('/route/addPage')
      .send({
        identifier: '/hello/earth'
      })
      .expect(500)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make updatePage post request', (done) => {
    request
      .post('/route/updatePage')
      .send({
        identifier: '/hello/earth'
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
        identifier: '/hello/earth'
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
        done(err)
      })
  })
  it('should make updateSeries post request', (done) => {
    request
      .post('/route/updateSeries')
      .send({
        identifier: '/',
        document: 'Updated Hello'
      })
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
  it('should make removeSeries post request', (done) => {
    request
      .post('/route/removeSeries')
      .send({
        identifier: '/'
      })
      .expect(200)
      .end((err, res) => {
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
