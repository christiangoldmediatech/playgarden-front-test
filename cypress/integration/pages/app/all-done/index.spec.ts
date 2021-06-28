describe('/app/all-done', () => {
    before(() => {
        cy.headlessLoginAs('parent')
        cy.headlessChildrenFetch().then((children) => {
          cy.headlessChildSelect(children[0].id)
          cy.visit('/app/all-done')
        })
      })
  
    it('loads the correct page', () => {
      // cy.url().should('include', '/app/all-done')
      // cy.get('[data-test-id=all-done-title]').should('have.text', 'Congratulations! You have finished all the Daily Lessons!')
      // cy.url().should('include', '/app/all-done')
      // cy.visit('/app/all-done')
       cy.url().should('include', '/app/music')
    })
  })
  