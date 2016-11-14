'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')

module.exports = _.defaultsDeep({
  pkg: {
    name: require('../package').name + '-test'
  },
  api: {
    models: { },
    controllers: { },
    services: { }
  },
  config: {
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-sequelize'),
        require('trailpack-core'),
        require('../')
      ]
    },
    database: {
      stores: {
        postgresTest: {
          database: 'ProxyCart',
          host: '127.0.0.1',
          dialect: 'postgres',
          username: 'postgres',
          password: 'admin',
          logging: false
        }
      },
      models: {
        defaultStore: 'postgresTest',
        migrate: 'drop'
      }
    }
  }
}, smokesignals.FailsafeConfig)


