'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')

module.exports = _.defaultsDeep({
  pkg: {
    name: require('../package').name + '-test'
  },
  // api: {
  //   models: { },
  //   controllers: { },
  //   services: { }
  // },
  config: {
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-core'),
        require('trailpack-express'),
        require('trailpack-sequelize'),
        require('../')
      ]
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
    views: {
      // engine: 'ejs'
    },
    database: {
      stores: {
        postgresTest: {
          logging: false,
          dialect: 'postgres',
          database: 'circle_test',
          host: 'localhost',
          user: 'ubuntu',
          password: '',
          port: 5432,
          ssl: false
          // database: 'ProxyCart',
          // host: '127.0.0.1',
          // dialect: 'postgres',
          // username: 'scott',
          // // password: 'admin',
          // logging: false
        }
      },
      models: {
        defaultStore: 'postgresTest',
        migrate: 'drop'
      }
    },
    proxyrouter: {
      // Default Threshold
      threshold: 100,
      // Default Baseline
      baseline: 0.75,
      // Default Weight
      weight: 50
    }
  }
}, smokesignals.FailsafeConfig)


