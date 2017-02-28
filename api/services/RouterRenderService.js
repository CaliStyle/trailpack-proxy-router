/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const MarkdownIt = require('markdown-it')
const meta = require('markdown-it-meta')

/**
 * @module RouterRenderService
 * @description Render Service
 */
module.exports = class RouterRenderService extends Service {
  /**
   * _init Initializes a new instance of Markdown-it with Plugins
   * @param options
   * @returns {Instance} markdown-it instance
   * @private
   */
  _init(options) {
    // Default the options
    if (!options) {
      options = {}
    }
    // Set options
    options = _.defaults(options, this.app.config.proxyRouter.markdownit.options)
    // console.log('RouterRenderService._init', options)

    // Make new instance
    const md = new MarkdownIt(options)
    // Add markdown-it-meta
    md.use(meta)
    // Set Plugins additional plugins
    _.each(this.app.config.proxyRouter.markdownit.plugins, (plugin) => {
      if (!plugin.options) {
        plugin.options = {}
      }
      md.use(plugin.plugin, plugin.options)
    })
    return md
  }

  /**
   * renders a document into html
   * @param {String} document
   * @param {Object} options (optional)
   * @returns {Object.<{meta: object, document: string}>} markdown-it meta and rendered document
   */
  render(document, options) {
    const md = this._init(options)
    const renderedDocument =  md.render(document)
    return {
      document: renderedDocument,
      meta: md.meta
    }
  }
}

