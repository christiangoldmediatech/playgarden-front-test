describe('/app/music', () => {
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'https://apidev.playgardenonline.com/auth/login',
      body: {
        email: Cypress.env('parentEmail'),
        password: Cypress.env('parentPassword')
      }
    }).its('body').then(body => {
      window.localStorage.setItem('authToken', JSON.stringify(body.accessToken))

      const oneDay = 8.6e7
      window.localStorage.setItem('selectedChild', JSON.stringify({
        value: [86], // Ana
        expires: Date.now() + oneDay
      }))

      cy.visit('/app/dashboard')

      cy.get('[data-test-id=app-music]').click()
    })
  })

  it('loads music page successfully', () => {
    cy.url().should('include', '/app/music')
  })
})