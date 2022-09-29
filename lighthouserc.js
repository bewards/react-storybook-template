module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
    },
    assert: {
      // https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#preset
      preset: 'lighthouse:no-pwa',
      // https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#assertions
      assertions: {
        // https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#levels
        //
        // These are added b/c the no-pwa has these error and fail build.
        'csp-xss': 'warn',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',

        // choose what to error/warn on at what values based on your needs
        // don't check HTTPS here, since the automatic server doens't support that
        // warnings do not stop your build or fail your PR status, nor are they surfaced out of the task - you have to expand the `lhci autorun` task in the action to see them
        // these targets are set _very_ low - for any normal site, you probably want higher targets
        'largest-contentful-paint': ['error', { minScore: 0.2, aggregationMethod: 'optimistic' }],
        'speed-index': ['error', { minScore: 0.2, aggregationMethod: 'optimistic' }],
        'cumulative-layout-shift': ['error', { minScore: 0.2, aggregationMethod: 'optimistic' }],

        // since this sample app as-built isn't designed to run, it gives a 404 on the API call, so we can't assert there are no errors
        // a real app should be able to set this to error, though it might need to run a fake server or the like
        // 'errors-in-console': ['warn', { minScore: 1, aggregationMethod: 'pessimistic' }],
      },
    },
    // this configuration is loaded from .github/workflows/nightly-lighhouse-*.js as well
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://rpc-cms-lighthouse.azurewebsites.net/',
      // generate this token via `npx @lhci/cli@0.7.x wizard --wizard=new-project` for a new project
      token: '61eedee0-9fb2-4278-9b3f-31e87b9c246e',
    },
  },
}
