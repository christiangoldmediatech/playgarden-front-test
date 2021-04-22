/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login using the UI
     * @example cy.uiLoginAs('parent')
     */
    uiLoginAs(user: 'parent' | 'admin'): Chainable<Element>,
    /**
     * 
     * @param user Custom command to login using requests
     * @example cy.headlessLoginAs('admin')
     */
    headlessLoginAs(user: 'parent' | 'admin'): Chainable<Element>
  }
}