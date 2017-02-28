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
      listen: [
        'trailpack:proxy-engine:configured',
        'trailpack:proxy-generics:configured',
      ],

      /**
       * List of events emitted by the configure lifecycle method
       */
      emit: [
        'trailpack:proxy-router:configured'
      ]
    },
    initialize: {
      listen: [
        // Should wait til after routes have been fully Initialized before adding to them.
        // 'trailpack:router:initialized'
        // Should wait til after proxy engine has been initialized
        'trailpack:proxy-engine:initialized',
        'trailpack:proxy-generics:configured'
      ],
      emit: [
        'trailpack:proxy-router:initialized'
      ]
    }
  }
}

