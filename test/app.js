'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const ModelPassport = require('trailpack-proxy-passport/api/models/User')
const ModelPermissions = require('trailpack-proxy-permissions/api/models/User')
const lib = require('../lib')
const Controller = require('trails/controller')

const packs = [
  require('trailpack-router'),
  require('trailpack-proxy-engine'),
  require('trailpack-proxy-generics'),
  require('trailpack-proxy-passport'),
  require('trailpack-proxy-permissions'),
  require('trailpack-proxy-sitemap'),
  require('../') // trailpack-proxy-route
]


const SERVER = process.env.SERVER || 'express'
const ORM = process.env.ORM || 'sequelize'
const DIALECT = process.env.DIALECT || 'sqlite'
let web = {}

const stores = {
  sqlitedev: {
    adapter: require('sails-disk')
  },
  uploads: {
    database: 'ProxyPermissions',
    storage: './test/test.uploads.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}

if (ORM === 'waterline') {
  packs.push(require('trailpack-waterline'))
}
else if (ORM === 'js-data') {
  packs.push(require('trailpack-js-data'))
  stores.sqlitedev = {
    database: 'ProxyRouter',
    storage: './test/jsdata.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}
else if (ORM === 'sequelize') {
  packs.push(require('trailpack-proxy-sequelize'))
  if (DIALECT == 'postgres') {
    stores.sqlitedev = {
      database: 'ProxyRouter',
      host: '127.0.0.1',
      dialect: 'postgres'
    }
  }
  else {
    stores.sqlitedev = {
      database: 'ProxyRouter',
      storage: './test/test.sqlite',
      host: '127.0.0.1',
      dialect: 'sqlite'
    }
  }
}

if ( SERVER == 'express' ) {
  packs.push(require('trailpack-express'))
  web = {
    express: require('express'),
    middlewares: {
      order: [
        'static',
        'addMethods',
        'cookieParser',
        'session',
        'bodyParser',
        'passportInit',
        'passportSession',
        'methodOverride',
        'proxyRouter',
        'router',
        'www',
        '404',
        '500'
      ],
      proxyRouter: (req, res, next) => {
        return lib.Middleware.proxyRouter(req, res, next)
      },
      static: require('express').static('test/static')
    }
  }
}

const App = {
  pkg: {
    name: 'proxy-route-trailpack-test',
    version: '1.0.0'
  },
  api: {
    models: {
      User: class User extends ModelPassport {
        static config(app, Sequelize) {
          return {
            options: {
              underscored: true,
              classMethods: {
                associate: (models) => {
                  ModelPassport.config(app, Sequelize).options.classMethods.associate(models)
                  ModelPermissions.config(app, Sequelize).options.classMethods.associate(models)
                },
                findByIdDefault: ModelPermissions.config(app, Sequelize).options.classMethods.findByIdDefault,
                findOneDefault: ModelPermissions.config(app, Sequelize).options.classMethods.findOneDefault,
                resolve: ModelPassport.config(app, Sequelize).options.classMethods.resolve
              },
              instanceMethods: {
                getSalutation: ModelPassport.config(app, Sequelize).options.instanceMethods.getSalutation,
                resolvePassports: ModelPassport.config(app, Sequelize).options.instanceMethods.resolvePassports,
                resolveRoles: ModelPermissions.config(app, Sequelize).options.instanceMethods.resolveRoles
              }
            }
          }
        }
      }
    },
    controllers: {
      TestController: class TestController extends Controller {
        test(req, res) {
          if (req.proxyRouter.document || req.proxyRouter.meta) {
            return res.serverError('THIS SHOULD NOT HAVE A PROXY ROUTER OBJECT')
          }
          return res.sendStatus(200)
        }
      }
    }
  },
  config: {
    database: {
      stores: stores,
      models: {
        defaultStore: 'sqlitedev',
        migrate: 'drop'
      }
    },
    routes: [
      {
        method: [ 'GET' ],
        path: '/html',
        handler: 'RouteController.view'
      },
      {
        method: [ 'GET' ],
        path: '/hello/:world',
        handler: 'RouteController.view'
      },
      {
        method: [ 'GET', 'POST' ],
        path: '/hello/ignore',
        handler: 'TestController.test',
        config: {
          app: {
            proxyRouter: {
              ignore: true
            }
          }
        }
      },
      {
        method: [ 'GET' ],
        path: '/*',
        handler: 'RouteController.view'
      }
    ],
    main: {
      packs: packs
    },
    policies: {

    },
    web: web,
    log: {
      logger: new smokesignals.Logger('debug')
    },
    proxyRouter: {
      // The Default Extension
      default_extension: '.md',
      // Default Threshold
      threshold: 10,
      // Default Baseline
      baseline: 0.75,
      // Default Weight
      weight: 50,
      // Default Flat File Folder
      folder: 'content',
      // Default name for "series"
      series: 'series',
      // Force Flat File and ignore DB
      force_fl: true,
      // The number of controls to enqueue before flushing to processor.
      flush_at: 20,
      // The number of milliseconds to wait before flushing the queue automatically to processor.
      flush_after: 10000,
      // Cache
      cache: {
        // The redis datastore prefix
        prefix: 'pxy',
        // Allow Caching
        allow: false,
        // Milliseconds before cache is ejected
        eject: 10000
      },
      // If multi-site is enabled either false or an array e.g. ['website1.com','website2.com']
      multisite: false
    },
    proxyGenerics: {},
    proxyEngine: {
      live_mode: false,
      profile: 'test'
    },
    proxyPassport: {
      strategies: {
        local: {
          strategy: require('passport-local').Strategy
        }
      }
    },
    proxySitemap: {
      host: 'https://test.com',
      cache: 100000
    },
    proxyPermissions: {
      defaultRole: 'public',
      defaultRegisteredRole: 'registered',
      modelsAsResources: true,
      fixtures: {
        roles: [{
          name: 'admin',
          public_name: 'Admin'
        }, {
          name: 'registered' ,
          public_name: 'Registered'
        }, {
          name: 'public' ,
          public_name: 'Public'
        }],
        permissions: []
      },
      defaultAdminUsername: 'admin',
      defaultAdminPassword: 'admin1234'
    },
  }
}
const dbPath = __dirname + './test.sqlite'
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
