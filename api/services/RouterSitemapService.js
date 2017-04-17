/* eslint no-console: [0] */
'use strict'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const Service = require('trails/service')
// const imageRegex = /\.(gif|jp?g|png|svg)$/

/**
 * @module RouterSitemapService
 * @description Build Sitemap
 */
module.exports = class RouterSitemapService extends Service {
  initFL() {
    const pwd = this.app.config.proxyRouter.folder
    const sitemap = this.buildChildrenFL(pwd)
    return this.app.proxyRouter.sitemap = sitemap
  }
  buildChildrenFL(pwd) {

    if (!pwd) {
      throw 'Please include the absolute path of the directory containing the docs you want to map.'
    }
    const rootPath = path.resolve(this.app.config.proxyRouter.folder)
    const pwdPath = path.resolve(pwd)
    const pwdStat = fs.statSync(pwd)
    const files = fs.readdirSync(pwd)
    const output = {}
    const meta = this.getMetaFL(pwd)

    files.forEach(file => {

      const absolutePath = path.resolve(pwd, file)
      // const extName = path.extname(absolutePath)
      const stat = fs.statSync(absolutePath)

      // If this file is a directory, pass the directory to #buildChirldrenFL, saving the
      // results to output keyed by the directory name
      if (stat.isDirectory() && file !== this.app.config.proxyRouter.series && file.charAt(0) != ':') {
        output[file] = this.buildChildrenFL(absolutePath)
      }

      // If this file is a markdown file, save the file contents to the output
      // object, keyed by the file name.
      // else if (stat.isFile() && extName === '.md') {
      //   output[file] = fs.readFileSync(absolutePath, 'utf8')
      // }
      //
      // else if (stat.isFile() && imageRegex.test(extName)) {
      //   output[file] = fs.readFileSync(absolutePath)
      // }

    })

    return {
      // Fake id to mimic response from DB
      id: null,
      key: this.pathToKey(pwdPath),
      // Link Title
      title: this.getTitleFL(meta.title, pwd),
      // Page Metadata
      meta: meta,
      // Link
      path: `/${ pwdPath.split(rootPath + '/')[1] || '' }`,
      // Children of Link
      children: output,
      // Sitemap.xml lastmod
      lastmod: meta.lastmod || this.dateFormat(pwdStat.mtime),
      // Sitemap.xml changefreq
      changefreq: meta.changefreq || 'weekly',
      // Sitemap.xml priority
      priority: meta.priority || '0.5'
    }
  }

  /**
   *
   * @param pwd {string}
   * @returns {string}
   */
  getTitleFL(title, pwd) {
    // TODO resolve actual title
    return title || path.basename(pwd)
  }

  /**
   *
   * @param pwd {string}
   * @returns {Object}
   */
  getMetaFL(pwd) {
    // TODO resolve actual meta
    return this.app.services.RenderGenericService.renderSync(pwd).meta || {}
  }

  /**
   * Map Update to Sitemap
   * @param key {string}
   * @param payload {Object}
   * @returns {Object}
   */
  mapToSitemap(key, payload) {
    return _.set(this.app.proxyRouter.sitemap, key, payload)
  }

  /**
   * Get Sitemap entry from key
   * @param key {string}
   * @returns {Object}
   */
  keyToSitemap(key) {
    return _.get(this.app.proxyRouter.sitemap, key)
  }
  pathToKey(pwd) {
    const rootPath = path.resolve(this.app.config.proxyRouter.folder)
    let key
    // pwd = pwd.replace(rootPath + '/', '') || ''
    pwd = pwd.split(rootPath + '/')[1] || ''
   // TODO make key from path
    pwd = pwd.split('/')
    if (pwd.length > 0) {
      key = 'children.' + pwd.join('.children.')
    }
    else {
      key = pwd.join('.children.')
    }
    if (key == 'children.') {
      key = ''
    }
    return key
  }
  /**
   *
   * @param date {string}
   * @returns {string}
   */
  dateFormat(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }
    return [year, month, day].join('-')
  }
}
