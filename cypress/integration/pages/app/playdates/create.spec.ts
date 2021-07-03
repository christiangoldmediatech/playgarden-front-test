describe('/app/playdates', () => {
  before(() => {
    cy.headlessLoginAs('parent')

    cy.headlessChildrenFetch().then((children) => {
      cy.headlessChildSelect(children[0].id)

      cy.visit('/app/dashboard')
      cy.get('[data-test-id=app-playdates]').click({ force: true })
      cy.get('[data-test-id=create-playdate]').click({ force: true })
    })
  })

  beforeEach(() => {
    cy.intercept({
      url: '/children'
    }).as('loadChildren')

    cy.intercept({
      url: '/playdates?*'
    }).as('loadPlaydates')
  })

  it('loads the page', () => {
    // Wait for children to load.
    cy.wait('@loadChildren').then(() => {
      cy.url().should('include', 'app/playdates/create')
    })
  })

  it('should be able to fill the form and unlock the Invite button', () => {
    // Fill child select.
    cy.get('[data-test-id=child-select]').click({ force: true })
    cy.wait(500)
    cy.get('.v-list-item__content > .v-list-item__title').contains('Ana').click({ force: true })
    clickOutside()

    // Select first day.
    cy.get('[data-test-id=day-select]').click({ force: true })
    cy.wait(500)
    cy.get('.v-list-item__content > .v-list-item__title').contains('MONDAY').click({ force: true })
    clickOutside()

    cy.wait('@loadPlaydates').then(() => {
      // Select the first time.
      cy.get('[data-test-id=time-select]').click({ force: true })
      cy.wait(500)
      cy.get('[data-test-id=time-select-item]').first().click({ force: true })
      clickOutside()

      // Invite friends.
      cy.get('[data-test-id=invite-select]').type('paren@goldmediatech.com{uparrow}{enter}{esc}', { force: true })
      clickOutside()

      // Create playdate.
      cy.get('[data-test-id=create-playdate-submit]').click()

      cy.url().should('include', 'app/playdates')
      cy.url().should('not.include', 'create')
    })
  })

  it('should be able to delete created invite', () => {
    // Open created playdate.
    cy.get('[data-test-id=playdate-card]').first().find('[data-test-id=card-playdate-title]').should('contain.text', 'Ana')
    cy.get('[data-test-id=playdate-card]').first().find('[data-test-id=card-playdate-open-button]').click({ force: true })
    cy.get('[data-test-id=playdate-modal').should('be.visible');

    // Delete playdate.
    cy.get('[data-test-id=card-playdate-delete]').click()
    cy.get('[data-test-id=prompt-dialog-action-button]').click()

    // Check first playdate is removed.
    cy.get('[data-test-id=playdate-modal').should('not.be.visible');
    cy.wait(1000)
    cy.get('[data-test-id=playdate-card]').first().find('[data-test-id=card-playdate-title]').should('not.contain.text', 'Ana')
  })
})

var clickOutside = () => {
  cy.get('[data-test-id=create-playdate-image]').first().click({ force: true })
}