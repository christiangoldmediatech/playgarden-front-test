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

  it('Should navigate to the learn & play page', () => {
    cy.url().should('include', '/app/learn-play')
    cy.get('[data-test-id=learn-play-content]').should('be.visible')
  })

  it('Should navigate to the daily lessons page', () => {
    if (isMobile) {
      // open side menu and click the daily lessons button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-dashboard]').click()
    } else {
      cy.get('[data-test-id=app-dashboard]').click()
    }

    cy.url().should('include', '/app/dashboard')
    cy.get('[data-test-id=lesson-letter-day-circle]').should('be.visible')
  })

  it('Should navigate to the Live Classes page', () => {
    if (isMobile) {
      // open side menu and click the live classes button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-live-classes]').click()
    } else {
      cy.get('[data-test-id=app-live-classes]').click()
    }

    cy.url().should('include', '/app/live-classes')
    cy.get('[data-test-id=live-classes-content]').should('be.visible')
  })

  it('Should navigate to the Library page', () => {
    if (isMobile) {
      // open side menu and click the library button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-library]').click()
    } else {
      cy.get('[data-test-id=app-library]').click()
    }

    cy.url().should('include', '/app/library')

    // TOOD: improve Library page performance
    cy.wait(4000)
    cy.get('[data-test-id=library-content]').should('be.visible')
  })

  it('Should navigate to the Music page', () => {
    if (isMobile) {
      // open side menu and click the music button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-music]').click()
    } else {
      cy.get('[data-test-id=app-music]').click()
    }
    
    cy.url().should('include', '/app/music')
    cy.get('[data-test-id=music-content]').should('be.visible')
  })

  it('Should navigate to the Playdates page', () => {
    if (isMobile) {
      // open side menu and click the playdates button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-playdates]').click()
    } else {
      cy.get('[data-test-id=app-playdates]').click()
    }

    cy.url().should('include', '/app/playdates')
    cy.get('[data-test-id=playdates-content]').should('be.visible')
  })

  it('Should navigate to the Student Cubby page', () => {
    if (isMobile) {
      // open side menu and click the student cubby button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-student-cubby]').click()
    } else {
      cy.get('[data-test-id=app-student-cubby-puzzle]').click()
    }

    cy.url().should('include', '/app/student-cubby')
    cy.get('[data-test-id=student-cubby-content]').should('be.visible')
  })

  it('Should navigate to the Parent Corner page', () => {
    if (isMobile) {
      // open side menu and click the parent corner button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-app-parent-corner]').click()
    } else {
      cy.get('[data-test-id=app-parent-corner]').click({ force: true })
    }

    cy.url().should('include', '/app/parent-corner')
    cy.get('[data-test-id=parent-corner-content]').should('be.visible')
  })
}
