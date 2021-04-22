/// <reference path="../../../support/index.d.ts" />

describe('/auth/login', () => {
  afterEach(() => {
    cy.visit('/auth/logout')
  })

  it('loads page successfully', () => {
    cy.visit('/auth/login')
    cy.url().should('include', '/auth/login')
  })

  it('logs in as an admin', () => {
    cy.uiLoginAs('admin')
  })

  it('logs in as a parent', () => {
    cy.uiLoginAs('parent')
  })
})