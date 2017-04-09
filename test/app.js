'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const lib = require('../lib')

const packs = [
  require('trailpack-router'),
  require('trailpack-proxy-engine'),
  require('trailpack-proxy-generics'),
  require('../') // trailpack-proxy-route
]


const SERVER = process.env.SERVER || 'express'
const ORM = process.env.ORM || 'sequelize'
const DIALECT = process.env.DIALECT || 'sqlite'
let web = {}

const stores = {
  sqlitedev: {
    adapter: require('sails-disk')
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
  packs.push(require('trailpack-sequelize'))
  if (DIALECT == 'postgres') {
    stores.sqlitedev = {
      database: 'ProxyRouter',
      host: '127.0.0.1',
      dialect: 'postgres',
      username: 'scott'
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
        path: '/*',
        handler: 'RouteController.view'
      },
      {
        method: [ 'GET' ],
        path: '/hello/:world',
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
      forceFL: true,
      // The number of controls to enqueue before flushing to processor.
      flushAt: 20,
      // The number of milliseconds to wait before flushing the queue automatically to processor.
      flushAfter: 10000,
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
      worker: 'test'
    }
  }
}
const dbPath = __dirname + './test.sqlite'
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
