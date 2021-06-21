describe('/app/music', () => {
  before(() => {
    cy.headlessLoginAs('parent')

    cy.headlessChildrenFetch().then((children) => {
      cy.headlessChildSelect(children[0].id)

      cy.visit('/app/dashboard')
      cy.get('[data-test-id=app-music]').click()
    })
  })

  it('loads music page successfully', () => {
    cy.url().should('include', '/app/music')
  })

  it('can switch from List to Letter view and viceversa', () => {
    // default view is List View
    cy.get('[data-test-id=song-card-list]').should('be.visible')

    // clicks on Letter View toggle
    cy.get('[data-test-id=letter-view-button]').click({ force: true })

    cy.get('[data-test-id=letter-songs-list]').should('be.visible')
    cy.get('[data-test-id=song-card-list]').should('not.exist')

    // clicks on List View toggle
    cy.get('[data-test-id=list-view-button]').click({ force: true })

    cy.get('[data-test-id=song-card-list]').should('be.visible')
    cy.get('[data-test-id=letter-songs-list]').should('not.exist')
  })

  it('can hide children and letter carrusel', () => {
    cy.get('[data-test-id=hcr-minimize-button]').click()
    cy.get('[data-test-id=hcr-content]').should('not.be.visible')
  })

  it('can show children and letter carrusel', () => {
    cy.get('[data-test-id=hcr-minimize-button]').click()
    cy.get('[data-test-id=hcr-content]').should('be.visible')
  })

  it('hdies children and letter carrusel when a songs is selected', () => {
    // starts playing a song to show the music player
    cy.get('[data-test-id=song-card]').first().click({ force: true })

    cy.get('[data-test-id=hcr-content]').should('not.be.visible')

    // Pause the player
    cy.wait(1000)
    cy.get('[data-test-id=music-player-pause-button]').click({ force: true })
  })

  describe('favorites', () => {
    describe('favorite button', () => {
      it('only shows favorite songs when toggled', () => {
        // remove all songs from favorites
        cy.get('[data-test-id=song-card-favorite-button]').each(($button) => {
          if ($button.hasClass('pink--text')) {
            $button.trigger('click')
          }
        })

        cy.get('[data-test-id=favorite-toggle]').click({ force: true }) // toggle button on
        cy.get('[data-test-id=song-card]').should('have.length', 0)
        cy.get('[data-test-id=favorite-toggle]').click({ force: true }) // toggle button off
      })

      it('shows favorite songs when toggled', () => {
        // add song to favorites
        cy.get('[data-test-id=song-card-favorite-button]').first().then(($button) => {
          if (!$button.hasClass('pink--text')) {
            $button.trigger('click')
          }
        })

        cy.get('[data-test-id=favorite-toggle]').click({ force: true }) // toggle button on
        cy.get('[data-test-id=song-card]').should('have.length.at.least', 1)
        cy.get('[data-test-id=favorite-toggle]').click({ force: true }) // toggle button off
      })
    })

    describe('song list', () => {
      it('shows a notification when a song is added or removed from favorites', () => {
        // clicks on List View toggle
        cy.get('[data-test-id=list-view-button]').click({ force: true })

        cy.get('[data-test-id=song-card-favorite-button]').first().then(($button) => {
          if ($button.hasClass('pink--text')) {
            $button.trigger('click')
            cy.wait(2000).then(() => {
              $button.trigger('click')
            })
          } else {
            $button.trigger('click')
            cy.wait(2000).then(() => {
              $button.trigger('click')
            })
          }
        })
      })
    })

    describe('letter song list', () => {
      it('shows a notification when a song is added or removed from favorites', () => {
        // clicks on Letter View toggle
        cy.get('[data-test-id=letter-view-button]').click({ force: true })

        cy.get('[data-test-id=letter-song-favorite-button]').first().then(($button) => {
          if ($button.hasClass('pink--text')) {
            $button.trigger('click')
            cy.wait(2000).then(() => {
              $button.trigger('click')
            })
          } else {
            $button.trigger('click')
            cy.wait(2000).then(() => {
              $button.trigger('click')
            })
          }
        })

        // clicks on List View toggle
        cy.get('[data-test-id=list-view-button]').click({ force: true })
      })
    })

    describe('music player', () => {
      it('shows a notification when a song is added or removed from favorites', () => {
        // clicks on List View toggle
        cy.get('[data-test-id=list-view-button]').click({ force: true })

        cy.get('[data-test-id=music-player-favorite-button').then(($button) => {
          if ($button.hasClass('pink--text')) {
            $button.trigger('click')
            cy.wait(2000).then(() => {
              $button.trigger('click')
            })
          } else {
            $button.trigger('click')
            cy.wait(2000).then(() => {
              $button.trigger('click')
            })
          }
        })
      })
    })
  })
})
