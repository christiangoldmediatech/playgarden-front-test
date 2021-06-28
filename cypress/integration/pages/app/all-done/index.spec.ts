describe('All done', () => {
    before(() => {
      cy.headlessLoginAs('parent')
      cy.headlessChildrenFetch().then((children) => {
        cy.headlessChildSelect(children[0].id)
        cy.visit('/app/all-done')
      })
    })
  
    it('loads the correct page', () => {
      cy.visit('/app/all-done')
      // cy.url().should('include', '/app/all-done')
    })
  })
  