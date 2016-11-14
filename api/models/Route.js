/* eslint new-cap: [0] */
'use strict'

const Model = require('trails-model')

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

            }
          }
        }
      }
    }
    return config
  }

  static schema(app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
        // Array of Variation Tests to run
        series: {
          type: Sequelize.ARRAY(Sequelize.JSON)
        },
        // The weight score for a series test
        weight: {
          type: Sequelize.INTEGER,
          defaultValue: app.config.proxyrouter.weight
        },
        // The amount of runs required to auto serve a test series to a demographic once the baseline is met
        threshold: {
          type: Sequelize.INTEGER,
          defaultValue: app.config.proxyrouter.threshold
        },
        // the lowest score before the threshold can take over.
        baseline: {
          type: Sequelize.FLOAT,
          defaultValue: app.config.proxyrouter.baseline
        },
        // Array of Series run for particular demographics
        demographic: {
          type: Sequelize.ARRAY(Sequelize.JSON),
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
        },
        // id of the parent of the route. Could be a Relationship?
        parent: {
          type: Sequelize.STRING,
          allowNull: false
        },
        // array of siblings route ids. Could be a relationship?
        siblings: {},
        // array of children route ids. Could be a relationship?
        children: {},
        // Timestamp the Route was Created
        created: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        // Timestamp the Route was Updated
        updated: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }
    }
    return schema
  }
}
