/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente', function () {
    const THREE_SECONDS_IN_MS =  3000

    beforeEach(function () {
        cy.visit('./src/index.html');
    })

    it('Verifica o título da aplicação', function() {        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
    })


    it('Envio do formulário com sucesso', function() {
        const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id turpis ultricies, tincidunt ex a, sagittis lectus. Nulla eu fermentum nisl, et bibendum eros. Vestibulum sit amet libero posuere velit volutpat viverra ut ac erat. Vivamus dolor quam, elementum id blandit vel, semper ut turpis. Maecenas quis nunc ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla facilisi. Nam elementum elit ut mi efficitur, id porttitor sapien dapibus. Suspendisse potenti. Pellentesque vel dignissim purus, id blandit est. Etiam pulvinar aliquet augue in maximus. Vivamus vel nibh placerat, vestibulum tortor et, interdum justo. Curabitur rutrum nec nunc in dapibus. In vel augue interdum, vestibulum lacus eu, tincidunt ligula.'

        cy.clock()

        cy.get('#firstName').type('Joãozinho')
        cy.get('#lastName').type('De Jesus')
        cy.get('#email').type('joazinho@mail.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()
        cy.get('#firstName').type('Joãozinho')
        cy.get('#lastName').type('De Jesus')
        cy.get('#email').type('joazinhomail.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('Campo de telefone continua vazio quando preenchdido com valor não numérico', function() {
        cy.get('#phone')
            .type('valornãonumerico1')
            .should('have.value', '')
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()
        cy.get('#firstName').type('Joãozinho')
        cy.get('#lastName').type('De Jesus')
        cy.get('#email').type('joazinho@@mail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
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
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('Envia o formulário com sucesso usando um comando customizado', function(){
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
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

    it('Seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('Marca o tipo Feedback', function() {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('Marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio){
                cy.wrap($radio)
                    .check()
                    .should('be.checked')
            })
    })

    it('Marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('Seleciona um arquivo da pasta fixtures', function(){
        cy.get('#file-upload')
            .should("not.have.value")
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('#file-upload')
            .should("not.have.value")
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })

    })

    it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
            .selectFile('@sampleFile')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('Acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Não salvamos dados submetidos no formulário da aplicação CAC TAT.')
            .should('be.visible')
    })

    it('Exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

    it('Preenche a area de texto usando o comando invoke', function() {
        const longText = Cypress._.repeat('0123456789', 20)
        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('Faz uma requisição HTTP do tipo GET', function(){
        cy.request({
                method: 'GET',
                url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK')
                expect(response.body).to.contains('CAC TAT')
            })
    })

    it('Encontra o gato escondido', function(){
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')

        cy.get('#title')
            .invoke('text', 'Skull 💀')
            .should('have.text', 'Skull 💀')
    })

})
