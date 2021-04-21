describe('/auth/login', () => {  
  beforeEach(() => {
    cy.visit('/auth/login')

    cy.get('[data-test-id=email-field]').as('emailField')
    cy.get('[data-test-id=password-field]').as('passwordField')
    cy.get('[data-test-id=login-button]').as('loginButton')
  })

  it('loads page successfully', () => {
    cy.url().should('include', '/auth/login')
  })

  it('logs in as an admin', () => {
    cy.get('@emailField').type(Cypress.env('adminEmail'))
    cy.get('@passwordField').type(Cypress.env('adminPassword'))

    cy.get('@loginButton').click()

    cy.url().should('include', '/admin/dashboard')

    cy.request('/auth/logout')
  })

  it('logs in as a parent', () => {
    cy.get('@emailField').type(Cypress.env('parentEmail'))
    cy.get('@passwordField').type(Cypress.env('parentPassword'))

    cy.get('@loginButton').click()

    cy.url().should('include', '/app/pick-child')

    cy.request('/auth/logout')
  })
})