const Sitemap = require('trailpack-proxy-sitemap').Sitemap

module.exports = class ContentSitemap extends Sitemap {
  content() {
    const map = this.app.services.RouterSitemapService.flatMap()
    this.app.log.debug('CONTENT SITEMAP',map)
    return Promise.resolve([])
  }
}
