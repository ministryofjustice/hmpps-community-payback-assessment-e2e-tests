const page = require('./page')

const notFoundPage = () =>
  page('Page not found', {
    continueButton: () => cy.get('button'),
  })

module.exports = {
  verifyOnPage: notFoundPage,
}
