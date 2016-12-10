/* eslint new-cap: [0] */
'use strict'

const Model = require('trails/model')
const helpers = require('../utils/helpers')

/**
 * @module Route
 * @description Route model
 */
module.exports = class Route extends Model {

  static config(app, Sequelize) {
    let config = {}

    if (app.config.database.orm === 'sequelize') {
      config = {
        options: {
          classMethods: {
            /**
             * Associate Models
             */
            associate: (models) => {
              models.Route.hasMany(models.RouteDocument, {
                as: 'documents',
                onDelete: 'CASCADE'
                // ,
                // foreignKey: {
                //   name: 'routeName',
                //   allowNull: false
                // }
              })
            }
          }
        }
      }
    }
    return config
  }

  static schema(app, Sequelize) {

    // console.log('CONFIG',app.config)

    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
        // The host if using Multi-Site, localhost if not using Multi-Site
        host: {
          type: Sequelize.STRING,
          defaultValue: 'localhost'
        },
        // The path of the Page
        path: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        // Array of Variation Tests to run
        series: helpers.ARRAY('route', app, Sequelize, Sequelize.JSON, 'series', {
          defaultValue: []
        }),
        // {
        //   type: Sequelize.ARRAY(Sequelize.JSON)
        // },
        // The weight score for a series test
        weight: {
          type: Sequelize.INTEGER,
          defaultValue: app.config.proxyRouter.weight
        },
        // The amount of runs required to auto serve a test series to a demographic once the baseline is met
        threshold: {
          type: Sequelize.INTEGER,
          defaultValue: app.config.proxyRouter.threshold
        },
        // the lowest score before the threshold can take over.
        baseline: {
          type: Sequelize.FLOAT,
          defaultValue: app.config.proxyRouter.baseline
        },
        // Array of Series run for particular demographics
        demographics: helpers.ARRAY('route', app, Sequelize, 'demographic', Sequelize.JSON, {
          defaultValue: [
            {
              'unknown': [
                {
                  document: '',
                  runs: 0,
                  score: 0.0
                }
              ]
            }
          ]
        })
        // id of the parent of the route. Could be a Relationship?
        // parent: {
        //   type: Sequelize.STRING
        //   // allowNull: false
        // }
        // array of siblings route ids. Could be a relationship?
        // siblings: {},
        // array of children route ids. Could be a relationship?
        // children: {}
      }
    }
    return schema
  }
}
