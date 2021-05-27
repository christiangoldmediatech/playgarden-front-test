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
    it('navigates to /app/student-cubby/puzzle')
    it('sets custom title')
  })

  describe('given PATCHES is clicked', () => {
    it('navigates to /app/student-cubby/patches')
    it('sets custom title')
  })

  describe('given CURRICULUM is clicked', () => {
    it('navigates to /app/student-cubby/course-progress')
    it('sets custom title')
  })

  describe('given PORTFOLIO is clicked', () => {
    it('navigates to /app/student-cubby/student-portfolio')
    it('sets custom title')
  })

  describe('given PROGRESS REPORT is clicked', () => {
    it('navigates to /app/progress-report')
  })
})
