describe('/app/student-cubby', () => {
    before(() => {
      cy.headlessLoginAs('parent')
      cy.headlessChildrenFetch().then((children) => {
        cy.headlessChildSelect(children[0].id)
        cy.visit('/app/dashboard')
        cy.get('[data-test-id=app-student-cubby]').click()
      })
    })

    describe('given PUZZLE is clicked', () => {
      before(() => {
        // cy.get('[data-test-id=student-cubby-item-PUZZLE]').click({ force: true })
      })

      it('View puzzles', () => {
        cy.get('body')
        cy.get('[data-test-id=gallery-puzzles]').each((item, index) => {
            // console.log('item--', item, 'idenx--', index)
            cy.get('[data-test-id=gallery-puzzles-0]').click()
        })
        // cy.url().should('include', '/app/student-cubby/puzzle')
        /* cy.get('[data-test-id=view-puzzle-gallery-button-0]').each(($button) => {
            console.log('buton--', $button)
            return new Promise<void>(resolve => {
                $button.trigger('click')
              })
        }) */
      })
    })
  })

  var puzzleDialogIsVisible = () => {
    cy.get('[data-test-id=video-player-dialog]').should('be.visible')
  }