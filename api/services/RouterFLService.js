/* eslint no-console: [0] */
'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')
const SERIES = require('../utils/enums').SERIES
const EXTENSIONS = require('../utils/enums').EXTENSIONS
const vc = require('version_compare')
const Errors = require('proxy-engine-errors')

/**
 * @module RouterFLService
 * @description Binds Router Database to Flat Files
 */
module.exports = class RouterFLService extends Service {
  /**
   * build
   * @returns {Promise.<T>}
   */
  // TODO build Flat File to Database
  build() {
    return Promise.resolve()
  }

  /**
   * get
   * @param req
   * @returns {Promise.<{id: number, meta: object, document: string, path: string, series: string, version: string}>}
   */
  // TODO pass options
  get(req) {
    // return new Promise((resolve, reject) => {
      // this.app.log.silly('RouterFLService.get ordinal:', req.originalUrl, 'base:', req.baseUrl)
    const prefix = _.get(this.app.config, 'proxyRouter.prefix') || _.get(this.app.config, 'footprints.prefix')
    const pagePath = req.originalUrl.replace(prefix, '')
    const alternatePath = req.route && req.route.path ? req.route.path : null
    const options = {
      series: req.params.series || 'a0',
      version: req.params.version || 'latest',
      extension: req.params.extension || null
    }
    return this.renderPage(pagePath, alternatePath, options)
      .then(renderedPage => {
        const proxyRoute = {
          id: renderedPage.id ? renderedPage.id : null,
          // TODO multi-site support
          host: 'localhost',
          path: renderedPage.orgPath ? renderedPage.orgPath : pagePath,
          series: renderedPage.series ? renderedPage.series : 'a0',
          version: renderedPage.version ? renderedPage.version : '0.0.0',
          meta: renderedPage.meta ? renderedPage.meta : {},
          document: renderedPage.document ? renderedPage.document : renderedPage,
          children: renderedPage.children ? renderedPage.children : {}
        }
        return proxyRoute
      })
  }

  /**
   * renderPage
   * @param pagePath (relative to domain)
   * @param alternatePath (relative to domain)
   * @param options to be passed to resolveFlatFilePathFromString
   * @returns {Promise.<{id: any, host: string, path: string, orgPath: string, series: string, version: string, meta: Object, document: string, children: Object }>}
   */
  renderPage(pagePath, alternatePath, options){
    options = options || {}
    this.app.log.debug('RouterFLService.renderPage', pagePath, alternatePath, options)
    const RenderGenericService = this.app.services.RenderGenericService
    const extensions = _.values(EXTENSIONS).sort(ext => {
      if (options.extension && ext == options.extension) {
        return -1
      }
      else if (!options.extension && ext == this.app.config.proxyRouter.default_extension) {
        return -1
      }
      else {
        return 1
      }
    })
    const toTry = []
    extensions.forEach(ext => {
      toTry.push(this.resolveFlatFilePathFromString(pagePath, _.merge({},options, {
        extension: ext
      })))
      toTry.push(this.resolveFlatFilePathFromString(alternatePath, _.merge({},options, {
        extension: ext
      })))
    })
    let chosenPath
    return Promise.all(toTry.map(trial => {
      if (chosenPath) {
        return Promise.resolve()
      }
      else {
        return this.checkIfFile(trial.path)
         .then(fileExists => {
           if (fileExists) {
             chosenPath = trial
             return Promise.resolve(chosenPath)
           }
           else {
             return Promise.resolve()
           }
         })
      }
    }))
      .then(() => {
        if (chosenPath && _.values(EXTENSIONS).indexOf(path.extname(chosenPath.path) > -1)) {
          return fs.readFileSync(chosenPath.path, 'utf8')
        }
        else {
          throw new Errors.FoundError(Error(`${pagePath} and ${alternatePath} are not qualified resources`))
        }
      })
    // return this.checkIfFile(fullPagePath.path)
    //   .then(fileExists =>{
    //     if (fileExists) {
    //       chosenPath = fullPagePath
    //       return fileExists
    //     }
    //     else {
    //       chosenPath = alternatePath
    //       this.app.log.silly(`RouterFLService.renderPage rendering ${alternatePath} as ${pagePath} is not set`)
    //       fullPagePath = this.resolveFlatFilePathFromString(alternatePath, options)
    //       return this.checkIfFile(fullPagePath.path)
    //     }
    //   })
    //   .then(fileExists => {
    //     if (fileExists && _.values(EXTENSIONS).indexOf(path.extname(fullPagePath.path) > -1)) {
    //       return fs.readFileSync(fullPagePath.path, 'utf8')
    //     }
    //     else {
    //       throw new Errors.FoundError(Error(`${pagePath} and ${alternatePath} are not qualified resources`))
    //     }
    //   })
      .then(doc => {
        // Render the doc
        return RenderGenericService.render(doc)
      })
      .then(renderedDoc => {
        const proxyRoute = {
          id: null,
          // TODO mulit-site support
          host: 'localhost',
          path: chosenPath.path,
          orgPath: chosenPath.orgPath,
          series: chosenPath.series ? chosenPath.series : 'a0',
          version: chosenPath.version ? chosenPath.version : '0.0.0',
          meta: renderedDoc.meta ? renderedDoc.meta : {},
          document: renderedDoc.document ? renderedDoc.document : renderedDoc,
          children: this.app.services.RouterSitemapService.buildChildrenFL(chosenPath.resolvedPath).children
        }
        return proxyRoute
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

      fs.writeFile(pagePath, '', 'utf-8', (err) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`RouterFLService.create ${pagePath} was created`)
        return resolve(true)
      })
    })
  }

  createSeries(data) {
    return new Promise((resolve, reject) => {
      let directories
      let series = data.series
      let version = data.version
      if (!series) {
        try {
          directories = this.getDirectories(data.seriesPath)
        }
        catch (err) {
          return reject(err)
        }
        if (directories.length > SERIES.length) {
          const err = new Error('You have exceeded the amount of available series numbers')
          return reject(err)
        }
        const latest = directories[directories.length - 1]
        const available = _.values(SERIES)
        const index = available.indexOf(latest)
        series = available[index + 1]
      }
      if (!version) {
        version = '0.0.0'
      }
      if (!series || !version) {
        const err = new Error('Series or version is not available')
        return reject(err)
      }

      const dir = path.join(data.seriesPath, series)
      const file = path.join(dir, `${version}${this.app.config.proxyRouter.default_extension}`)
      try {
        mkdirp.sync(dir)
      }
      catch (err) {
        return reject(err)
      }
      // Redress data with updates
      data.seriesPath = dir
      data.series = series
      data.version = version

      fs.writeFile(file, data.document, 'utf-8', (err) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`RouterFLService.createSeries ${data.seriesPath} was created`)
        return resolve(data)
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
   * updateSeries
   * @param data
   * @returns {Promise}
   */
  updateSeries(data){
    return new Promise((resolve, reject) => {
      fs.writeFile(data.seriesPath, data.document, 'utf-8', (err) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`RouterFLService.updateSeries ${data.seriesPath} was updated`)
        return resolve(data)
      })
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
      const dirParts = path.normalize(dir).split('/')
      // Remove the test folder from the path
      if (_.values(SERIES).indexOf(dirParts[dirParts.length - 1] != -1)) {
        dirParts.splice(-1,1)
      }
      // Remove the series folder of the path
      if (dirParts[dirParts.length - 1] == 'series') {
        dirParts.splice(-1,1)
      }
      // Remove the folder entirely if it is not the root
      // if (dirParts[dirParts.length - 1] != this.app.config.proxyRouter.folder){
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
   * destroySeries
   * @param data
   * @returns {Promise}
   */
  destroySeries(data){
    return new Promise((resolve, reject) => {
      // Try and get the directory name of the pagePath
      let dir
      try {
        dir = path.join(data.seriesPath, data.series)
        data.seriesPath = dir
      }
      catch (err) {
        return reject(err)
      }
      rmdir(dir, (err, dirs, files) => {
        if (err) {
          return reject(err)
        }
        this.app.log.debug(`RouterFLService.destroySeries ${dir} and was destroyed`)
        return resolve(data)
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
    options = options || {}
    options.extension = options.extension || this.app.config.proxyRouter.default_extension

    const parts = path.normalize(orgPath).split('/')
    const outPath = ['','a0','0.0.0']
    if (options.host) {
      outPath[0] = `/${options.host}`
    }
    _.each(parts, (part, index) => {
      if (index + 1 == parts.length) {
        outPath[0] = `/${ outPath[0] }/${ part }/${ this.app.config.proxyRouter.series }`
      }
      else {
        outPath[0] = `/${ outPath[0] }/${ part }`
      }
    })
    // Override default series and version if set
    if (options.series && options.series !== '') {
      outPath[1] = options.series
    }
    // If Requesting Latest Version
    if (options.version && options.version == 'latest') {
      try {
        const directory = path.join(process.cwd(), this.app.config.proxyRouter.folder, outPath[0], outPath[1])
        this.app.log.silly('RouterFLService.resolveFlatFilePathFromString: Directory ', directory)
        const files = fs.readdirSync(directory)
        let version = '0.0.0'
        // TODO this should compare all dirs instead of just one after another
        for (const i of files) {
          const tryVersion = i.split(/.md|.html/)[0]
          if (vc.compare(version, tryVersion)) {
            this.app.log.silly('RouterFLService.resolveFlatFilePathFromString: Later Version', tryVersion)
            version = tryVersion
          }
        }
        outPath[2] = `${version}${options.extension}`
      }
      catch (err) {
        // This is normal to throw an error here, because this directory may not exists
        // this.app.log.error(err)
      }
    }
    // If options version is set explicitly and not "latest"
    else if (options && options.version && options.version !== ''){
      outPath[2] = `${options.version}${options.extension}`
    }
    else {
      outPath[2] = `${outPath[2]}${options.extension}`
    }

    // Construct Final Response
    const res = {
      // TODO multi-site support
      // The Final site the page was rendered from
      host: 'localhost',
      // The final Series that was run
      series: outPath[1],
      // The final Version that was run
      version: outPath[2].split(/.md|.html/)[0],
      // The Original path (the url)
      orgPath: orgPath,
      // The resolved location of this lookup
      resolvedPath: path.join(process.cwd(), this.app.config.proxyRouter.folder, orgPath),
      // The Server path
      path: path.join(process.cwd(), this.app.config.proxyRouter.folder, outPath.join('/'))
    }
    // console.log('resolvedPath', res.resolvedPath)
    return res
  }

  /**
   * resolveFlatFileSeriesFromString
   * @param orgPath
   * @param options
   * @returns {{orgPath: *, path: (string|*)}}
   */
  resolveFlatFileSeriesFromString(orgPath, options) {
    options = options || {}
    const parts = path.normalize(orgPath).split('/')
    const outPath = ['']
    if (options.host) {
      outPath[0] = `/${options.host}`
    }
    _.each(parts, (part, index) => {
      if (index + 1 == parts.length) {
        outPath[0] = `/${ outPath[0] }/${ part }/${ this.app.config.proxyRouter.series }`
      }
      else {
        outPath[0] = `/${ outPath[0] }/${ part }`
      }
    })

    const res = {
      // The Original path (the url)
      orgPath: orgPath,
      // The Server path
      path: path.join(__dirname, '../../', this.app.config.proxyRouter.folder, outPath.join('/'))
    }
    return res
  }
  /**
   * checkIfFile
   * @param {String} file
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

  /**
   * checkIfDir
   * @param {String} dir
   * @returns {Promise}
   */
  checkIfDir(dir) {
    return new Promise((resolve, reject) => {
      fs.stat(dir, (err, stats) => {
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

  getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter((file) => {
      return fs.statSync(path.join(srcPath, file)).isDirectory()
    })
  }
}
