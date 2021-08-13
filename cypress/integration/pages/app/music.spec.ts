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

  it('Shows letter view by default', () => {
    cy.get('[data-test-id=letter-songs-list]').should('be.visible')
  })

  it('can hide children and letter carousel', () => {
    cy.get('[data-test-id=hcr-minimize-button]').click()
    cy.get('[data-test-id=hcr-content]').should('not.be.visible')
  })

  it('can show children and letter carousel', () => {
    cy.get('[data-test-id=hcr-minimize-button]').click()
    cy.get('[data-test-id=hcr-content]').should('be.visible')
  })

  describe('favorites', () => {
    describe('letter song list', () => {
      it('shows a notification when a song is added or removed from favorites', () => {
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
      })
    })
  })

  describe('playlist', () => {
    it('should open the playlist card', () => {
      cy.get('[data-test-id=music-queue-playlist-button]').click({ force: true })

      cy.get('[data-test-id=music-queue-card]').should('be.visible')
    })

    it('should show playlist items', () => {
      cy.get('[data-test-id=playlist-item]').should('have.length.at.least', 1)
    })

    it('should show Playing', () => {
      cy.get('[data-test-id=playlist-item]').first().click({ force: true })
      cy.get('[data-test-id=playlist-item]').first().find('[data-test-id=playlist-item-playing-tag]').should('exist')
      
      // pause
      cy.get('[data-test-id=music-player-pause-button]').click({ force: true })
    })

    it('should remove playlist item', () => {
      cy.get('[data-test-id=playlist-item]').first().find('[data-test-id=playlist-item-remove-button]').click({ force: true })
      cy.get('[data-test-id=playlist-item]').should('have.length', 0)
    })

    it('should show Empty queue text', () => {
      cy.get('[data-test-id=music-queue-empty-queue]').should('contain.text', 'Empty queue')
    })
  })
})
