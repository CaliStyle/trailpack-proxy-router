module.exports = [
  {
    method: ['POST'],
    path: '/route/buildToDB',
    handler: 'RouteController.buildToDB',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/route/buildToFL',
    handler: 'RouteController.buildToFL',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/route/addPage',
    handler: 'RouteController.addPage',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['PUT','POST'],
    path: '/route/updatePage',
    handler: 'RouteController.updatePage',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['DELETE','POST'],
    path: '/route/removePage',
    handler: 'RouteController.removePage',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/route/addSeries',
    handler: 'RouteController.addSeries',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['DELETE','POST'],
    path: '/route/removeSeries',
    handler: 'RouteController.removeSeries',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['PUT','POST'],
    path: '/route/updateSeries',
    handler: 'RouteController.updateSeries',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/route/control',
    handler: 'RouteController.control',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  }
]
