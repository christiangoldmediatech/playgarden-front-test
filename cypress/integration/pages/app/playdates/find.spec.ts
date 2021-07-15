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
    cy.get('[data-test-id=card-playdate]').should('have.length.at.least', 1);
  })

  it('should open playdate', () => {
    cy.get('[data-test-id=card-playdate]').first().find('[data-test-id=card-playdate-open-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('be.visible');
  })

  it('should close playdate with X button', () => {
    cy.get('[data-test-id=playdate-modal').should('be.visible');

    cy.get('[data-test-id=playdate-modal-close-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('not.be.visible');
  })

  it('should close playdate with back button', () => {
    cy.get('[data-test-id=card-playdate]').first().find('[data-test-id=card-playdate-open-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('be.visible');

    cy.get('[data-test-id=playdate-modal-back-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('not.be.visible');
  })

  it('should be able to join a playdate', () => {
    cy.get('[data-test-id=card-playdate]').first().find('[data-test-id=card-playdate-open-button]').click({ force: true })

    cy.get('[data-test-id=playdate-modal').should('be.visible');

    // Fill child select.
    cy.get('[data-test-id=child-select]').click({ force: true })
    cy.wait(500)
    cy.get('.v-list-item__content > .v-list-item__title').contains('Ana').click({ force: true })

    // Join the playdate.
    cy.get('[data-test-id=card-playdate-join-button]').click({ force: true })

    cy.url().should('include', 'app/playdates')
    cy.url().should('not.include', 'find')
  })

  it('should be able to delete the created invite', () => {
    // Open joined playdate.
    cy.get('[data-test-id=card-playdate]').first().find('[data-test-id=card-playdate-title]').should('contain.text', 'Ana')
    cy.get('[data-test-id=card-playdate]').first().find('[data-test-id=card-playdate-open-button]').click({ force: true })
    cy.get('[data-test-id=playdate-modal').should('be.visible');

    // Delete playdate.
    cy.get('[data-test-id=card-playdate-delete]').click()
    cy.get('[data-test-id=prompt-dialog-action-button]').click()

    // Check first playdate is removed.
    cy.get('[data-test-id=playdate-modal').should('not.be.visible');
    cy.wait(1000)
    cy.get('[data-test-id=card-playdate]').first().find('[data-test-id=card-playdate-title]').should('not.contain.text', 'Ana')
  })
})
