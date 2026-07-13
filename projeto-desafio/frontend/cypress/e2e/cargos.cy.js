describe('Cargos', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.loginViaApi();
    cy.visit('/cargos');
    cy.get('[data-cy=tabela-cargos]').should('be.visible');
  });

  it('cadastra um novo cargo com sucesso', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `CY${sufixo}`;
      const descricao = `Cargo Teste ${sufixo}`;

      cy.get('[data-cy=btn-novo-cargo]').click();
      cy.get('[data-cy=form-cargo]').should('be.visible');
      cy.get('[data-cy=input-descricao-cargo]').type(descricao);
      cy.get('[data-cy=input-codigo-cargo]').type(codigo);
      cy.get('[data-cy=btn-confirmar-cargo]').click();

      cy.get('.toast-success').should('contain', 'cadastrado com sucesso');
      cy.get('[data-cy=filtro-codigo]').clear().type(codigo);
      cy.contains('[data-cy=linha-cargo]', descricao).should('be.visible');
    });
  });

  it('impede cadastro de cargo com codigo duplicado', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `DUP${sufixo}`;

      // primeiro cadastro (deve funcionar)
      cy.get('[data-cy=btn-novo-cargo]').click();
      cy.get('[data-cy=input-descricao-cargo]').type('Cargo Original');
      cy.get('[data-cy=input-codigo-cargo]').type(codigo);
      cy.get('[data-cy=btn-confirmar-cargo]').click();
      cy.get('.toast-success').should('be.visible');

      // segundo cadastro com o mesmo codigo (deve falhar)
      cy.get('[data-cy=btn-novo-cargo]').click();
      cy.get('[data-cy=input-descricao-cargo]').type('Cargo Duplicado');
      cy.get('[data-cy=input-codigo-cargo]').type(codigo);
      cy.get('[data-cy=btn-confirmar-cargo]').click();

      cy.get('[data-cy=erro-form-cargo]').should('be.visible').and('contain', codigo);
    });
  });

  it('edita um cargo existente', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `EDT${sufixo}`;
      const descricaoOriginal = `Cargo Antes ${sufixo}`;
      const descricaoEditada = `Cargo Depois ${sufixo}`;

      cy.get('[data-cy=btn-novo-cargo]').click();
      cy.get('[data-cy=input-descricao-cargo]').type(descricaoOriginal);
      cy.get('[data-cy=input-codigo-cargo]').type(codigo);
      cy.get('[data-cy=btn-confirmar-cargo]').click();
      cy.get('.toast-success').should('be.visible');

      cy.get('[data-cy=filtro-codigo]').clear().type(codigo);
      cy.contains('[data-cy=linha-cargo]', descricaoOriginal)
        .find('[data-cy=btn-editar-cargo]')
        .click();

      cy.get('[data-cy=input-descricao-cargo]').clear().type(descricaoEditada);
      cy.get('[data-cy=btn-confirmar-cargo]').click();
      cy.get('.toast-success').should('contain', 'atualizado com sucesso');

      cy.get('[data-cy=filtro-codigo]').clear().type(codigo);
      cy.contains('[data-cy=linha-cargo]', descricaoEditada).should('be.visible');
    });
  });

  it('pesquisa por descricao e codigo filtra a listagem', () => {
    cy.sufixoUnico().then((sufixo) => {
      const codigo = `SRCH${sufixo}`;
      const descricao = `Pesquisavel ${sufixo}`;

      cy.get('[data-cy=btn-novo-cargo]').click();
      cy.get('[data-cy=input-descricao-cargo]').type(descricao);
      cy.get('[data-cy=input-codigo-cargo]').type(codigo);
      cy.get('[data-cy=btn-confirmar-cargo]').click();
      cy.get('.toast-success').should('be.visible');

      cy.get('[data-cy=filtro-descricao]').clear().type('Pesquisavel-Nao-Existe');
      cy.get('.table-empty').should('be.visible');

      cy.get('[data-cy=filtro-descricao]').clear().type(descricao);
      cy.contains('[data-cy=linha-cargo]', descricao).should('be.visible');
    });
  });

  it('exibe paginacao quando ha registros suficientes', () => {
    cy.get('[data-cy=pagination]').should('be.visible');
  });

  it('gera e baixa o relatorio de cargos', () => {
    cy.get('[data-cy=btn-relatorio-cargos]').click();
    cy.get('.toast-success', { timeout: 10000 }).should('contain', 'baixado com sucesso');
  });
});
