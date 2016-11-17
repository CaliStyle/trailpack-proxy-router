'use strict'

const Controller = require('trails-controller')

/**
 * @module RouteController
 * @description Generated Trails.js Controller.
 */
module.exports = class RouteController extends Controller {
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
}
