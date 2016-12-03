/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const Service = require('trails-service')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')
const TESTS = require('../utils/enums').TESTS
const vc = require('version_compare')
const errors = require('../../lib/errors')

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
  // TODO pass options
  get(req) {
    return new Promise((resolve, reject) => {
      // console.log('RouterFLService.get orginal:', req.originalUrl, 'base:', req.baseUrl)
      const pagePath = req.originalUrl
      const alternatePath = req.route && req.route.path ? req.route.path : null
      const options = {
        series: 'a0',
        version: 'latest'
      }
      this.renderPage(pagePath, alternatePath, options)
        .then(renderedPage => {
          const proxyroute = {
            id: renderedPage.id ? renderedPage.id : null,
            path: renderedPage.orgPath ? renderedPage.orgPath : pagePath,
            series: renderedPage.series ? renderedPage.series : 'a0',
            version: renderedPage.version ? renderedPage.version : '0.0.0',
            meta: renderedPage.meta ? renderedPage.meta : {},
            document: renderedPage.document ? renderedPage.document : renderedPage
          }
          return resolve(proxyroute)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   * renderPage
   * @param pagePath (relative to domain)
   * @param alternatePath (relative to domain)
   * @param options to be passed to resolveFlatFilePathFromString
   * @returns {Promise.<T>}
   */
  renderPage(pagePath, alternatePath, options){
    return new Promise((resolve, reject) => {
      this.app.log.debug('RouterFLService.renderPage', pagePath, alternatePath, options)
      const RouterRenderService = this.app.services.RouterRenderService
      let fullPagePath = this.resolveFlatFilePathFromString(pagePath, options)
      let choosenPath
      this.checkIfFile(fullPagePath.path)
        .then(fileExists =>{
          if (fileExists) {
            choosenPath = fullPagePath
            return fileExists
          }
          else {
            choosenPath = alternatePath
            this.app.log.silly(`RouterFLService.renderPage rendering ${alternatePath} as ${pagePath} is not set`)
            fullPagePath = this.resolveFlatFilePathFromString(alternatePath, options)
            return this.checkIfFile(fullPagePath.path)
          }
        })
        .then(fileExists => {
          if (fileExists && path.extname(fullPagePath.path) === '.md') {
            const doc = fs.readFileSync(fullPagePath.path, 'utf8')
            return RouterRenderService.render(doc)
          }
          else {
            throw new errors.FoundError(Error(`${pagePath} and ${alternatePath} are not qualified resources`))
          }
        })
        .then(renderedDoc => {
          const proxyroute = {
            id: null,
            path: choosenPath.path,
            orgPath: choosenPath.orgPath,
            series: choosenPath.series ? choosenPath.series : 'a0',
            version: choosenPath.version ? choosenPath.version : '0.0.0',
            meta: renderedDoc.meta ? renderedDoc.meta : {},
            document: renderedDoc.document ? renderedDoc.document : renderedDoc
          }
          return resolve(proxyroute)
        })
        .catch(err => {
          return reject(err)
        })
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
        this.app.log.debug(`RouterFLService.create ${pagePath} was created`)
        return resolve(true)
      })
    })
  }

  /**
   * update
   * @param pagePath
   * @param options
   * @returns {Promise}
   */
  update(pagePath, options){
    return new Promise((resolve, reject) => {
      // We can't update a page because FlatFile is not aware of pages, only documents
      return resolve(true)
    })
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
      let dirParts = path.normalize(dir).split('/')
      // Remove the test folder from the path
      if (_.values(TESTS).indexOf(dirParts[dirParts.length - 1] != -1)) {
        dirParts.splice(-1,1)
      }
      // Remove the series folder of the path
      if (dirParts[dirParts.length - 1] == 'series') {
        dirParts.splice(-1,1)
      }
      // Remove the folder entirely if it is not the root
      // if (dirParts[dirParts.length - 1] != this.app.config.proxyroute.folder){
      //   dirParts.splice(-1,1)
      // }
      dir = path.normalize(dirParts.join('/'))
      rmdir(dir, (err, dirs, files) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`RouterFLService.destroy ${dir} and it's files were destroyed`)
        return resolve(true)
      })
    })
  }

  /**
   * resolveFlatFilePathFromString
   * @param orgPath
   * @param options
   * @returns {object|*}
   */
  resolveFlatFilePathFromString(orgPath, options){
    const parts = path.normalize(orgPath).split('/')
    let outPath = ['','a0','0.0.0.md']
    _.each(parts, (part, index) => {
      if (index + 1 == parts.length) {
        outPath[0] = `/${outPath[0]}/${part}/series`
      }
      else {
        outPath[0] = `/${outPath[0]}/${part}`
      }
    })
    // Override default series and version if set
    if (options && options.series && options.series !== '') {
      outPath[1] = options.series
    }
    // If Requesting Latest Version
    if (options && options.version && options.version == 'latest') {
      try {
        const directory = path.join(__dirname, '../../', this.app.config.proxyroute.folder, outPath[0], outPath[1])
        const files = fs.readdirSync(directory)
        let version = '0.0.0'
        // TODO this should compare all dirs instead of just one after another
        for (let i of files) {
          const tryVersion = i.split('.md')[0]
          if (vc.compare(version, tryVersion)) {
            this.app.log.silly('RouterFLService.resolveFlatFilePathFromString: Later Version', tryVersion)
            version = tryVersion
          }
        }
        outPath[2] = `${version}.md`
      }
      catch (err) {
        // This is normal to throw an error here, because this directory may not exists
        // console.log(err)
      }
    }
    // If options version is set explicitly and not "latest"
    else if (options && options.version && options.version !== ''){
      outPath[2] = `${options.version}.md`
    }
    // Construct Final Response
    const res = {
      // The final Series that was run
      series: outPath[1],
      // The final Version that was run
      version: outPath[2].split('.md')[0],
      // The Original path (the url)
      orgPath: orgPath,
      // The Server path
      path: path.join(__dirname, '../../', this.app.config.proxyroute.folder, outPath.join('/'))
    }
    return res
  }

  resolveFlatFileSeriesFromString(orgPath, options) {
    const parts = path.normalize(orgPath).split('/')
    let outPath = ['']
    _.each(parts, (part, index) => {
      if (index + 1 == parts.length) {
        outPath[0] = `/${outPath[0]}/${part}/series`
      }
      else {
        outPath[0] = `/${outPath[0]}/${part}`
      }
    })

    const res = {
      // The Original path (the url)
      orgPath: orgPath,
      // The Server path
      path: path.join(__dirname, '../../', this.app.config.proxyroute.folder, outPath.join('/'))
    }
    return res
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
        // console.log('RouterFLService.checkIfFile',stats)
        return resolve(stats.isFile())
      })
    })
  }

  checkIfDir(file) {
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
        // console.log('RouterFLService.checkIfFile',stats)
        return resolve(stats.isDirectory())
      })
    })
  }
}
