/// <reference types="vitest" />
import type { PluginOption } from 'vite'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  /**
   * This does a find/replace of env variables in our index.html
   * It looks for ejs style syntax: <%= ENV_VARIABLE_NAME %>
   */
  const htmlPlugin = (): PluginOption => {
    return {
      name: 'html-transform',
      transformIndexHtml: (html: string) =>
        html.replace(/<%=\s*([a-zA-Z_]+)\s*%>/g, (_, variableName: string) => env[variableName]),
    }
  }

  return {
    plugins: [svgr(), react(), htmlPlugin()],
    resolve: {
      alias: {
        ['$']: resolve(__dirname, 'src'),
        '~bootstrap': 'bootstrap',
      },
    },

    build: {
      sourcemap: true,
    },

    // https://vitest.dev/config/
    test: {
      resetMocks: true,

      // https://vitest.dev/config/#reporters
      reporters: 'verbose',

      // https://vitest.dev/config/#environment
      environment: 'jsdom',

      /**
       * https://vitest.dev/config/#setupfiles
       * They will be run before each test file.
       */
      setupFiles: ['./src/setupTests.tsx'],

      /**
       * https://vitest.dev/config/#coverage
       * Pass-through options to https://github.com/bcoe/c8
       */
      coverage: {
        all: true,
        src: ['src'],
        lines: 70,
        exclude: [
          'src/**/*.d.ts',
          'src/**/*.stories.*',
          'src/__mocks__/**/*',
          'src/mockApi/**/*',
          'src/stories/**/*',
          'src/lib/rtl-utils/**/*',
          'src/util/axe-core-importer.ts',
        ],
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        reporter: ['text', 'html'],
      },

      /**
       * https://vitest.dev/config/#watchexclude
       * Default: ['node_modules', 'dist']
       * Glob pattern of file paths to be ignored from triggering watch rerun.
       */
      // watchExclude: ['dist', 'coverage', '.storybook', 'node_modules'],
    },
  }
})
