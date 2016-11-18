module.exports = [
  {
    method: ['POST'],
    path: '/route/buildToDB',
    handler: 'RouteController.buildToDB'
  },
  {
    method: ['POST'],
    path: '/route/buildToFL',
    handler: 'RouteController.buildToFL'
  },
  {
    method: ['POST'],
    path: '/route/addPage',
    handler: 'RouteController.addPage'
  },
  {
    method: ['PUT','POST'],
    path: '/route/updatePage',
    handler: 'RouteController.updatePage'
  },
  {
    method: ['DELETE','POST'],
    path: '/route/removePage',
    handler: 'RouteController.removePage'
  },
  {
    method: ['POST'],
    path: '/route/addSeries',
    handler: 'RouteController.addSeries'
  },
  {
    method: ['DELETE','POST'],
    path: '/route/removeSeries',
    handler: 'RouteController.removeSeries'
  },
  {
    method: ['PUT','POST'],
    path: '/route/updateSeries',
    handler: 'RouteController.updateSeries'
  }
]
