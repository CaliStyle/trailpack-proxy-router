/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const Service = require('trails-service')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')

/**
 * @module RouterFLService
 * @description Binds Router Database to Flat Files
 */
module.exports = class RouterFLService extends Service {
  // TODO
  /**
   * build
   * @returns {Promise.<T>}
   */
  build() {

    return Promise.resolve()
  }

  /**
   * get
   * @param req
   * @returns {Promise.<{id: number, meta: object, page: string}>}
   */
  get(req) {
    console.log('orginal: ', req.originalUrl, 'base: ', req.baseUrl)

    return Promise.resolve({
      id: 1,
      meta: {},
      page: 'Hello World'
    })
  }

  /**
   * create
   * @param pagePath
   * @param options
   * @returns {Promise}
   */
  create(pagePath, options) {
    return new Promise((resolve, reject) => {
      // Try and get the directory name of the pagePath
      let dir
      try {
        dir = path.dirname(pagePath)
      }
      catch (err) {
        return reject(err)
      }
      // Try and make the directory of the pagePath
      try {
        mkdirp.sync(dir)
      }
      catch (err) {
        return reject(err)
      }

      fs.writeFile(pagePath, '', (err) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`routersflservice:create ${pagePath} was created`)
        return resolve(true)
      })
    })
  }
  update(pagePath, options){

  }

  /**
   * destroy
   * @param pagePath
   * @param options
   * @returns {Promise}
   */
  destroy(pagePath, options){
    return new Promise((resolve, reject) => {
      // Try and get the directory name of the pagePath
      let dir
      try {
        dir = path.dirname(pagePath)
      }
      catch (err) {
        return reject(err)
      }
      rmdir(dir, (err, dirs, files) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`routersflservice:destroy ${dir} and it's files were destroyed`)
        return resolve(true)
      })
    })
  }

  /**
   * resolveFlatFilePathFromString
   * @param orgPath
   * @param options
   * @returns {string|*}
   */
  resolveFlatFilePathFromString(orgPath, options){
    const parts = orgPath.split('/')
    let outPath = ['','a0','0.0.0.md']
    _.each(parts, (part, index) => {
      if (index + 1 == parts.length) {
        outPath[0] = `/${outPath[0]}/${part}/series`
      }
      else {
        outPath[0] = `/${outPath[0]}/${part}`
      }
      if (options && options.series && options.series !== '') {
        outPath[1] = options.series
      }
      if (options && options.version && options.version !== '') {
        outPath[2] = `${options.version}.md`
      }
    })
    return path.join(__dirname, '../../', this.app.config.proxyroute.folder, outPath.join('/'))
  }

  /**
   * checkIfFile
   * @param file
   * @returns {Promise}
   */
  checkIfFile(file) {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return resolve(false)
          }
          else {
            return reject(err)
          }
        }
        console.log(stats)
        return resolve(stats.isFile())
      })
    })
  }

}

