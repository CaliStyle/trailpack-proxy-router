/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */
/* eslint new-cap: [0] */
'use strict'

const Model = require('trails-model')
const _ = require('lodash')
const TESTS = require('../utils/enums').TESTS
// const helpers = require('../utils/helpers')

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
          classMethods: {
            /**
             * Expose tests enums
             */
            TESTS: TESTS,
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

  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
        // non-unique url can be a normal string or regex (should match the regex of a Route model)
        url: {
          type: Sequelize.STRING,
          allowNull: false
        },
        // The version of this route and series test,
        version: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '0.0.0' // Matches SemVer
        },
        // Series test: default is 'a0'
        test: {
          type: Sequelize.ENUM,
          values: _.values(TESTS),
          defaultValue: TESTS.A0
        },
        // Meta of the page
        // meta: helpers.JSON(this, app, Sequelize, 'meta', {
        //   defaultValue: {}
        // }),
        // {
        //   type: // Sequelize.JSONB,
        //   defaultValue: {}
        // },
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
