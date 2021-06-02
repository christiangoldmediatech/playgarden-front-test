describe('/app/library/favorites', () => {
  before(() => {
    cy.intercept({
      url: '/videos-favorites*'
    }).as('videoFavorites')

    cy.headlessLoginAs('parent')

    cy.headlessChildrenFetch().then((children) => {
      cy.headlessChildSelect(children[0].id)

      cy.visit('/app/dashboard')
      cy.get('[data-test-id=app-library]').click()

      // set all these sections as favorites so the `View More` button shows up
      // set all Art videos as favorites
      cy.get('[data-test-id=lib-cat-container-Art]').within(() => {
        clickAllVideosFavoriteBtnWithClass('is-not-favorite-video')
      })
      // set all Language videos as favorites
      cy.get('[data-test-id=lib-cat-container-Language]').within(() => {
        clickAllVideosFavoriteBtnWithClass('is-not-favorite-video')
      })

      cy.get('[data-test-id=favorite-container-view-more-button]').click({ force: true })
      cy.url().should('include', '/app/library/favorites')
    })
  })

  it('shows header with `All Favorites`', () => {
    cy.get('[data-test-id=activity-type-header-title]').should('contain.text', 'ALL FAVORITES')
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

  describe('given a favorite card is clicked', () => {
    before(() => {
      cy.get('[data-test-id=favorite-card]').first().click({ force: true })
    })

    it('starts playing video', () => {
      assertVideoDialogIsVisible()
    })

    it('can close video', () => {
      closeVideoDialogAndAssertItIsNotVisible()
    })
  })

  describe('given `View more` is clicked', () => {
    before(() => {
      cy.get('[data-test-id=favorite-card]').as('favoriteCard')
      cy.get('@favoriteCard').should('have.length', 8)
      
      cy.get('[data-test-id=favorite-container-view-more-button]').click({ force: true })
    })

    it('loads more favorites', () => {
      cy.get('@favoriteCard').should('have.length', 16)
    })
  })
})

var clickAllVideosFavoriteBtnWithClass = (className: string) => {
  cy.get('[data-test-id=activity-card-favorite-button]').each($button => {
    return new Promise<void>(resolve => {
      if (!$button.hasClass(className)) {
        resolve()
        
        return
      }

      $button.trigger('click')

      cy.wait('@videoFavorites').then(() => resolve())
    })
  })
}

var assertVideoDialogIsVisible = () => {
  cy.get('[data-test-id=video-player-dialog]').should('be.visible')
}

var closeVideoDialogAndAssertItIsNotVisible = () => {
  cy.get('.player-dialog-container > .player-dialog-close-btn > .v-btn').click({ multiple: true, force: true })
  cy.get('[data-test-id=video-player-dialog]').should('not.be.visible')
}