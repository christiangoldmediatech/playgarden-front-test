// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('uiLoginAsAdmin', () => {
  cy.visit('/auth/logout')

  cy.get('[data-test-id=email-field]').type(Cypress.env('adminEmail'))
  cy.get('[data-test-id=password-field]').type(Cypress.env('adminPassword'))
  cy.get('[data-test-id=login-button]').click()

  cy.url().should('include', '/admin/dashboard')
})

Cypress.Commands.add('uiLoginAsParent', () => {
  cy.visit('/auth/logout')

  cy.get('[data-test-id=email-field]').type(Cypress.env('parentEmail'))
  cy.get('[data-test-id=password-field]').type(Cypress.env('parentPassword'))
  cy.get('[data-test-id=login-button]').click()

  cy.url().should('include', '/app/pick-child')
})
