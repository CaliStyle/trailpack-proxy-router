/* eslint new-cap: [0] */
'use strict'

const Model = require('trails/model')
const _ = require('lodash')
const SERIES = require('../utils/enums').SERIES
const helpers = require('proxy-engine-helpers')

/**
 * @module RouteDocument
 * @description Route Document model
 */
module.exports = class RouteDocument extends Model {

  static config (app, Sequelize) {
    let config = {}

    if (app.config.database.orm === 'sequelize') {
      config = {
        options: {
          underscored: true,
          classMethods: {
            /**
             * Expose SERIES enums
             */
            SERIES: SERIES,
            /**
             * Associate Models
             */
            associate: (models) => {
              models.RouteDocument.belongsTo(models.Route, {
                // as: 'route_id',
                onDelete: 'CASCADE'
                // ,
                // foreignKey: {
                //   primaryKey: true,
                //   name: 'routePath',
                //   allowNull: false
                // }
              })
            }
          },
          hooks: {
            // Combine meta and content into document
            afterCreate: (values, options, fn) => {

              fn()
            },
            // Combine meta and content into document
            afterUpdate: (values, options, fn) => {

              fn()
            }
          }
        }
      }
    }
    return config
  }
  // TODO a way to track positive and negative controls. This would require huge volumes of storage, hadoop?
  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
        // non-unique url can be a normal string or regex (should match the regex of a Route model)
        // url: {
        //   type: Sequelize.STRING,
        //   allowNull: false
        // },
        // The Page this Document belongs to
        // parent: {
        //   type: Sequelize.String
        // },

        // The host if using Multi-Site, localhost if not using Multi-Site
        host: {
          type: Sequelize.STRING,
          defaultValue: 'localhost'
        },
        // The version of this route and series test,
        version: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '0.0.0' // Matches SemVer
        },
        // Series test: default is 'a0'
        series: {
          type: Sequelize.ENUM,
          values: _.values(SERIES),
          defaultValue: SERIES.A0
        },
        // Meta of the page
        meta: helpers.JSONB('routedocument', app, Sequelize, 'meta', {
          defaultValue: {
            title: '',
            keywords: '',
            runs: 0,
            score: 0.0
          }
        }),
        // The body of a page in HTML and/or Markdown
        content: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        // Markdown doc with yaml, the combination of `meta` and `content` composed after meta or content are created/updated.
        document: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        // An optional style sheet to be applied to the Route Document
        stylesheet: {
          type: Sequelize.TEXT,
          allowNull: true
        }
      }
    }
    return schema
  }
}
