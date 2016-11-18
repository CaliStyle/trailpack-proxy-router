const _ = require('lodash')
const routes = require('./routes')

module.exports = {
  init: (app) => {
    // const proxyroute = app.services.ProxyRouteService.proxyroute
  },
  addRoutes: (app) => {
    const prefix = _.get(app.config, 'proxyroute.prefix') || _.get(app.config, 'footprints.prefix')
    const routerUtil = app.packs.router.util
    if (prefix){
      routes.forEach(route => {
        route.path = prefix + route.path
      })
    }
    app.config.routes = routerUtil.mergeRoutes(routes, app.config.routes)
  }
}
