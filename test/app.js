'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const lib = require('../lib')

const packs = [
  smokesignals.Trailpack,
  require('trailpack-core'),
  require('trailpack-router'),
  require('../') // trailpack-proxy-route
]


const SERVER = process.env.SERVER || 'express'
const ORM = process.env.ORM || 'sequelize'
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
    database: 'dev',
    storage: './.tmp/jsdata.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}
else if (ORM === 'sequelize') {
  packs.push(require('trailpack-sequelize'))
  stores.sqlitedev = {
    database: 'dev',
    storage: './.tmp/sequelize.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
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
        'proxyroute',
        'router',
        'www',
        '404',
        '500'
      ],
      proxyroute: (req, res, next) => {
        return lib.Middleware.proxyroute(req, res, next)
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
    proxyrouter: {
      // Default Threshold
      threshold: 10,
      // Default Baseline
      baseline: 0.75,
      // Default Weight
      weight: 50,
      // Default Flat File Folder
      folder: 'content',
      // Force Flat File and ignore DB
      forceFL: true,
      // Cache
      cache: {

      },
      // Remarkable
      remarkable: {
        options: {
          html: true
        },
        plugins: [
          {
            plugin: require('remarkable-meta'),
            options: {}
          }
        ]
      }
    }
  }
}
const dbPath = __dirname + '/../.tmp/sqlitedev.db'
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
