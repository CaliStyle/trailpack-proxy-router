'use strict'
// const joi = require('joi')
const Schemas = require('./schemas')

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
      validate: {
        // body: Schemas.pageData
      },
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['PUT','POST'],
    path: '/route/editPage',
    handler: 'RouteController.editPage',
    config: {
      validate: {
        // body: Schemas.page
      },
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
      validate: {
        // body: Schemas.pageRemove
      },
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
      validate: {
        // body: Schemas.series
      },
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  },
  {
    method: ['PUT','POST'],
    path: '/route/editSeries',
    handler: 'RouteController.editSeries',
    config: {
      validate: {
        // body: Schemas.series
      },
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
      validate: {
        // body: Schemas.seriesRemove
      },
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
      validate: {
        query: Schemas.controlQuery
        // body: Schemas.controlData
      },
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  }
]
