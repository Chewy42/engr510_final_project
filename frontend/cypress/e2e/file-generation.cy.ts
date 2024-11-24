describe('File Generation', () => {
  beforeEach(() => {
    // Visit the file generation page
    cy.visit('/file-generation');
  });

  it('should display file tree and preview components', () => {
    // Check if main components are present
    cy.get('[data-testid="file-tree"]').should('exist');
    cy.get('[data-testid="file-preview"]').should('exist');
  });

  it('should allow file selection in the tree', () => {
    // Click on a file in the tree
    cy.get('[data-testid="file-tree-item"]').first().click();
    
    // Verify preview updates
    cy.get('[data-testid="file-preview"]').should('not.be.empty');
  });

  it('should handle project export', () => {
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Verify export progress is shown
    cy.get('[data-testid="export-progress"]').should('exist');
  });
});
