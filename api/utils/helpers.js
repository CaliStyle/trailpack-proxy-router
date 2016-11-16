/* eslint new-cap: [0] */
/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const _ = require('lodash')

module.exports = {
  JSON: (cls, app, Sequelize, field, options) => {
    const database = app.config.database

    let sJSON

    if (database.models[cls]) {
      if (database.stores[database.models[cls].store].dialect == 'postgres') {
        sJSON = () => {
          return _.defaults(options, {
            type: Sequelize.JSON
          })
        }
      }
    }
    else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
      sJSON = () => {
        return _.defaults(options, {
          type: Sequelize.JSON
        })
      }
    }
    else {
      sJSON = (field) =>{
        if (_.isObject(options.defaultValue)) {
          options.defaultValue = JSON.stringify(options.defaultValue)
        }
        return _.defaults(options, {
          type: Sequelize.STRING,
          get: function() {
            return JSON.parse(this.getDataValue(field))
          },
          set: function(val) {
            return this.setDataValue(field, JSON.stringify(val))
          }
        })
      }
    }

    return sJSON(field)
  },
  JSONB: (cls, app, Sequelize, field, options) => {
    const database = app.config.database

    let sJSONB

    if (database.models[cls]) {
      if (database.stores[database.models[cls].store].dialect == 'postgres') {
        sJSONB = () => {
          return _.defaults(options, {
            type: Sequelize.JSONB
          })
        }
      }
    }
    else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
      sJSONB = () => {
        return _.defaults(options, {
          type: Sequelize.JSONB
        })
      }
    }
    else {
      sJSONB = (field) =>{
        if (_.isObject(options.defaultValue)) {
          options.defaultValue = JSON.stringify(options.defaultValue)
        }
        return _.defaults(options, {
          type: Sequelize.STRING,
          get: function() {
            return JSON.parse(this.getDataValue(field))
          },
          set: function(val) {
            return this.setDataValue(field, JSON.stringify(val))
          }
        })
      }
    }
    return sJSONB(field)
  },
  ARRAY: (cls, app, Sequelize, type, field, options) => {
    const database = app.config.database
    // console.log(database.models.defaultStore)
    let sARRAY

    if (database.models[cls]) {
      if (database.stores[database.models[cls].store].dialect == 'postgres') {
        sARRAY = (type) => {
          return _.defaults(options, {
            type: Sequelize.ARRAY(type)
          })
        }
      }
    }
    else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
      sARRAY = (type) => {
        return _.defaults(options, {
          type: Sequelize.ARRAY(type)
        })
      }
    }
    else {
      sARRAY = (type, field) => {
        if (_.isObject(options.defaultValue)) {
          options.defaultValue = JSON.stringify(options.defaultValue)
        }
        return _.defaults(options, {
          type: Sequelize.STRING,
          get: function() {
            return JSON.parse(this.getDataValue(field))
          },
          set: function(val) {
            return this.setDataValue(field, JSON.stringify(val))
          }
        })
      }
    }
    return sARRAY(type, field)
  }
}
