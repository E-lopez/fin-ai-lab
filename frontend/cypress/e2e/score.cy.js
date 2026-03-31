describe('Score Component (mocked context)', () => {
  it('renders with mock survey data', () => {
    cy.visit('http://localhost:3000/test-score');
    cy.contains('Esteban').should('exist');
    cy.contains('8.5').should('exist');
    cy.contains('¡Sí, continuemos!').should('exist');
  });

  it('has at least 2 buttons and contains required strings', () => {
    cy.visit('http://localhost:3000/test-score');
    cy.get('button').should('have.length.at.least', 2);
    cy.contains('Esteban').should('exist');
    cy.contains('8.5').should('exist');
  });

  it('no gracias button takes user to home', () => {
    cy.visit('http://localhost:3000/test-score');
    cy.contains('button', 'No, gracias').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.visit('http://localhost:3000/test-score');
  });

  it('next button tries to open loan config', () => {
    cy.visit('http://localhost:3000/test-score');
    cy.contains('button', '¡Sí, continuemos!').click({ force: true });
    cy.url().should('eq', 'http://localhost:3000/');
  });
});