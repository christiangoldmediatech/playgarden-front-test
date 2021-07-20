describe('/app/music', () => {
  before(() => {
    cy.visit('/app/virtual-preschool')
    cy.uiLoginAs('parent')
    cy.uiChildSelect(1)
  })

  describe('given Daily Lessons is clicked', () => {
    it('navigates to /app/dashboard', () => {
      cy.get('[data-test-id="vp-section-Daily Lessons"]').click({ force: true })

      cy.url().should('include', '/app/dashboard')
      cy.go('back')
      cy.url().should('include', '/app/virtual-preschool')
    })
  })

  describe('given Playdates is clicked', () => {
    it('navigates to /app/playdates', () => {
      cy.get('[data-test-id="vp-section-Playdates"]').click({ force: true })

      cy.url().should('include', '/app/playdates')
      cy.go('back')
      cy.url().should('include', '/app/virtual-preschool')
    })
  })

  describe('given Live Classes is clicked', () => {
    it('navigates to /app/live-classes', () => {
      cy.get('[data-test-id="vp-section-Live Classes"]').click({ force: true })

      cy.url().should('include', '/app/live-classes')
      cy.go('back')
      cy.url().should('include', '/app/virtual-preschool')
    })
  })

  /*
  TODO: uncomment when back navigation is fixed
  describe('given Student Cubby is clicked', () => {
    it('navigates to /app/student-cubby', () => {
      cy.get('[data-test-id="vp-section-Student Cubby"]').click({ force: true })

      cy.url().should('include', '/app/student-cubby')
      cy.go('back')
    })
  })
  */

  describe('given Music is clicked', () => {
    it('navigates to /app/music', () => {
      cy.get('[data-test-id="vp-section-Music"]').click({ force: true })

      cy.url().should('include', '/app/music')
      cy.go('back')
      cy.go('back')
      cy.url().should('include', '/app/virtual-preschool')
    })
  })

  describe('given Library is clicked', () => {
    it('navigates to /app/library', () => {
      cy.get('[data-test-id="vp-section-Library"]').click({ force: true })

      cy.url().should('include', '/app/library')
      cy.go('back')
      cy.url().should('include', '/app/virtual-preschool')
    })
  })
})
