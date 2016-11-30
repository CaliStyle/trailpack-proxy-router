/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const Service = require('trails-service')
const _ = require('lodash')
const Remarkable = require('remarkable')
const meta = require('../../lib/remarkable/meta')
// const components = require('../../lib/remarkable/components')

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
    // Set options
    options = _.defaults(options, this.app.config.proxyroute.remarkable.options)
    // console.log('RouterRenderService._init', options)

    // Make new instance
    const md = new Remarkable('full', options)
    // Add remarkable meta
    md.use(meta)
    // Add remarkable components
    // md.use(components)
    // Set Plugins additional plugins
    _.each(this.app.config.proxyroute.remarkable.plugins, (plugin) => {
      if (!plugin.options) {
        plugin.options = {}
      }
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
    const remarkable = this._init(options)
    const renderedDocument =  remarkable.render(document)
    // console.log('RouterRenderService.render', renderedDocument, remarkable.meta)
    return {
      page: renderedDocument,
      meta: remarkable.meta
    }
  }
}

