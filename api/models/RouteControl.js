'use strict'

const Model = require('trails/model')

/**
 * @module RouteControl
 * @description A record of a Route Control
 * @generator Treefrog for Trails.js Model.
 */
module.exports = class RouteControl extends Model {

  static config (app, Sequelize) {
    let config = {
      options: {
        classMethods: {
          /**
           * Associate Models
           */
          associate: (models) => {
            models.RouteControl.belongsTo(models.Route, {
              as: 'route_id',
              onDelete: 'CASCADE'
              // ,
              // foreignKey: {
              //   primaryKey: true,
              //   name: 'routePath',
              //   allowNull: false
              // }
            }),
            models.RouteControl.belongsTo(models.RouteDocument, {
              as: 'document_id',
              onDelete: 'CASCADE'
              // ,
              // foreignKey: {
              //   primaryKey: true,
              //   name: 'routePath',
              //   allowNull: false
              // }
            })
          }
        }
      }
    }

    if (app.config.database.orm === 'sequelize') {
      config = {}
    }
    return config
  }

  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
        // The Score of this control
        score: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        positive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      }
    }
    return schema
  }
}
