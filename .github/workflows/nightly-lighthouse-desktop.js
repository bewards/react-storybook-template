const desktopConfig = require('lighthouse/lighthouse-core/config/desktop-config')

// configuration only used for nightly lighthouse run against the real site
// using RP public website since this best-practices app isn't actually deployed anywhere
module.exports = {
  ci: {
    collect: {
      ...desktopConfig,
      url: ['http://rp-react-best-practices.s3-website-us-east-1.amazonaws.com/'],
    },
    assert: {
      assertions: {
        // choose what to error/warn on at what values based on your needs
        // warnings do not stop your run, nor are they surfaced out of the task - you have to expand the `lhci autorun` task in the action to see them
        // using very loose targets for these, as the current site doens't get very good scores - your app should be able to do better
        'is-on-https': ['error', { minScore: 1, aggregationMethod: 'pessimistic' }],
        'largest-contentful-paint': ['error', { minScore: 0.01, aggregationMethod: 'optimistic' }],
        'speed-index': ['error', { minScore: 0.01, aggregationMethod: 'optimistic' }],
        'cumulative-layout-shift': ['error', { minScore: 0.01, aggregationMethod: 'optimistic' }],

        // rightpoint.com currently has a console error, so this is set to warn
        'errors-in-console': ['warn', { minScore: 1, aggregationMethod: 'pessimistic' }],
      },
    },
    upload: desktopConfig.upload,
  },
}
