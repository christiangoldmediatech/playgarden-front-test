describe('/app/playdates', () => {
  before(() => {
    cy.headlessLoginAs('parent')

    cy.headlessChildrenFetch().then((children) => {
      cy.headlessChildSelect(children[0].id)

      cy.visit('/app/dashboard')
      cy.get('[data-test-id=app-playdates]').click({ force: true })
      cy.get('[data-test-id=find-playdates]').click({ force: true })
    })
  })

  it('loads the page', () => {
    cy.url().should('include', 'app/playdates/find')
  })

  it('should show list of playdates', () => {
    cy.get('[data-test-id=playdate-card]').should('have.length.at.least', 1);
  })

  it('should open playdate', () => {
    cy.get('[data-test-id=playdate-card]').first().find('[data-test-id=playdate-card-open-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('be.visible');
  })

  it('should close playdate with X button', () => {
    cy.get('[data-test-id=playdate-modal').should('be.visible');

    cy.get('[data-test-id=playdate-modal-close-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('not.be.visible');
  })

  it('should close playdate with back button', () => {
    cy.get('[data-test-id=playdate-card]').first().find('[data-test-id=playdate-card-open-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('be.visible');

    cy.get('[data-test-id=playdate-modal-back-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('not.be.visible');
  })

  /**
   * TODO:
   * - DELETE A PLAYDATE
   */
})
