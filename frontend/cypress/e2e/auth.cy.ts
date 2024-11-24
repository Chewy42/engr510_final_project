describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should show login page by default', () => {
    cy.findByText(/Sign in to your account/i).should('exist');
  });

  it('should show validation errors for invalid input', () => {
    cy.findByLabelText(/Email/i).type('invalid-email');
    cy.findByLabelText(/Password/i).type('short');
    cy.findByRole('button', { name: /Sign in/i }).click();
    cy.findByText(/Invalid email format/i).should('exist');
  });

  it('should handle successful login', () => {
    cy.findByLabelText(/Email/i).type('test@example.com');
    cy.findByLabelText(/Password/i).type('password123');
    cy.findByRole('button', { name: /Sign in/i }).click();
    cy.findByText(/Welcome/i).should('exist');
  });

  it('should handle failed login', () => {
    cy.findByLabelText(/Email/i).type('wrong@example.com');
    cy.findByLabelText(/Password/i).type('wrongpassword');
    cy.findByRole('button', { name: /Sign in/i }).click();
    cy.findByText(/Invalid credentials/i).should('exist');
  });
});
