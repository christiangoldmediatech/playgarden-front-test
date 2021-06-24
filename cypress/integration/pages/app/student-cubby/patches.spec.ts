describe('/app/student-cubby', () => {
    before(() => {
      cy.headlessLoginAs('parent')
  
      cy.headlessChildrenFetch().then((children) => {
        cy.headlessChildSelect(children[0].id)
  
        cy.visit('/app/dashboard')
        cy.get('[data-test-id=app-student-cubby]').click()
      })
    })
  
  
    describe('given PATCHES is clicked', () => {
      before(() => {
        cy.get('[data-test-id=student-cubby-item-PATCHES]').click({ force: true })
      })
  
      it('navigates to /app/student-cubby/patches', () => {
        cy.url().should('include', '/app/student-cubby/patches')
      })
  
      it('Click on Unlock This Patch', () => {
        cy.get('[data-test-id=patch-badge-row-btn]').first().click({ force: true })
      })
    })

  })
  