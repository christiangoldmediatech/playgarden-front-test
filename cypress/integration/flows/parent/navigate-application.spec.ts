export {}

describe('flows/parent/navigate-application.spec.ts', () => {
  describe(
    'Mobile',
    { viewportHeight: 667, viewportWidth: 375 },
    () => main({ isMobile: true })
  )

  describe(
    'Desktop',
    { viewportHeight: 768, viewportWidth: 1024 },
    () => main({ isMobile: false })
  )
})

interface Main {
  isMobile: boolean
}

function main({ isMobile }: Main) {
  it('Should navigate to the login page', () => {
    cy.visit('/auth/login')
  })
 
  it('Should login as parent', () => {
    cy.uiLoginAs('parent')
  })

  it('Should pick a child', () => {
    cy.url().should('include', '/app/pick-child')
    cy.get('[data-test-id=pick-child-0]').click() // click first child
  })

  it('Should be able to navigate to the learn & play page', () => {
    cy.url().should('include', '/app/learn-play')
    cy.get('[data-test-id=learn-play-content]').should('be.visible')
  })

  it('Should be able to navigate to the daily lessons page', () => {
    if (isMobile) {
      // open side menu and click the daily lessons button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=mobile-app-dashboard]').click()
    } else {
      cy.get('[data-test-id=app-dashboard]').click()
    }

    cy.url().should('include', '/app/dashboard')
    cy.get('[data-test-id=lesson-letter-day-circle]').should('be.visible')
  })
}
