describe('/app/library', () => {
  before(() => {
    cy.headlessLoginAs('parent')

    cy.headlessChildrenFetch().then((children) => {
      cy.headlessChildSelect(children[0].id)

      cy.visit('/app/dashboard')
      cy.get('[data-test-id=app-library]').click()
    })
  })

  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '/activities'
    }).as('activities')
  })

  it('can play featured video', () => {
    cy.wait('@activities').then(() => {
      cy.get('[data-test-id=featured-video-play]').click()
      assertDialogIsVisible()
    })
  })

  it('can close featured video', () => {
    closeDialogAndAssertItIsNotVisible()
  })

  describe('categories', () => {  
    describe('given a category is clicked', () => {
      it('scrolls to such category', () => {
        cy.get('[data-test-id=lib-cat-entry-Language]').click()
        cy.wait(1000)
        cy.get('[data-test-id=lib-cat-header-Language]').isInViewport()
      })
    })

    describe('given `Play All` button is clicked', () => {
      before(() => {
        cy.get('[data-test-id=lib-cat-play-all-Language]').click({ force: true })
      })

      it('starts playing video', () => {
        assertDialogIsVisible()
      })

      it('can close video', () => {
        closeDialogAndAssertItIsNotVisible()
      })
    })

    describe('given a category card is clicked', () => {
      before(() => {
        cy.get('[data-test-id=lib-cat-container-Language]').within(() => {
          cy.get('[data-test-id=activity-card]').first().click({ force: true })
        })
      })
      
      it('starts playing video', () => {
        assertDialogIsVisible()
      })

      it('can close video', () => {
        closeDialogAndAssertItIsNotVisible()
      })
    })

    describe('given `View more` is clicked', () => {
      before(() => {
        cy.get('[data-test-id=lib-cat-view-more-Language]').click({ force: true })
      })

      after(() => {
        cy.go('back')
      })

      it('navigates to category page', () => {
        cy.url().should('include', '/app/library')
        cy.get('[data-test-id=activity-type-header-Language]').should('be.visible')
      })
    })
  })

  describe('favorites', () => {
    beforeEach(() => {
      cy.intercept({
        url: '/videos-favorites'
      }).as('videoFavorites')
    })

    it('can unset favorite videos', () => {
      cy.get('[data-test-id=lib-cat-container-Language]').within(() => {
        clickAllVideosFavoriteBtnWithClass('is-favorite-video')

        cy.get('[data-test-id=activity-card-favorite-button]')
          .each($button => expect($button).to.have.class('is-not-favorite-video'))
      })
    })

    it('can set videos as favorite', () => {
      cy.get('[data-test-id=lib-cat-container-Language]').within(() => {
        clickAllVideosFavoriteBtnWithClass('is-not-favorite-video')

        cy.get('[data-test-id=activity-card-favorite-button]')
          .each($button => expect($button).to.have.class('is-favorite-video'))
      })
    })

    describe('given `View more` is clicked', () => {
      beforeEach(() => {
        cy.intercept({
          url: '/videos-favorites'
        }).as('videoFavorites')
      })

      // set all these sections as favorites so the `View More` button shows up
      before(() => {
        // set all Art videos as favorites
        cy.get('[data-test-id=lib-cat-container-Art]').within(() => {
          clickAllVideosFavoriteBtnWithClass('is-not-favorite-video')
        })
        // set all Language videos as favorites
        cy.get('[data-test-id=lib-cat-container-Language]').within(() => {
          clickAllVideosFavoriteBtnWithClass('is-not-favorite-video')
        })
      })

      after(() => {
        cy.go('back')
      })

      it('navigates to `library/favorite`', () => {
        cy.get('[data-test-id=favorite-container-view-more-button]').click({ force: true })

        cy.url().should('include', '/app/library/favorites')
      })
    })
  })
})

var clickAllVideosFavoriteBtnWithClass = (className: string) => {
  cy.get('[data-test-id=activity-card-favorite-button]').each($button => {
    return new Promise<void>(resolve => {
      if ($button.hasClass(className)) {
        $button.trigger('click')

        cy.wait('@videoFavorites').then(() => resolve())
      }
      resolve()
    })
  })
}

var assertDialogIsVisible = () => {
  cy.get('[data-test-id=video-player-dialog]').should('be.visible')
}

var closeDialogAndAssertItIsNotVisible = () => {
  cy.get('.player-dialog-container > .player-dialog-close-btn > .v-btn').click({ multiple: true, force: true })
  cy.get('[data-test-id=video-player-dialog]').should('not.be.visible')
}