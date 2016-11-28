/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const Service = require('trails-service')
// const _ = require('lodash')

/**
 * @module RouterService
 * @description Route Service
 */
module.exports = class RouterService extends Service {
  /**
   * isProxyRouteRequest
   * @param req
   * @returns {boolean} if url matches proxyroute pattern
   */
  isProxyRouteRequest(req) {
    // transform the method to lowercase and check if Get Request, if not, skip
    if ( req.method.toLowerCase() !== 'get') {
      this.app.log.silly('proxyroute:not GET request')
      return false
    }

    // TODO If a Static asset then skip
    // if (/(?:\.([^.]+))?$/.test(req.originalUrl)) {
    //   this.app.log.debug('proxyroute:static assest')
    //   return false
    // }
    // console.log(/(?:\.([^.]+))?$/.test(req.originalUrl))

    // Check if this has an explicit ignore
    const pathToRegexp = require('path-to-regexp')
    let ignore = false
    this.app.config.proxyroute.ignoreRoutes.forEach((route) => {
      // If another catchall route already ignored, break immediately
      if (ignore) {
        return
      }
      // If route has a config with ignore
      const re = pathToRegexp(route, [])
      if (re.exec(req.originalUrl)) {
        ignore = true
        return
      }
    })
    // If this route is ignored.
    if (ignore) {
      return false
    }

    // else return isProxyRouteRequest (true)
    return true
  }
  // TODO
  pickSeries() {

  }
  /**
   * flatfileProxyRoute
   * @param req
   * @returns {Object} proxyroute
   */
  // TODO
  flatfileProxyRoute(req) {
    const RouterFLService = this.app.services.RouterFLService
    return RouterFLService.get(req)
  }

  /**
   * databaseProxyRoute
   * @param req
   * @returns {Promise.<proxyroute>}
   */
  // TODO
  databaseProxyRoute(req) {
    const RouterDBService = this.app.services.RouterDBService
    return RouterDBService.get(req)
  }

  /**
   * resolveProxyRoute
   * @param req
   * @returns {Promise.<proxyroute>}
   */
  resolveProxyRoute(req) {
    if (this.app.config.proxyroute.forceFL) {
      return this.flatfileProxyRoute(req)
    }
    else {
      return this.databaseProxyRoute(req)
    }
  }

  /**
   * findPageByID
   * @param id
   * @returns {Promise}
   */
  findPageByID(id) {
    return new Promise((resolve, reject) => {
      if (this.app.config.proxyroute.forceFL) {
        const err = new Error('RouterService.findPageByID is disabled while proxyroute.forceFL is true')
        return reject(err)
      }
      const FootprintService = this.app.services.FootprintService
      FootprintService.find('Route', id)
        .then(routes => {
          if (routes.length == 0){
            throw new Error(`Route id '${id}' not found`)
          }
          return resolve(routes[0])
        })
        .catch(err =>{
          return reject(err)
        })
    })
  }

  /**
   * findPageByPath
   * @param path
   * @returns {Promise}
   */
  findPageByPath(path) {
    return new Promise((resolve, reject) => {
      if (this.app.config.proxyroute.forceFL) {
        const err = new Error('RouterService.findPageByPath is disabled while proxyroute.forceFL is true')
        return reject(err)
      }
      // Remove all query strings just in case
      path = path.split('?')[0]
      const FootprintService = this.app.services.FootprintService
      FootprintService.find('Route', {path: path})
        .then(routes => {
          if (routes.length == 0){
            throw new Error(`Route not found for: ${path}`)
          }
          return resolve(routes[0])
        })
        .catch(err =>{
          return reject(err)
        })
    })

  }
  /**
   * resolveIdentifier
   * @param {String} identifier,
   * @param {Boolean} lookup
   * @returns {Promise.<{id: string, path: string}>}
   */
  resolveIdentifier(identifier, lookup) {
    return new Promise((resolve, reject) => {
      const pattern = new RegExp('^(.*/)([^/]*)$', 'g')
      const page = {
        id: null,
        path: null
      }
      let lookupFunc
      if (pattern.test(identifier)) {
        lookupFunc = 'findPageByPath'
        page.path = identifier
      }
      else {
        lookupFunc = 'findPageByID'
        page.id = identifier
      }
      // If this is a forced lookup
      if (lookup) {
        this[lookupFunc](identifier)
          .then(result => {
            page.id = page.id ? page.id : result.id
            page.path = page.path ? page.path : result.path
            return resolve(page)
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        return resolve(page)
      }

    })
  }
  /**
   * addPage
   * @param data
   * @returns {Promise.<proxyroute>}
   */
  addPage(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      let pagePath

      this.resolveIdentifier(data.identifier)
        .then(identifier => {
          this.app.log.debug('routerservice:addPage', identifier)
          if (!identifier.path) {
            throw new Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world'`)
          }
          return RouterFLService.resolveFlatFilePathFromString(identifier.path, data.options)
          // if (identifier.path) {
          // }
          // else {
          //   return this.findPageByID(identifier.id)
          //     .then(page => {
          //       return RouterFLService.resolveFlatFilePathFromString(page.path, data.options)
          //     })
          // }
        })
        .then(resolvedPath => {
          pagePath = resolvedPath
          return RouterFLService.checkIfFile(pagePath)
        })
        .then(isCreated => {
          if (isCreated) {
            throw new Error(`${pagePath} is already created, use RouterController.updatePage or RouterService.updatePage instead`)
          }
          return this.createPage(pagePath)
        })
        .then(page => {
          return resolve(page)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   *
   * @param pagePath
   * @returns {Promise.<proxyroute>}
   */
  createPage(pagePath) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService

      if (this.app.config.proxyroute.forceFL) {
        RouterFLService.create(pagePath)
          .then(createdFile => {
            return resolve({
              path: pagePath,
              series: [],
              demographics: []
            })
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        let created
        RouterDBService.create(pagePath)
          .then(createdRecord => {
            created = createdRecord
            return RouterFLService.create(pagePath)
          })
          .then(createdFile => {
            return resolve(created)
          })
          .catch(err => {
            return reject(err)
          })
      }
    })
  }
  /**
   * updatePage
   * @param {Object} data
   * @returns {Promise.<proxyroute>}
   */
  // TODO
  updatePage(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      // let pagePath

      this.resolveIdentifier(data.identifier)
        .then(identifier => {
          this.app.log.debug('routerservice:updatePage', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world' or as an ID eg. '123'`)
          }
          return RouterFLService.resolveFlatFilePathFromString(identifier.path, data.options)
        })
        .then(resolvedPath => {
          // pagePath = resolvedPath
          return resolve(data)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
  /**
   * removePage
   * @param {Object} data
   * @returns {Promise.<proxyroute>}
   */
  removePage(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      let pagePath

      this.resolveIdentifier(data.identifier)
        .then(identifier => {
          this.app.log.debug('routerservice:removePage', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world' or as an ID eg. '123'`)
          }
          return RouterFLService.resolveFlatFilePathFromString(identifier.path, data.options)
        })
        .then(resolvedPath => {
          pagePath = resolvedPath
          return RouterFLService.checkIfFile(pagePath)
        })
        .then(isCreated => {
          if (!isCreated) {
            throw new Error(`${pagePath} is does not exist and can not be removed`)
          }
          return this.destroyPage(pagePath)
        })
        .then(page => {
          return resolve(page)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   * destroyPage
   * @param {String} pagePath
   * @returns {Promise.<proxyroute>}
   */
  destroyPage(pagePath){
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      if (this.app.config.proxyroute.forceFL) {
        RouterFLService.destroy(pagePath)
          .then(destroyedFile => {
            return resolve({
              path: pagePath,
              series: [],
              demographics: []
            })
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        let destroyed
        RouterDBService.destroy(pagePath)
          .then(destroyedRecord => {
            destroyed = destroyedRecord[0]
            return RouterFLService.destroy(pagePath)
          })
          .then(destroyedFile => {
            return resolve(destroyed)
          })
          .catch(err => {
            return reject(err)
          })
      }
    })
  }
  /**
   * addSeries
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  addSeries(data) {
    return Promise.resolve(data)
  }

  /**
   * updateSeries
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  updateSeries(data) {
    return Promise.resolve(data)
  }

  /**
   * removeSeries
   * @param data
   * @returns {Promise.<T> Object} proxyroute
   */
  // TODO
  removeSeries(data) {
    return Promise.resolve(data)
  }
}

