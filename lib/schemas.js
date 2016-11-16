'use strict'
const joi = require('joi')

module.exports = {
  databaseConfig: joi.object().keys({
    orm: joi.string(),
    models: joi.object().keys({
      defaultStore: joi.string().required(),
      migrate: joi.string()
    }),
    stores: joi.object()
  }),
  proxyrouteConfig: joi.object().keys({
    // Default Threshold
    threshold: joi.number().required(),
    // Default Baseline
    baseline: joi.number().required(),
    // Default Weight
    weight: joi.number().required(),
    // Default Flat File Folder
    folder: joi.string().required()
  }),
  proxyrouteMiddleware: joi.object().keys({
    order: joi.array().items(joi.string(), joi.string().label('proxyroute').required()),
    proxyroute: joi.func()
  }).unknown()
}
