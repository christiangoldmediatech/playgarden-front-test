// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('uiLoginAs', (user: 'parent' | 'admin') => {
  const payload = { email: '', password: '', url: '' }

  switch (user) {
    case 'parent':
      payload.email = Cypress.env('parentEmail'),
      payload.password = Cypress.env('parentPassword')
      payload.url = '/app/pick-child'
      break
    case 'admin':
      payload.email = Cypress.env('adminEmail'),
      payload.password = Cypress.env('adminPassword')
      payload.url = '/admin/dashboard'
      break
  }

  cy.visit('/auth/logout')

  cy.get('[data-test-id=email-field]').type(payload.email)
  cy.get('[data-test-id=password-field]').type(payload.password)
  cy.get('[data-test-id=login-button]').click()

  cy.url().should('include', payload.url)
})

Cypress.Commands.add('headlessLoginAs', (user: 'parent' | 'admin') => {
  const payload = { email: '', password: '' }

  switch (user) {
    case 'parent':
      payload.email = Cypress.env('parentEmail'),
      payload.password = Cypress.env('parentPassword')
      break
    case 'admin':
      payload.email = Cypress.env('adminEmail'),
      payload.password = Cypress.env('adminPassword')
      break
  }

  return cy.request({
    method: 'POST',
    url: 'https://apidev.playgardenonline.com/auth/login',
    body: {
      email: payload.email,
      password: payload.password
    }
  }).its('body').then(body => {
    window.localStorage.setItem('authToken', JSON.stringify(body.accessToken))
  })
})

const tomorrow = Date.now() + 8.6e7

Cypress.Commands.add('headlessChildrenFetch', () => {
  const token = JSON.parse(window.localStorage.getItem('authToken'))

  return cy.request({
    method: 'GET',
    url: 'https://apidev.playgardenonline.com/children',
    headers: {
      authorization: `Bearer ${token}`
    }
  })
    .its('body')
})

Cypress.Commands.add('headlessChildSelect', (childId: number, expires: number = tomorrow) => {
  window.localStorage.setItem('selectedChild', JSON.stringify({
    value: [childId],
    expires: expires
  }))
})