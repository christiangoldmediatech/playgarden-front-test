describe('/auth/login', () => {
  afterEach(() => {
    cy.visit('/auth/logout')
  })

  it('logs in as an admin', () => {
    cy.visit('/auth/login')
    cy.uiLoginAs('admin')
  })

  it('logs in as a parent', () => {
    cy.visit('/auth/login')
    cy.uiLoginAs('parent')
  })
})
