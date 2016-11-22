'use strict'

const Service = require('trails-service')
const _ = require('lodash')
/**
 * @module RouterRenderService
 * @description Render Service
 */
module.exports = class RouterRenderService extends Service {
  /**
   * _init Initializes a new instance of Remarkable with Plugins
   * @param options
   * @returns {Instance} remarkable instance
   * @private
   */
  _init(options) {
    // Default the options
    if (!options) {
      options = {}
    }
    // Import remarkable
    const Remarkable = require('remarkable')
    // Make new instance
    const md = new Remarkable()
    // Set options
    options = _.defaults(options, this.app.config.proxyroute.remarkable.options)
    md.set(options)
    // Set Plugins
    _.each(this.app.config.proxyroute.remarkable, (plugin) => {
      md.use(plugin.plugin, plugin.options)
    })
    return md
  }

  /**
   * render
   * @param document
   * @param {Object} options (optional)
   * @returns {meta, page} remarkable meta rendered document
   */
  render(document, options) {
    const md = this._init(options)
    return md.render(document)
  }
}

