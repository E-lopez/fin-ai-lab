Cypress.Commands.add('checkSubmitButtonDisabledAndTryClick', () => {
  cy.get('input[type="submit"]')
    .should('exist')
    .then(($btn) => {
      cy.wrap($btn).click({ force: true });
      // Verify that the button is still disabled after click
      cy.location('pathname').should('eq', '/survey');
  });
});

Cypress.Commands.add('getUniqueId', () => {
    const uniqueSeed = Date.now().toString();
    const uniqueId = Cypress._.uniqueId(uniqueSeed);
    return uniqueId;
  }
);

Cypress.Commands.add('checkAndCloseDialog', () => {
    cy.get('dialog').should('exist');
    cy.get('.base-modal__main > .u-center-v').should('exist');
    cy.get('.base-button > .base-button__button').click({ force: true });
    cy.get('dialog').should('not.exist');
}
);

Cypress.Commands.add('checkSurveySectionForm', () => {
    cy.contains('¿Cómo te identificas en las siguientes situaciones?').should('exist');
    cy.contains('Selecciona de 1 a 5').should('exist');
    
    // There should be at least two link-buttons
    cy.get('form').should('have.length.at.least', 1);
    cy.get('button').should('have.length.at.least', 1);
    cy.get('div.survey-form__likert').should('have.length.at.least', 4)
      .each(($div) => {
        cy.wrap($div).find('button').should('have.length', 5).each(($btn) => {
            // Click only the last button in each likert row
            if ($btn.is(':last-child')) {
            cy.wrap($btn).click({ force: true });
            }
        });
      });
}
);