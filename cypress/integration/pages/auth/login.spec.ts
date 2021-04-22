describe('/auth/login', () => {
  it('loads page successfully', () => {
    cy.visit('/auth/login')
    cy.url().should('include', '/auth/login')
  })

  it('logs in as an admin', () => {
    cy.uiLoginAs('admin')
    cy.visit('/auth/logout')
  })

  it.only('logs in as a parent', () => {
    cy.uiLoginAs('parent')
    cy.uiChildSelect(1)
  })
})