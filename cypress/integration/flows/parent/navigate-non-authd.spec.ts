export {}

const baseUrl = Cypress.config('baseUrl')

describe('flows/parent/navigate-non-authd.spec.ts', () => {
  describe(
    'Mobile',
    { viewportHeight: 667, viewportWidth: 375 },
    () => main()
  )

  describe(
    'Desktop',
    { viewportHeight: 768, viewportWidth: 1280 },
    () => main()
  )
})

interface Main {
  isMobile: boolean
}

function main() {
  it('Should navigate to the login page', () => {
    cy.visit('/auth/login')
  })

  it('Should navigate to the Signup page', () => {
    cy.visit('/auth/parent')
    cy.url().should('eq', `${baseUrl}/auth/normal/parent`)
    cy.get('[data-test-id=signup-content]').should('be.visible')
  })

  it('Should navigate to the Help page', () => {
    cy.visit('/help')
    cy.url().should('eq', `${baseUrl}/help`)
    cy.get('[data-test-id=help-content]').should('be.visible')
  })

  it('Should navigate to the Privacy Policy page', () => {
    cy.visit('/privacy-policy')
    cy.url().should('eq', `${baseUrl}/privacy-policy`)
    cy.get('[data-test-id=privacy-policy-content]').should('be.visible')
  })

  it('Should navigate to the Terms and Conditions page', () => {
    cy.visit('/terms-conditions')
    cy.url().should('eq', `${baseUrl}/terms-conditions`)
    cy.get('[data-test-id=terms-conditions-content]').should('be.visible')
  })

  it('Should navigate to the Gift of Learning', () => {
    cy.visit('/promo/gift-of-learning')
    cy.url().should('eq', `${baseUrl}/promo/gift-of-learning`)
    cy.get('[data-test-id=gift-of-learning-content]').should('be.visible')
  })
}
