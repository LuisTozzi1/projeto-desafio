describe('Departamentos', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.loginViaApi();
    cy.visit('/departamentos');
    cy.get('[data-cy=tabela-departamentos]').should('be.visible');
  });

  it('cadastra um novo departamento com sucesso', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `CY${sufixo}`;
      const descricao = `Departamento Teste ${sufixo}`;

      cy.get('[data-cy=btn-novo-departamento]').click();
      cy.get('[data-cy=form-departamento]').should('be.visible');
      cy.get('[data-cy=input-descricao-departamento]').type(descricao);
      cy.get('[data-cy=input-codigo-departamento]').type(codigo);
      cy.get('[data-cy=btn-confirmar-departamento]').click();

      cy.get('.toast-success').should('contain', 'cadastrado com sucesso');
      cy.get('[data-cy=filtro-codigo]').clear().type(codigo);
      cy.contains('[data-cy=linha-departamento]', descricao).should('be.visible');
    });
  });

  it('impede cadastro de departamento com codigo duplicado', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `DUP${sufixo}`;

      cy.get('[data-cy=btn-novo-departamento]').click();
      cy.get('[data-cy=input-descricao-departamento]').type('Departamento Original');
      cy.get('[data-cy=input-codigo-departamento]').type(codigo);
      cy.get('[data-cy=btn-confirmar-departamento]').click();
      cy.get('.toast-success').should('be.visible');

      cy.get('[data-cy=btn-novo-departamento]').click();
      cy.get('[data-cy=input-descricao-departamento]').type('Departamento Duplicado');
      cy.get('[data-cy=input-codigo-departamento]').type(codigo);
      cy.get('[data-cy=btn-confirmar-departamento]').click();

      cy.get('[data-cy=erro-form-departamento]').should('be.visible').and('contain', codigo);
    });
  });

  it('edita um departamento existente', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `EDT${sufixo}`;
      const descricaoOriginal = `Depto Antes ${sufixo}`;
      const descricaoEditada = `Depto Depois ${sufixo}`;

      cy.get('[data-cy=btn-novo-departamento]').click();
      cy.get('[data-cy=input-descricao-departamento]').type(descricaoOriginal);
      cy.get('[data-cy=input-codigo-departamento]').type(codigo);
      cy.get('[data-cy=btn-confirmar-departamento]').click();
      cy.get('.toast-success').should('be.visible');

      cy.get('[data-cy=filtro-codigo]').clear().type(codigo);
      cy.contains('[data-cy=linha-departamento]', descricaoOriginal)
        .find('[data-cy=btn-editar-departamento]')
        .click();

      cy.get('[data-cy=input-descricao-departamento]').clear().type(descricaoEditada);
      cy.get('[data-cy=btn-confirmar-departamento]').click();
      cy.get('.toast-success').should('contain', 'atualizado com sucesso');

      cy.get('[data-cy=filtro-codigo]').clear().type(codigo);
      cy.contains('[data-cy=linha-departamento]', descricaoEditada).should('be.visible');
    });
  });

  it('pesquisa por descricao e codigo filtra a listagem', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `SRCH${sufixo}`;
      const descricao = `Pesquisavel ${sufixo}`;

      cy.get('[data-cy=btn-novo-departamento]').click();
      cy.get('[data-cy=input-descricao-departamento]').type(descricao);
      cy.get('[data-cy=input-codigo-departamento]').type(codigo);
      cy.get('[data-cy=btn-confirmar-departamento]').click();
      cy.get('.toast-success').should('be.visible');

      cy.get('[data-cy=filtro-descricao]').clear().type('Pesquisavel-Nao-Existe');
      cy.get('.table-empty').should('be.visible');

      cy.get('[data-cy=filtro-descricao]').clear().type(descricao);
      cy.contains('[data-cy=linha-departamento]', descricao).should('be.visible');
    });
  });

  it('exibe paginacao quando ha registros suficientes', () => {
    cy.get('[data-cy=pagination]').should('be.visible');
  });

  it('gera e baixa o relatorio de departamentos', () => {
    cy.get('[data-cy=btn-relatorio-departamentos]').click();
    cy.get('.toast-success', { timeout: 10000 }).should('contain', 'baixado com sucesso');
  });
});
