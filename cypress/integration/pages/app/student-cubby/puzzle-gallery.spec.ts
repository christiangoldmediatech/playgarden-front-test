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

      it('View puzzles', () => {
        cy.get('[data-test-id=gallery-puzzles]').each(($el, $index, $list) => {
            console.log('item--', $el)
            console.log('index--', $index)
            console.log('list--', $list)
            // cy.get('[data-test-id=gallery-puzzles-0]').click()
        })
      })
    })
  })

  var puzzleDialogIsVisible = () => {
    cy.get('[data-test-id=video-player-dialog]').should('be.visible')
  }