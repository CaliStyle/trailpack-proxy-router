/**
 * Proxy-Router Configuration
 *
 * @see {@link http://
 */
module.exports = {
  // Default Threshold
  threshold: 100,
  // Default Baseline
  baseline: 0.75,
  // Default Weight
  weight: 50,
  // Default Flat File Folder
  folder: 'content',
  // Force Flat File and ignore DB
  forceFL: true,
  // The number of controls to enqueue before flushing to processor.
  flushAt: 20,
  // The number of milliseconds to wait before flushing the queue automatically to processor.
  flushAfter: 10000,
  // Cache Service
  cache: {
    // The redis datastore prefix
    prefix: 'pxy',
    // Allow Caching
    allow: true,
    // Milliseconds before cache is ejected
    eject: 10000
  },
  // Hooks for events
  // hooks: {
  //   beforeControl: (data) => {
  //
  //   },
  //   afterControl: (data) => {
  //
  //   }
  // },
  // Remarkable
  remarkable: {
    // Options for Remarkable
    options: {
      // Must always be set to true
      html: true
    },
    plugins: [
      // Example Plugin (remarkable-meta is required and already installed)
      // {
      //   plugin: require('remarkable-meta'),
      //   options: {}
      // }
    ]
  }
}
