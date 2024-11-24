import '@testing-library/cypress/add-commands';

// Add custom commands here if needed
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/');
  cy.findByLabelText(/Email/i).type(email);
  cy.findByLabelText(/Password/i).type(password);
  cy.findByRole('button', { name: /Sign in/i }).click();
});
