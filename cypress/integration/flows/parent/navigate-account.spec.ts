export {}

describe('flows/parent/navigate-account.spec.ts', () => {
  describe(
    'Mobile',
    { viewportHeight: 667, viewportWidth: 375 },
    () => main({ isMobile: true })
  )

  describe(
    'Desktop',
    { viewportHeight: 768, viewportWidth: 1280 },
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

  it('Should navigate to the Account page', () => {
    if (isMobile) {
      // open side menu and click the account button
      cy.get('[data-test-id=hamburger-menu]').trigger('mouseover').click()
      cy.get('[data-test-id=app-navigation-container]').should('be.visible')
      cy.get('[data-test-id=mobile-account-button]').click()
    } else {
      cy.get('[data-test-id=account-button]').click({ force: true })
    }

    cy.url().should('include', '/app/account')
    cy.get('[data-test-id=account-content]').should('be.visible')
  })

  it('Should navigate to the Student Profile page', () => {
    if (isMobile) {
      // open the select page dropdown and click the student profile option
      cy.get('[data-test-id=mobile-account-page-select]').click({ force: true })
      cy.get('.v-list-item').should('be.visible')
      cy.get('.v-list-item').contains('Student Profile').click()
    } else {
      cy.get('[data-test-id="account-left-panel-Student Profile"]').click({ force: true })
    }

    cy.url().should('include', '/app/account/student-profile')
    cy.get('[data-test-id=child-form-content]').should('be.visible')
  })

  it('Should navigate to the Membership page', () => {
    if (isMobile) {
      // open the select page dropdown and click the membership option
      cy.get('[data-test-id=mobile-account-page-select]').click({ force: true })
      cy.get('.v-list-item').should('be.visible')
      cy.get('.v-list-item').contains('Membership').click()
    } else {
      cy.get('[data-test-id="account-left-panel-Membership"]').click({ force: true })
    }

    cy.url().should('include', '/app/account/membership')
    cy.get('[data-test-id=membership-content]').should('be.visible')
  })

  it('Should navigate to the Caregivers page', () => {
    if (isMobile) {
      // open the select page dropdown and click the caregivers option
      cy.get('[data-test-id=mobile-account-page-select]').click({ force: true })
      cy.get('.v-list-item').should('be.visible')
      cy.get('.v-list-item').contains('Caregivers').click()
    } else {
      cy.get('[data-test-id="account-left-panel-Caregivers"]').click({ force: true })
    }

    cy.url().should('include', '/app/account/caregiver')
    cy.get('[data-test-id=caregivers-content]').should('be.visible')
  })

  it('Should navigate to the Notifications page', () => {
    if (isMobile) {
      // open the select page dropdown and click the notifications option
      cy.get('[data-test-id=mobile-account-page-select]').click({ force: true })
      cy.get('.v-list-item').should('be.visible')
      cy.get('.v-list-item').contains('Notifications').click()
    } else {
      cy.get('[data-test-id="account-left-panel-Notifications"]').click({ force: true })
    }

    cy.url().should('include', '/app/account/notification')
    cy.get('[data-test-id=notifications-content]').should('be.visible')
  })

  it('Should logout and navigate to the login screen', () => {
    if (isMobile) {
      // open the select page dropdown and click the logout option
      cy.get('[data-test-id=mobile-account-page-select]').click({ force: true })
      cy.get('.v-list-item').should('be.visible')
      cy.get('.v-list-item').contains('Logout').click()
    } else {
      cy.get('[data-test-id="account-left-panel-Logout"]').click({ force: true })
    }

    cy.url().should('include', '/auth/login')
  })
}
