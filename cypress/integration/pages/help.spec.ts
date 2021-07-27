describe('/help', () => {
  before(() => {
    cy.visit('/auth/login')
    cy.uiLoginAs('parent')
    cy.uiChildSelect(1)
    cy.get('[data-test-id=help-button]').click()
    cy.get('[data-test-id=faq-button]').click()
  })

  describe('Given the user changes category', () => {
    it('Show content from that category', () => {
      ['About Playgarden', 'Membership', 'Playgarden Prep Online', 'Programs'].forEach((category) => {
        cy.get(`[data-test-id="help-section-${category}"]`).click()
        cy.get(`[data-test-id="help-title-${category}"]`).should('have.text', category)
      })
    })
  })

  describe('Given the user fills the form', () => {
    beforeEach(() => {
      cy.intercept({
        url: 'reporting-errors'
      }).as('errorReporting')
    })

    it('should show success notificatio message', () => {
      cy.get('[data-test-id=help-form-name]').type('E2E Name', { force: true })
      cy.get('[data-test-id=help-form-email]').type('e2e@example.com', { force: true })

      cy.get('[data-test-id=help-form-select]').click({ force: true })
      cy.wait(500)
      cy.get('.v-list-item__content > .v-list-item__title').contains('ACCOUNT').click({ force: true })

      cy.get('[data-test-id=help-form-subject]').type('E2E Subject', { force: true })
      cy.get('[data-test-id=help-form-textarea]').type('E2E How can I help you?', { force: true })

      cy.get('[data-test-id=help-form-submit]').click()

      cy.wait('@errorReporting').should((xhr) => {
        expect(xhr.response.statusCode).to.eq(201)
      })
    })
  })
})
