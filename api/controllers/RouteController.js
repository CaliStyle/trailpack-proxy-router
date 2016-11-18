'use strict'

const Controller = require('trails-controller')

/**
 * @module RouteController
 * @description Generated Trails.js Controller.
 */
module.exports = class RouteController extends Controller {
  /**
   * view
   * @param req
   * @param res
   * @returns html or error
   */
  view(req, res) {
    if (req.proxyroute) {
      // const RouterControlsService = req.trailsApp.services.RouterControlsService
      // Send addRun and continue immediately
      // RouterControlsService.addRun(req.proxyroute)
      if (!req.wantsJSON) {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(req.proxyroute.page)
        res.end()
        return
      }
      else {
        return res.json(req.proxyroute)
      }
    }
    return res.sendStatus(404)
  }
  /**
   * Make Flat File Manifest in Route Database
   * @param {Object} req
   * @param {Object} res
   */
  buildToDB(req, res) {
    const RouterDBService = this.app.services.RouterDBService
    RouterDBService.build()
      .then(()=>{
        return res.sendStatus(200)
      })
      .catch((err)=>{
        return res.serverError(err, req, res)
      })

  }

  /**
   * Manifest Route Database into Flat File
   * @param {Object} req
   * @param {Object} res
   */
  buildToFL(req, res) {
    const RouterFLService = this.app.services.RouterFLService
    RouterFLService.build()
      .then(()=>{
        return res.sendStatus(200)
      })
      .catch((err)=>{
        return res.serverError(err, req, res)
      })
  }

  /**
   * addPage
   * @param {Object} req
   * @param {Object} res
   */
  addPage(req, res) {
    const RouterService = this.app.services.RouterService
    RouterService.addPage(req.params.body)
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * updatePage
   * @param {Object} req
   * @param {Object} res
   */
  updatePage(req, res) {
    const RouterService = this.app.services.RouterService
    RouterService.updatePage(req.params.body)
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * removePage
   * @param {Object} req
   * @param {Object} res
   */
  removePage(req, res) {
    const RouterService = this.app.services.RouterService
    RouterService.removePage(req.params.body)
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * addSeries
   * @param {Object} req
   * @param {Object} res
   */
  addSeries(req, res) {
    const RouterService = this.app.services.RouterService
    RouterService.addSeries(req.params.body)
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * removeSeries
   * @param {Object} req
   * @param {Object} res
   */
  removeSeries(req, res) {
    const RouterService = this.app.services.RouterService
    RouterService.removeSeries({})
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * updateSeries
   * @param {Object} req
   * @param {Object} res
   */
  updateSeries(req, res) {
    const RouterService = this.app.services.RouterService
    RouterService.updateSeries({})
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   * control
   * @param {Object} req
   * @param {Object} res
   */
  control(req, res) {
    const RouterControlsService = this.app.services.RouterControlsService
    const type = req.params.type
    if (!type || (type !== ('positive' || 'negative'))) {
      const err = new Error()
      err.status(403)
      err.message('Type of control is required to be positive or negative')
      return res.serverError(err)
    }
    RouterControlsService[type](req.params.body)
      .then(data => {
        return res.json(data)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}
