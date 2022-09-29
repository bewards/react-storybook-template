# Lighthouse CI

## What

Lighthouse CI is a step of the CI/CD process that runs and generates the same report that you would recieve by using the Lighthouse Chrome extension. It evaluates a page in 5 categories:

1. Performance
2. Accessibility
3. Best Practices
4. SEO
5. PWA

Your application may not benefit from all of the categories, but every application should benefit from at least some. More info [here](https://developer.chrome.com/docs/lighthouse/overview/) and [here](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md#overview). If you are not familiar with CI or CD, they also have a good piece of documentation [here](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/introduction-to-ci.md).

## Why

You can't improve what you aren't measuring. This will help your application track changes to these categories overtime, depending on how you configure your CI/CD. If you merge a feature that has a big negative impact to the performance metric, then you know very quickly about areas for improvement. Additionally, if this runs as a part of the CI/CD build, you can set thresholds in which to fail the build if such standards make sense for your application.

## Where

There are many ways to call the `lhci` script. With this approach, there are at least three places to be aware of.

1. The CI config file, that tells your CI service what steps to take and in what order.
2. The npm script that is called by the CI config file to run the lighthouse report.
3. The lighthouse configuration that tells lighthouse what settings it will use while generating the report for a specific execution.

For example, in this repo, the default "on push" GitHub CI is as follows:

1. `.github/workflows/ci.yml` - The default "on push" GitHub workflow (If you search for "`#{LHCI-CI-STEP}`" you'll find the step where the CI configures)
2. The `lhci` script within the `package.json`. This calls the cli with the proper syntax.
3. `lighthouserc.js` - The configuration that Lighthouse will use when executed.

## Next Steps

For integration into your application, you'll want to:

- Configure the `collect` ([docs](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#collect)), `assert` ([docs](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#assert)), and `upload` ([docs](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#upload)) sections of the `lighthouserc.js` for what makes sense for your application.
- If you would like your LHCI results to be a separate dedicated Github Status Check, you'll need to create and configure the GitHub token. (Search for "`#{LHCI-GH-TOKEN}`" for more info)
