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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteBuildToDB',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteBuildToFl',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteAddPage',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteEditPage',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiDeleteRouteRemovePage',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteAddSeries',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteEditSeries',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiDeleteRouteRemoveSeries',
          roles: ['admin']
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
        proxyRouter: {
          ignore: true
        },
        proxyPermissions: {
          resource_name: 'apiPostRouteControl',
          roles: ['admin']
        }
      }
    }
  }
]
