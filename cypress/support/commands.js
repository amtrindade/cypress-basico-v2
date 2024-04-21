Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Joãozinho')
    cy.get('#lastName').type('De Jesus')
    cy.get('#email').type('joazinho@mail.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})
