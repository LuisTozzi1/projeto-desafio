describe('Login', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('redireciona para o login quando nao autenticado', () => {
    cy.visit('/funcionarios');
    cy.url().should('include', '/login');
  });

  it('exibe erro com credenciais invalidas', () => {
    cy.visit('/login');
    cy.get('[data-cy=login-username]').type('usuario-invalido');
    cy.get('[data-cy=login-password]').type('senha-errada');
    cy.get('[data-cy=login-submit]').click();
    cy.get('[data-cy=login-error]').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('faz login com sucesso e chega na tela de funcionarios', () => {
    cy.loginViaUI();
    cy.contains('h1', 'Funcionários').should('be.visible');
    cy.get('[data-cy=logout-button]').should('be.visible');
  });

  it('faz logout e volta para o login', () => {
    cy.loginViaUI();
    cy.get('[data-cy=logout-button]').click();
    cy.url().should('include', '/login');
  });
});
