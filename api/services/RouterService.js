/* eslint no-console: [0] */

'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const pathToRegexp = require('path-to-regexp')
const Errors = require('proxy-engine-errors')

/**
 * @module RouterService
 * @description Route Service
 */
module.exports = class RouterService extends Service {
  /**
   * isCaached
   * @param req
   * @returns {Promise.<boolean>}
   */
  // TODO implement cache
  isCached(req) {
    if (!req.trailsApp.config.proxyRouter.cache.allow) {
      return Promise.resolve(false)
    }
    return Promise.resolve(false)
  }
  /**
   * setPreReqRoute req.route is not available at this time, so we mock it
   * @param req
   * @returns {Promise.<*>}
   */
  setPreReqRoute(req) {
    const prefix = _.get(this.app.config, 'proxyRouter.prefix') || _.get(this.app.config, 'footprints.prefix')
    const url = req.originalUrl.replace(prefix, '')

    let alternative
    req.trailsApp.proxyRouter.alternateRoutes.forEach((route)=> {
      if (alternative) {
        return
      }
      const re = pathToRegexp(route, [])
      if (re.exec(url)) {
        this.app.log.silly('RouterService.setPreReqRoute alternative', route)
        alternative = {
          path: route,
          stack: [],
          methods: { get: true }
        }
      }
    })
    return Promise.resolve(alternative)
  }
  /**
   * isProxyRouteRequest
   * @param req
   * @returns {boolean} if url matches proxyroute pattern
   */
  isProxyRouterRequest(req) {
    const prefix = _.get(this.app.config, 'proxyRouter.prefix') || _.get(this.app.config, 'footprints.prefix')
    const url = req.originalUrl.replace(prefix, '').split('?')[0]
    // transform the method to lowercase and check if Get Request, if not, skip
    if ( !req.method || req.method.toLowerCase() !== 'get') {
      this.app.log.silly('proxyRouter: not GET request')
      return false
    }

    // If a Static asset then skip
    const reg = new RegExp('^\.[\w]+$')
    if (reg.test(url)) {
      this.app.log.silly('proxyrouter:static asset')
      return false
    }

    // Check if this has an explicit ignore
    let ignore = false
    this.app.proxyRouter.ignoreRoutes.forEach((route) => {
      // If another catchall route already ignored, break immediately
      if (ignore) {
        return
      }
      // If route has a config with ignore
      const re = pathToRegexp(route, [])
      if (re.exec(url)) {
        ignore = true
        return
      }
    })
    // If this route is ignored.
    if (ignore) {
      return false
    }
    // default return true
    return true
  }

  // TODO pick which series test to use
  pickSeries() {

  }

  /**
   * flatfileProxyRoute
   * @param req
   * @returns {Promise.<proxyRouter>}
   */
  flatfileProxyRoute(req) {
    const RouterFLService = this.app.services.RouterFLService
    return RouterFLService.get(req)
  }

  /**
   * databaseProxyRoute
   * @param req
   * @returns {Promise.<proxyRouter>}
   */
  // TODO
  databaseProxyRoute(req) {
    const RouterDBService = this.app.services.RouterDBService
    return RouterDBService.get(req)
  }
  cachedProxyRoute(req){

  }
  // TODO
  proxyRoute(req) {

  }

  /**
   * resolveProxyRoute
   * @param req
   * @returns {Promise.<proxyRouter>}
   */
  resolveProxyRoute(req) {
    if (this.app.config.proxyRouter.force_fl) {
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
      if (this.app.config.proxyRouter.force_fl) {
        const err = new Errors.ValidationError(Error('RouterService.findPageByID is disabled while proxyRouter.force_fl is true'))
        return reject(err)
      }
      const Route = this.app.orm.Route
      // const FootprintService = this.app.services.FootprintService
      // FootprintService.find('Route', id)
      Route.findById(id)
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
      if (this.app.config.proxyRouter.force_fl) {
        const err = new Errors.ValidationError(Error('RouterService.findPageByPath is disabled while proxyRouter.force_fl is true'))
        return reject(err)
      }
      // TODO possibly allow this for specifying versions/series?
      // Remove all query strings just in case
      path = path.split('?')[0]
      const FootprintService = this.app.services.FootprintService
      FootprintService.find('Route', { path: path })
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
      const pathPattern = new RegExp('^(.*/)([^/]*)$', 'g')
      const page = {
        id: null,
        path: null
      }
      let lookupFunc
      if (pathPattern.test(identifier)) {
        lookupFunc = 'findPageByPath'
        page.path = identifier
      }
      else {
        lookupFunc = 'findPageByID'
        page.id = identifier
      }

      if (!page.id && !page.path) {
        const err = new Errors.FoundError(Error(`Completely failed to look up ${identifier} make sure it is in "path" format eg. '/hello/world' or as an ID eg. '123'`))
        return reject(err)
      }
      // If this is a forced lookup
      if (lookup) {
        if (this.app.config.proxyRouter.force_fl) {
          const err = new Errors.ValidationError(Error('RouterService.resolveIdentifier lookup == true is disabled while proxyRouter.force_fl is true'))
          return reject(err)
        }
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
      // Otherwise just resolve the path
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
      const RouterDBService = this.app.services.RouterDBService
      let pagePath
      let regPath
      // Resolve the identifier
      this.resolveIdentifier(data.identifier)
        .then(identifier => {
          this.app.log.debug('routerservice:addPage identifier', identifier)
          if (!identifier || !identifier.path) {
            throw new Errors.FoundError(Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world'`))
          }
          regPath = identifier.path
          return RouterFLService.resolveFlatFilePathFromString(identifier.path).path
        })
        .then(resolvedPath => {
          pagePath = resolvedPath
          if (this.app.config.proxyRouter.force_fl) {
            // Check the flatfile
            return RouterFLService.checkIfFile(pagePath)
          }
          else {
            return RouterDBService.checkIfRecord({path: regPath})
          }
        })
        .then(isCreated => {
          if (isCreated) {
            throw new Errors.ConflictError(Error(`${regPath} is already created, use RouterController.editPage or RouterService.editPage instead`))
          }
          return this.createPage(pagePath, regPath)
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
   * createPage
   * @param pagePath
   * @param regPath
   * @returns {Promise.<proxyRouter>}
   */
  createPage(pagePath, regPath) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService

      if (this.app.config.proxyRouter.force_fl) {
        RouterFLService.create(pagePath)
          .then(createdFile => {
            // Mock the DB return
            return resolve({
              id: null,
              path: regPath,
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
        RouterDBService.create(regPath)
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
  editPage(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      let pagePath
      let regPath

      this.resolveIdentifier(data.identifier, !this.app.config.proxyRouter.force_fl)
        .then(identifier => {
          this.app.log.debug('routerservice:updatePage', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world' or as an ID eg. '123'`)
          }
          regPath = identifier.path
          return RouterFLService.resolveFlatFilePathFromString(regPath).path
        })
        .then(resolvedPath => {
          pagePath = resolvedPath
          if (this.app.config.proxyRouter.force_fl) {
            return RouterFLService.checkIfFile(pagePath)
          }
          else {
            return RouterDBService.checkIfRecord({path: regPath})
          }
        })
        .then(isCreated => {
          if (!isCreated) {
            throw new Errors.FoundError(Error(`${regPath} does not exist and can not be updated`))
          }
          return this.updatePage(pagePath, regPath, data.options)
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
   * @param regPath
   * @param options
   * @returns {Promise}
   */
  updatePage(pagePath, regPath, options){
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      if (this.app.config.proxyRouter.force_fl) {
        RouterFLService.update(pagePath)
          .then(updateFile => {
            // Mock the DB return
            return resolve({
              id: null,
              path: regPath,
              series: [],
              demographics: []
            })
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        let updated
        RouterDBService.update(regPath)
          .then(updatedRecord => {
            updated = updatedRecord[0]
            return RouterFLService.update(pagePath)
          })
          .then(updatedFile => {
            return resolve(updated)
          })
          .catch(err => {
            return reject(err)
          })
      }
    })
  }
  /**
   * removePage
   * @param {Object} data
   * @returns {Promise.<proxyRouter>}
   */
  removePage(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      let pagePath
      let regPath
      this.resolveIdentifier(data.identifier, !this.app.config.proxyRouter.force_fl)
        .then(identifier => {
          this.app.log.debug('routerservice:removePage', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Errors.FoundError(Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world' or as an ID eg. '123'`))
          }
          regPath = identifier.path
          return RouterFLService.resolveFlatFilePathFromString(regPath).path
        })
        .then(resolvedPath => {
          pagePath = resolvedPath
          if (this.app.config.proxyRouter.force_fl) {
            return RouterFLService.checkIfFile(pagePath)
          }
          else {
            return RouterDBService.checkIfRecord({path: regPath})
          }
        })
        .then(isCreated => {
          if (!isCreated) {
            throw new Errors.FoundError(Error(`${regPath} does not exist and can not be removed`))
          }
          return this.destroyPage(pagePath, regPath)
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
  destroyPage(pagePath, regPath){
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      if (this.app.config.proxyRouter.force_fl) {
        RouterFLService.destroy(pagePath)
          .then(destroyedFile => {
            // Mock the DB return
            return resolve({
              id: null,
              path: regPath,
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
        RouterDBService.destroy(regPath)
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
   * @returns {Promise.<proxyRouter>}
   */
  addSeries(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      this.resolveIdentifier(data.identifier, !this.app.config.proxyRouter.force_fl)
        .then(identifier => {
          this.app.log.debug('routerservice:addSeries identifier', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Errors.FoundError(Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world'`))
          }
          // Setup Data for addSeries
          delete data.identifier
          data.path = identifier.path
          data.id = identifier.id

          // console.log('RouterService.addSeries',identifier.path)
          return RouterFLService.resolveFlatFileSeriesFromString(identifier.path).path
        })
        .then(resolvedPath => {
          // Add the Series Path
          data.seriesPath = resolvedPath
          if (this.app.config.proxyRouter.force_fl) {
            return RouterFLService.checkIfDir(data.seriesPath)
          }
          else {
            return RouterDBService.checkIfRecord({path: data.path})
          }
        })
        .then(isCreated => {
          // console.log('RouterService.addSeries', isCreated)
          if (!isCreated) {
            throw new Errors.FoundError(Error(`${data.path} does not exist and can not have a series added to it.`))
          }
          return this.createSeries(data)
        })
        .then(series => {
          return resolve(series)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   * createSeries
   * @param data
   * @returns {Promise}
   */
  createSeries(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService

      if (this.app.config.proxyRouter.force_fl) {
        RouterFLService.createSeries(data)
          .then(created => {
            // Mock the DB return
            return resolve(created)
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        let created
        RouterDBService.createSeries(data)
          .then(createdRecord => {
            created = createdRecord
            return RouterFLService.createSeries(data)
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
   * editSeries
   * @param data
   * @returns {Promise.<proxyRouter>}
   */
  editSeries(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      this.resolveIdentifier(data.identifier, !this.app.config.proxyRouter.force_fl)
        .then(identifier => {
          this.app.log.debug('routerservice:editSeries identifier', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Errors.FoundError(Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world'`))
          }
          // Setup Data for addSeries
          delete data.identifier
          data.path = identifier.path
          data.id = identifier.id

          // console.log('RouterService.eidtSeries',identifier.path)
          return RouterFLService.resolveFlatFilePathFromString(identifier.path, {
            version: data.version,
            series: data.series
          }).path
        })
        .then(resolvedPath => {
          // Add the Series Path
          data.seriesPath = resolvedPath
          if (this.app.config.proxyRouter.force_fl) {
            return RouterFLService.checkIfFile(data.seriesPath)
          }
          else {
            return RouterDBService.checkIfRecord({path: data.path})
          }
        })
        .then(isCreated => {
          if (!isCreated) {
            throw new Errors.FoundError(Error(`${data.path} does not exist.`))
          }
          return this.updateSeries(data)
        })
        .then(series => {
          return resolve(series)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   * updateSeries
   * @param data
   * @returns {Promise.<proxyRouter>}
   */
  updateSeries(data) {
    // console.log('RouterService.updateSeries',data)
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService

      if (this.app.config.proxyRouter.force_fl) {
        RouterFLService.updateSeries(data)
          .then(destroyed => {
            // Mock the DB return
            return resolve(destroyed)
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        let updated
        RouterDBService.updateSeries(data)
          .then(destroyedRecord => {
            updated = destroyedRecord
            return RouterFLService.updateSeries(data)
          })
          .then(updatedFile => {
            return resolve(updated)
          })
          .catch(err => {
            return reject(err)
          })
      }
    })
  }

  /**
   * removeSeries
   * @param data
   * @returns {Promise.<proxyRouter>}
   */
  removeSeries(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService
      this.resolveIdentifier(data.identifier, !this.app.config.proxyRouter.force_fl)
        .then(identifier => {
          this.app.log.debug('routerservice:addSeries identifier', identifier)
          if (!identifier.path && !identifier.id) {
            throw new Errors.FoundError(Error(`Can not resolve ${data.identifier}, make sure it is in "path" format eg. '/hello/world'`))
          }
          // Setup Data for addSeries
          delete data.identifier
          data.path = identifier.path
          data.id = identifier.id

          // console.log('RouterService.removeSeries',identifier.path)
          return RouterFLService.resolveFlatFileSeriesFromString(identifier.path).path
        })
        .then(resolvedPath => {
          // Add the Series Path
          data.seriesPath = resolvedPath
          if (this.app.config.proxyRouter.force_fl) {
            return RouterFLService.checkIfDir(data.seriesPath)
          }
          else {
            return RouterDBService.checkIfRecord({path: data.path})
          }
        })
        .then(isCreated => {
          console.log('RouterService.removeSeries', isCreated)
          if (!isCreated) {
            throw new Errors.FoundError(Error(`${data.path} does not exist and can not have a series removed from it.`))
          }
          return this.destroySeries(data)
        })
        .then(series => {
          return resolve(series)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   * destroySeries
   * @param data
   * @returns {Promise.<proxyRouter>}
   */
  destroySeries(data) {
    return new Promise((resolve, reject) => {
      const RouterFLService = this.app.services.RouterFLService
      const RouterDBService = this.app.services.RouterDBService

      if (this.app.config.proxyRouter.force_fl) {
        RouterFLService.destroySeries(data)
          .then(destroyed => {
            // Mock the DB return
            return resolve(destroyed)
          })
          .catch(err => {
            return reject(err)
          })
      }
      else {
        let destroyed
        RouterDBService.destroySeries(data)
          .then(destroyedRecord => {
            destroyed = destroyedRecord
            return RouterFLService.destroySeries(data)
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
}
