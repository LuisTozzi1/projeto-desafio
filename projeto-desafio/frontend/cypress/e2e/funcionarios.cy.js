describe('Funcionarios', () => {
  let cargoDescricao;
  let departamentoDescricao;
  let token;

  before(() => {
    cy.visit('/login');
    cy.loginViaApi();
    cy.window().then((win) => {
      token = win.localStorage.getItem('dixi_token');
    });

    cy.sufixoUnico().then((sufixo) => {
      cargoDescricao = `Cargo E2E ${sufixo}`;
      departamentoDescricao = `Depto E2E ${sufixo}`;

      cy.then(() => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/cargos`,
          headers: { Authorization: `Bearer ${token}` },
          body: { codigo: `CGE2E${sufixo}`, descricao: cargoDescricao },
        });
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/departamentos`,
          headers: { Authorization: `Bearer ${token}` },
          body: { codigo: `DPE2E${sufixo}`, descricao: departamentoDescricao },
        });
      });
    });
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.loginViaApi();
    cy.visit('/funcionarios');
    cy.get('[data-cy=tabela-funcionarios]').should('be.visible');
  });

  function cpfValidoUnico(sufixo) {
    // Gera 11 digitos numericos unicos (nao valida digito verificador real,
    // a regra de negocio da API so exige 11 digitos numericos).
    return `9${sufixo}`.padEnd(11, '0').slice(0, 11);
  }

  it('cadastra um funcionario com um vinculo', () => {
    cy.sufixoUnico().then((sufixo) => {
      const nome = `Funcionario Teste ${sufixo}`;
      const cpf = cpfValidoUnico(sufixo);

      cy.get('[data-cy=btn-novo-funcionario]').click();
      cy.get('[data-cy=form-funcionario]').should('be.visible');
      cy.get('[data-cy=input-nome-funcionario]').type(nome);
      cy.get('[data-cy=input-cpf-funcionario]').type(cpf);

      cy.get('[data-cy=btn-novo-vinculo]').click();
      cy.get('[data-cy=form-vinculo]').should('be.visible');
      cy.get('[data-cy=input-empresa-vinculo]').type('Dixi Ponto');
      cy.get('[data-cy=input-matricula-vinculo]').type(`MAT${sufixo}`);
      cy.get('[data-cy=select-cargo-vinculo]').select(cargoDescricao);
      cy.get('[data-cy=select-departamento-vinculo]').select(departamentoDescricao);
      cy.get('[data-cy=btn-confirmar-vinculo]').click();

      cy.contains('[data-cy=linha-vinculo]', 'Dixi Ponto').should('be.visible');

      cy.get('[data-cy=btn-salvar-funcionario]').click();
      cy.get('.toast-success').should('contain', 'cadastrado com sucesso');

      cy.get('[data-cy=filtro-nome]').clear().type(nome);
      cy.contains('[data-cy=linha-funcionario]', nome).should('be.visible');
    });
  });

  it('impede cadastro de funcionario com CPF duplicado', () => {
    cy.sufixoUnico().then((sufixo) => {
      const cpf = cpfValidoUnico(sufixo);

      // primeiro cadastro
      cy.get('[data-cy=btn-novo-funcionario]').click();
      cy.get('[data-cy=input-nome-funcionario]').type(`Original ${sufixo}`);
      cy.get('[data-cy=input-cpf-funcionario]').type(cpf);
      cy.get('[data-cy=btn-novo-vinculo]').click();
      cy.get('[data-cy=input-empresa-vinculo]').type('Dixi Ponto');
      cy.get('[data-cy=input-matricula-vinculo]').type(`MATA${sufixo}`);
      cy.get('[data-cy=select-cargo-vinculo]').select(cargoDescricao);
      cy.get('[data-cy=select-departamento-vinculo]').select(departamentoDescricao);
      cy.get('[data-cy=btn-confirmar-vinculo]').click();
      cy.get('[data-cy=btn-salvar-funcionario]').click();
      cy.get('.toast-success').should('be.visible');

      // segundo cadastro com o mesmo CPF
      cy.get('[data-cy=btn-novo-funcionario]').click();
      cy.get('[data-cy=input-nome-funcionario]').type(`Duplicado ${sufixo}`);
      cy.get('[data-cy=input-cpf-funcionario]').type(cpf);
      cy.get('[data-cy=btn-novo-vinculo]').click();
      cy.get('[data-cy=input-empresa-vinculo]').type('Outra Empresa');
      cy.get('[data-cy=input-matricula-vinculo]').type(`MATB${sufixo}`);
      cy.get('[data-cy=select-cargo-vinculo]').select(cargoDescricao);
      cy.get('[data-cy=select-departamento-vinculo]').select(departamentoDescricao);
      cy.get('[data-cy=btn-confirmar-vinculo]').click();
      cy.get('[data-cy=btn-salvar-funcionario]').click();

      cy.get('[data-cy=erro-form-funcionario]').should('be.visible').and('contain', 'CPF');
    });
  });

  it('edita um funcionario e seu vinculo existente', () => {
    cy.sufixoUnico().then((sufixo) => {
      const nome = `Editar Antes ${sufixo}`;
      const nomeEditado = `Editar Depois ${sufixo}`;
      const cpf = cpfValidoUnico(sufixo);

      cy.get('[data-cy=btn-novo-funcionario]').click();
      cy.get('[data-cy=input-nome-funcionario]').type(nome);
      cy.get('[data-cy=input-cpf-funcionario]').type(cpf);
      cy.get('[data-cy=btn-novo-vinculo]').click();
      cy.get('[data-cy=input-empresa-vinculo]').type('Dixi Ponto');
      cy.get('[data-cy=input-matricula-vinculo]').type(`MATE${sufixo}`);
      cy.get('[data-cy=select-cargo-vinculo]').select(cargoDescricao);
      cy.get('[data-cy=select-departamento-vinculo]').select(departamentoDescricao);
      cy.get('[data-cy=btn-confirmar-vinculo]').click();
      cy.get('[data-cy=btn-salvar-funcionario]').click();
      cy.get('.toast-success').should('be.visible');

      cy.get('[data-cy=filtro-nome]').clear().type(nome);
      cy.contains('[data-cy=linha-funcionario]', nome)
        .find('[data-cy=btn-editar-funcionario]')
        .click();

      cy.get('[data-cy=input-nome-funcionario]').clear().type(nomeEditado);

      // edita a matricula do vinculo existente
      cy.get('[data-cy=btn-editar-vinculo]').first().click();
      cy.get('[data-cy=input-matricula-vinculo]').clear().type(`MATE${sufixo}-V2`);
      cy.get('[data-cy=btn-confirmar-vinculo]').click();

      cy.get('[data-cy=btn-salvar-funcionario]').click();
      cy.get('.toast-success').should('contain', 'atualizado com sucesso');

      cy.get('[data-cy=filtro-nome]').clear().type(nomeEditado);
      cy.contains('[data-cy=linha-funcionario]', nomeEditado).should('be.visible');
    });
  });

  it('pesquisa por nome, cpf, empresa, cargo e departamento', () => {
    cy.sufixoUnico().then((sufixo) => {
      const nome = `Pesquisavel ${sufixo}`;
      const cpf = cpfValidoUnico(sufixo);

      cy.get('[data-cy=btn-novo-funcionario]').click();
      cy.get('[data-cy=input-nome-funcionario]').type(nome);
      cy.get('[data-cy=input-cpf-funcionario]').type(cpf);
      cy.get('[data-cy=btn-novo-vinculo]').click();
      cy.get('[data-cy=input-empresa-vinculo]').type('Empresa Pesquisavel');
      cy.get('[data-cy=input-matricula-vinculo]').type(`MATP${sufixo}`);
      cy.get('[data-cy=select-cargo-vinculo]').select(cargoDescricao);
      cy.get('[data-cy=select-departamento-vinculo]').select(departamentoDescricao);
      cy.get('[data-cy=btn-confirmar-vinculo]').click();
      cy.get('[data-cy=btn-salvar-funcionario]').click();
      cy.get('.toast-success').should('be.visible');

      // filtro por nome
      cy.get('[data-cy=filtro-nome]').clear().type(nome);
      cy.contains('[data-cy=linha-funcionario]', nome).should('be.visible');
      cy.get('[data-cy=filtro-nome]').clear();

      // filtro por CPF
      cy.get('[data-cy=filtro-cpf]').clear().type(cpf);
      cy.contains('[data-cy=linha-funcionario]', nome).should('be.visible');
      cy.get('[data-cy=filtro-cpf]').clear();

      // filtro por empresa
      cy.get('[data-cy=filtro-empresa]').clear().type('Empresa Pesquisavel');
      cy.contains('[data-cy=linha-funcionario]', nome).should('be.visible');
      cy.get('[data-cy=filtro-empresa]').clear();

      // filtro por cargo
      cy.get('[data-cy=filtro-cargo]').select(cargoDescricao);
      cy.contains('[data-cy=linha-funcionario]', nome).should('be.visible');
      cy.get('[data-cy=filtro-cargo]').select('');

      // filtro por departamento
      cy.get('[data-cy=filtro-departamento]').select(departamentoDescricao);
      cy.contains('[data-cy=linha-funcionario]', nome).should('be.visible');
    });
  });

  it('exibe paginacao na listagem', () => {
    cy.get('[data-cy=pagination]').should('be.visible');
  });

  it('gera e baixa o relatorio de funcionarios', () => {
    cy.get('[data-cy=btn-relatorio-funcionarios]').click();
    cy.get('.toast-success', { timeout: 10000 }).should('contain', 'baixado com sucesso');
  });
});
