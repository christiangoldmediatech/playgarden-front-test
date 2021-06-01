describe('/app/library/_activityTypeId', () => {
  before(() => {
    cy.intercept({
      url: '/videos-favorites/children'
    }).as('videosFavorites')

    cy.headlessLoginAs('parent')

    cy.headlessChildrenFetch().then((children) => {
      cy.headlessChildSelect(children[0].id)

      cy.visit('/app/dashboard')
      cy.get('[data-test-id=app-library]').click()

      cy.wait('@videosFavorites').then(() => {
        cy.get('[data-test-id=lib-cat-view-more-Language]').click({ force: true })
        cy.url().should('include', '/app/library')
      })
    })
  })

  it('shows header with `ALL LANGUAGE`', () => {
    cy.get('[data-test-id=activity-type-header-Language]').should('contain.text', 'ALL LANGUAGE')
  })

  describe('given `Play All` is clicked', () => {
    before(() => {
      cy.get('[data-test-id=activity-type-header-button]').click({ force: true })
    })

    it('starts playing video', () => {
      assertVideoDialogIsVisible()
    })

    it('can close video', () => {
      closeVideoDialogAndAssertItIsNotVisible()
    })
  })

  describe('given a card is clicked', () => {
    before(() => {
      cy.get('[data-test-id=activity-card]').first().click({ force: true })
    })

    it('starts playing video', () => {
      assertVideoDialogIsVisible()
    })

    it('can close video', () => {
      closeVideoDialogAndAssertItIsNotVisible()
    })
  })
})

var assertVideoDialogIsVisible = () => {
  cy.get('[data-test-id=video-player-dialog]').should('be.visible')
}

var closeVideoDialogAndAssertItIsNotVisible = () => {
  cy.get('.player-dialog-container > .player-dialog-close-btn > .v-btn').click({ multiple: true, force: true })
  cy.get('[data-test-id=video-player-dialog]').should('not.be.visible')
} 