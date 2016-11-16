/* eslint new-cap: [0] */
'use strict'

const _ = require('lodash')

module.exports = {
  JSON: (cls, app, Sequelize, field, options) => {
    const database = app.config.database

    let sJSON = (field) =>{
      return _.defaults(options, {
        type: Sequelize.STRING,
        get: function() {
          return JSON.parse(cls.getDataValue(field))
        },
        set: function(val) {
          return cls.setDataValue(field, JSON.stringify(val))
        }
      })
    }

    if (database.models[cls.constructor.name.toLowerCase()]) {
      if (database.stores[database.models[cls.constructor.name.toLowerCase()].store].dialect == 'postgres') {
        sJSON = (field) => {
          return _.defaults(options, {
            type: Sequelize.JSON
          })
        }
      }
    }
    else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
      sJSON = (field) => {
        return _.defaults(options, {
          type: Sequelize.JSON
        })
      }
    }

    return sJSON(field)
  },
  ARRAY: (cls, app, Sequelize, options) => {
    const database = app.config.database

    let sARRAY = () => {
      return _.defaults(options, {
        type: Sequelize.STRING
      })
    }

    if (database.models[cls.constructor.name.toLowerCase()]) {
      if (database.stores[database.models[cls.constructor.name.toLowerCase()].store].dialect == 'postgres') {
        sARRAY = () => {
          return _.defaults(options, {
            type: Sequelize.ARRAY(Sequelize.STRING)
          })
        }
      }
    }
    else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
      sARRAY = () => {
        return _.defaults(options, {
          type: Sequelize.ARRAY(Sequelize.STRING)
        })
      }
    }
    return sARRAY()
  }
}
