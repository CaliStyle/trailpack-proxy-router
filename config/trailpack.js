/**
 * Trailpack Configuration
 *
 * @see {@link http://trailsjs.io/doc/trailpack/config
 */
module.exports = {
  type: 'misc',
  /**
   * Configure the lifecycle of this pack; that is, how it boots up, and which
   * order it loads relative to other trailpacks.
   */
  lifecycle: {
    configure: {
      /**
       * List of events that must be fired before the configure lifecycle
       * method is invoked on this Trailpack
       */
      listen: [],

      /**
       * List of events emitted by the configure lifecycle method
       */
      emit: [
        'trailpack:proxyrouter:configured'
      ]
    },
    initialize: {
      listen: [
        // Trailpack-proxy-router should wait til after routes have been fully configured before adding to them.
        'trailpack:router:initialized'
      ],
      emit: [
        'trailpack:proxyrouter:initialized'
      ]
    }
  }
}

