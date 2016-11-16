'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')

const packs = [
  smokesignals.Trailpack,
  require('trailpack-core'),
  require('trailpack-router'),
  require('trailpack-express'),
  require('../') // trailpack-proxy-route
]

const ORM = process.env.ORM || 'sequelize'

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
    main: {
      packs: packs
    },
    policies: {

    },
    web: {
      express: require('express'),
      middlewares: {
        order: [
          'addMethods',
          'cookieParser',
          'session',
          'bodyParser',
          'passportInit',
          'passportSession',
          'methodOverride',
          'router',
          'www',
          '404',
          '500'
        ]
      }
    },
    proxyrouter: {
      // Default Threshold
      threshold: 100,
      // Default Baseline
      baseline: 0.75,
      // Default Weight
      weight: 50,
      // Default Flat File Folder
      folder: 'content'
    }
  }
}
const dbPath = __dirname + '/../.tmp/sqlitedev.db'
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
