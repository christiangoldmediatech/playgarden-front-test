/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in as an admin using the UI
     * @example cy.uiLoginAsAdmin()
     */
    uiLoginAsAdmin(): Chainable<Element>,
    uiLoginAsParent(): Chainable<Element>
  }
}