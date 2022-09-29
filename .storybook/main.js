const { resolve } = require('path')
const { mergeConfig } = require('vite')
const svgr = require('vite-plugin-svgr').default;

module.exports = {
  async viteFinal(config) {
    const myConfig = mergeConfig(config, {
      plugins: [svgr()],
      resolve: {
        alias: {
          ['$']: resolve(process.cwd(), 'src'),
          '~bootstrap': 'bootstrap',
        },
      },
    })
    return myConfig
  },

  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: false,
  },
}
