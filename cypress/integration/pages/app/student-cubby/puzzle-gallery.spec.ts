describe('/app/student-cubby', () => {
    before(() => {
      cy.headlessLoginAs('parent')
      cy.headlessChildrenFetch().then((children) => {
        cy.headlessChildSelect(children[0].id)
        cy.visit('/app/dashboard')
        cy.get('[data-test-id=app-student-cubby]').click()
      })
    })

    it('loads the page', () => {
      cy.url().should('include', 'app/student-cubby/puzzle')
    })

    it('View progress puzzles', () => {
      cy.get('[data-test-id=gallery-puzzles]').first().click({ force: true })

      cy.get('[data-test-id=puzzle-modal').should('be.visible');
    })

    it('should close puzzle with X button', () => {
      cy.get('[data-test-id=puzzle-modal').should('be.visible');
  
      cy.get('[data-test-id=puzzle-modal-close-button]').click({ force: true })
  
      cy.get('[data-test-id=puzzle-modal').should('not.be.visible');
    })
  })