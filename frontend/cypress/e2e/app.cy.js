const viewports = [
  { name: 'desktop-xl', width: 1440, height: 800 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile-lg', width: 425, height: 850 },
];

viewports.forEach(({ name, width, height }) => {
  describe(`Loan Client App E2E - ${name} viewport`, () => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it('loads the home page and navigates to consent', () => {
      cy.visit('http://localhost:3000/');

      cy.contains('Un préstamo que').should('exist');
      cy.get('a[href*="guide"]').last().click();
      cy.contains('¿Cómo funciona?').should('exist');
      cy.contains('¡Empecemos!').should('exist');
      cy.get('a[href*="survey"]').click();
      cy.get('button').should('have.length.at.least', 2);
      cy.get('input').should('have.length.at.least', 1);
      cy.contains('button', 'Términos y condiciones').click();
      cy.get('.base-modal__main > .u-center-v');
      cy.get('.base-button > .base-button__button').click({ force: true });
      cy.get('dialog').should('not.exist');
      cy.get('input[type="checkbox"]').should('exist');
      cy.checkSubmitButtonDisabledAndTryClick();
      cy.get('input[type="checkbox"]').first().check({ force: true });
      cy.get('input[type="submit"]').click({ force: true });
      cy.location('pathname').should('eq', '/survey');
      cy.contains('Cuéntanos un poco sobre tí').should('exist');
      cy.get('form').should('exist');
      cy.get('input').should('have.length.at.least', 3);
      cy.checkSubmitButtonDisabledAndTryClick();
      cy.get('input').eq(0).type('Esteban Lopez');
      cy.getUniqueId().then((uniqueId) => {
        cy.get('input').eq(1).type(uniqueId, { force: true  });
      });
      cy.get('input').eq(2).type('esteban@example.com');
      cy.get('input').eq(3).type('1980-01-01');
      cy.get('#gender').select('F', { force: true });
      cy.get('#occupation').select('Empleado',  { force: true });
      cy.getUniqueId().then((uniqueId) => {
        cy.intercept('POST', `/user/by-userId?userId=${uniqueId}`, {
          statusCode: 200,
          body: { exists: false },
        }).as('checkUserId');
        cy.get('input[type="submit"]').should('not.be.disabled').click({ force: true });
      });
      for (let i = 1; i <= 10; i++) {
        cy.contains(`${i} de 10`).should('exist');
        cy.checkSurveySectionForm();
        if (i < 11) {
          cy.get('input[type="submit"]').should('not.be.disabled').click({ force: true });
        }
      }
      cy.get('.base-button__button').should('not.be.disabled');
      cy.intercept('POST', '/composer/createUser', {
        statusCode: 200,
        body: { success: true, userId: 'mocked-user-id', riskLevel: 8.0 },
      }).as('createUser');
      cy.visit('http://localhost:3000/score');
      cy.location('pathname').should('eq', '/');
    });
  });
});
