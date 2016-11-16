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
  bindToDB(req, res) {
    const RouterBindToDBService = this.app.services.RouterBindToDBService
    RouterBindToDBService.build()
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
  bindToFL(req, res) {
    const RouterBindToFLService = this.app.services.RouterBindToFLService
    RouterBindToFLService.build()
      .then(()=>{
        return res.sendStatus(200)
      })
      .catch((err)=>{
        return res.serverError(err, req, res)
      })
  }
}

