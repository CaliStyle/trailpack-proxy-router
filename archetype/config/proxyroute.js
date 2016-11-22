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
  // The number of controls to enqueue before flushing.
  flushAt: 20,
  // The number of milliseconds to wait before flushing the queue automatically.
  flushAfter: 10000,
  // Cache
  cache: {

  },
  // Remarkable
  remarkable: {
    options: {
      html: true
    },
    plugins: [
      {
        plugin: require('remarkable-meta'),
        options: {}
      }
    ]
  }
}
