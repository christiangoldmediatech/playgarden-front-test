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

  describe('given PATCHES is clicked', () => {
    before(() => {
      cy.get('[data-test-id=student-cubby-item-PATCHES]').click({ force: true })
    })

    it('navigates to /app/student-cubby/patches', () => {
      cy.url().should('include', '/app/student-cubby/patches')
    })

    it('sets custom title', () => {
      cy.get('[data-test-id=student-cubby-title]').should('have.text', 'Earn Activity Patches for learning')
    })
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


  describe('given CURRICULUM is clicked', () => {
    before(() => {
      cy.get('[data-test-id=student-cubby-item-CURRICULUM]').click({ force: true })
    })

    it('navigates to /app/student-cubby/course-progress', () => {
      cy.url().should('include', '/app/student-cubby/course-progress')
    })

    it('sets custom title', () => {
      cy.get('[data-test-id=student-cubby-title]').should('have.text', 'Review all Curriculum')
    })
  })

  describe('given PORTFOLIO is clicked', () => {
    before(() => {
      cy.get('[data-test-id=student-cubby-item-PORTFOLIO]').click({ force: true })
    })

    it('navigates to /app/student-cubby/student-portfolio', () => {
      cy.url().should('include', '/app/student-cubby/student-portfolio')
    })

    it('sets custom title', () => {
      cy.get('[data-test-id=student-cubby-title]').should('have.text', 'PORTFOLIO')
    })
  })

  describe('given PROGRESS REPORT is clicked', () => {
    before(() => {
      cy.get('[data-test-id="student-cubby-item-PROGRESS REPORT"]').click({ force: true })
    })

    it('navigates to /app/progress-report', () => {
      cy.url().should('include', '/app/student-cubby/progress-report')
    })
  })
})
