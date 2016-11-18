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
  // Cache
  cache: {
    // The redis prefix
    prefix: 'pxy'
  },
  // Remarkable
  remarkable: {
    // Options for Remarkable
    options: {
      // Must always be set to true
      html: true
    },
    plugins: [
      // Required Plugin
      {
        plugin: require('remarkable-meta'),
        options: {}
      }
    ]
  }
}
