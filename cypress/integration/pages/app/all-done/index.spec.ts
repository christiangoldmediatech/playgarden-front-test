describe('All done', () => {
    before(() => {
      cy.headlessLoginAs('parent')
      cy.headlessChildrenFetch().then((children) => {
        cy.headlessChildSelect(children[0].id)
        cy.visit('/app/all-done')
      })
    })
  
    it('loads the correct page', () => {
      // cy.url().should('include', '/app/student-cubby/puzzle')
      cy.visit('/app/all-done')
    })
  
    /* describe('load all done', () => {
        cy.visit('/app/all-done')
    }) */
  })
  