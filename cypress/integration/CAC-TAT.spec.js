/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente', function () {

    beforeEach(function () {
        cy.visit('./src/index.html');
    })

    it('Verifica o título da aplicação', function() {        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
    })


    it('Envio do formulário com sucesso', function() {
        const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id turpis ultricies, tincidunt ex a, sagittis lectus. Nulla eu fermentum nisl, et bibendum eros. Vestibulum sit amet libero posuere velit volutpat viverra ut ac erat. Vivamus dolor quam, elementum id blandit vel, semper ut turpis. Maecenas quis nunc ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla facilisi. Nam elementum elit ut mi efficitur, id porttitor sapien dapibus. Suspendisse potenti. Pellentesque vel dignissim purus, id blandit est. Etiam pulvinar aliquet augue in maximus. Vivamus vel nibh placerat, vestibulum tortor et, interdum justo. Curabitur rutrum nec nunc in dapibus. In vel augue interdum, vestibulum lacus eu, tincidunt ligula.'

        cy.get('#firstName').type('Joãozinho')
        cy.get('#lastName').type('De Jesus')
        cy.get('#email').type('joazinho@mail.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Joãozinho')
        cy.get('#lastName').type('De Jesus')
        cy.get('#email').type('joazinhomail.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Campo de telefone continua vazio quando preenchdido com valor não numérico', function() {
        cy.get('#phone')
            .type('valornãonumerico1')
            .should('have.value', '')
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Joãozinho')
        cy.get('#lastName').type('De Jesus')
        cy.get('#email').type('joazinho@@mail.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('teste')

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('Preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('Joãozinho')
            .should('have.value', 'Joãozinho')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('De Jesus')
            .should('have.value', 'De Jesus')
            .clear()
            .should('have.value', '')

        cy.get('#email')
            .type('joazinho@@mail.com')
            .should('have.value', 'joazinho@@mail.com')
            .clear()
            .should('have.value', '')

        cy.get('#phone')
            .type('55964654564')
            .should('have.value', '55964654564')
            .clear()
            .should('have.value', '')
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('Envia o formulário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    })

    it('Seleciona um produto (YouTube)', function(){
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

})
