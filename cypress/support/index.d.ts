/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login using the UI
     * @example cy.uiLoginAs('parent')
     */
    uiLoginAs(user: 'parent' | 'admin'): Chainable<void>,
    /**
     *
     * @param user Custom command to login using requests
     * @example cy.headlessLoginAs('admin')
     */
    headlessLoginAs(user: 'parent' | 'admin'): Chainable<void>,
    /**
     * Custom command to select set a child in the localStorage
     * @param childId
     * @param expires Defaults to tomorrow if not specified
     */
    headlessChildSelect(childId: number, expires?: number): Chainable<void>,
    /**
     * Custom command that returns a list of children
     * @example headlessChildrenFetch().then(children => ...)
     */
    headlessChildrenFetch(): Chainable<any[]>,
    /**
     * Custom command to select a child using the UI
     * @param childIndex Index of child to select -- 0 by default
     * @example uiChildSelect(2)
     */
    uiChildSelect(childIndex: number): Chainable<void>,
    /**
     * Custom command that asserts if previous element is within viewport
     */
    isInViewport(): Chainable<void>
  }
}
