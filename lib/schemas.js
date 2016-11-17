'use strict'
const joi = require('joi')

module.exports = {
  // Validate a datbase config
  databaseConfig: joi.object().keys({
    orm: joi.string(),
    models: joi.object().keys({
      defaultStore: joi.string().required(),
      migrate: joi.string()
    }),
    stores: joi.object()
  }),

  // Validate config.proxyroute or
  proxyrouteConfig: joi.object().keys({
    // Default Threshold
    threshold: joi.number().required(),
    // Default Baseline
    baseline: joi.number().required(),
    // Default Weight
    weight: joi.number().required(),
    // Default Flat File Folder
    folder: joi.string().required(),
    // Force Flat File and ignore DB
    forceFL: joi.boolean().required()
  }),

  // Validate web.middlewares
  proxyrouteMiddleware: joi.object().keys({
    order: joi.array().items(joi.string(), joi.string().label('proxyroute').required()),
    proxyroute: joi.func()
  }).unknown(),
  // Validate an addRun control
  addRun: joi.object().keys({
    state: joi.string().required(),
    demographic: joi.string(),
    payload: joi.object().required()
  }),
  // Validate a positive control
  positive: joi.object().keys({
    state: joi.string().required(),
    demographic: joi.string(),
    payload: joi.object().required()
  }),

  // Validate a negative control
  negative: joi.object().keys({
    state: joi.string().required(),
    demographic: joi.string(),
    payload: joi.object().required()
  })
}
