const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
// eslint-disable-next-line import/no-unresolved
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const { lighthouse, pa11y, prepareAudit } = require('cypress-audit')
const { configureVisualRegression } = require('cypress-visual-regression')

module.exports = defineConfig({
  chromeWebSecurity: false,
  execTimeout: 15000,
  taskTimeout: 15000,
  watchForFileChanges: false,
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 100000,
  requestTimeout: 30000,
  responseTimeout: 50000,
  viewportWidth: 1740,
  viewportHeight: 1200,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, cypress-circleci-reporter',
  },
  video: false,
  e2e: {
    testIsolation: true,
    specPattern: '**/*.feature',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      configureVisualRegression(on)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      )

      // eslint-disable-next-line default-param-last
      on('before:browser:launch', (_browser = {}, launchOptions) => prepareAudit(launchOptions))

      on('task', {
        lighthouse: lighthouse(lighthouseReport => {
          // eslint-disable-next-line no-console
          console.log(lighthouseReport)
        }),
        pa11y: pa11y(pa11yReport => {
          // eslint-disable-next-line no-console
          console.log(pa11yReport)
        }),
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
      })

      return config
    },
  },
  env: {
    visualRegressionType: 'regression',
    pluginVisualRegressionUpdateImages: true,
    pluginVisualRegressionDiffConfig: { threshold: 0.01 },
    AUTH_URL: 'http://localhost:9091/auth/oauth/token?grant_type=client_credentials&username=foobar',
    AUTH_USERNAME: '',
    AUTH_PASSWORD: '',
  },
})
