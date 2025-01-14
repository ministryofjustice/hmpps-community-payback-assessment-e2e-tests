// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

require('./commands')
require('cypress-axe')
require('cypress-plugin-tab')

beforeEach(() => {
  cy.getCookies().then(cookies => {
    if (cookies.length > 1) {
      for (const cookie of cookies) {
        cy.clearCookie(cookie.name, { log: false })
      }
    }
  })
})

afterEach(() => {
  cy.getCookies().then(cookies => {
    if (cookies.length > 1) {
      for (const cookie of cookies) {
        cy.clearCookie(cookie.name, { log: false })
      }
    }
  })
})

Cypress.on('uncaught:exception', () => {
  return false
})
