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
        cy.get('body')
        cy.get('[data-test-id=gallery-puzzles]').each(($el, $index, $list) => {
            cy.wrap($el).click()
        })
      })
    })
  })