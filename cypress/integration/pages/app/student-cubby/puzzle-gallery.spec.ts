describe('/app/student-cubby', () => {
    before(() => {
      cy.headlessLoginAs('parent')
      cy.headlessChildrenFetch().then((children) => {
        cy.headlessChildSelect(children[0].id)
        cy.visit('/app/dashboard')
        cy.get('[data-test-id=app-student-cubby]').click()
      })
    })

    it('loads the correct page', () => {
      cy.url().should('include', '/app/student-cubby/puzzle')
    })

    describe('given PUZZLE is clicked', () => {
      before(() => {
        cy.get('[data-test-id=student-cubby-item-PUZZLE]').click({ force: true })
      })

      it('navigates to /app/student-cubby/puzzle', () => {
        cy.url().should('include', '/app/student-cubby/puzzle')
      })
      it('sets custom title', () => {
        cy.get('[data-test-id=student-cubby-title]').should('have.text', 'STUDENTS CUBBY')
      })
    })

  })