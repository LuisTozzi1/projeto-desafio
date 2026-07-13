const USERNAME = 'admin';
const SENHA = 'admin123';

/**
 * Faz login pela interface de verdade (usado no teste dedicado de login).
 */
Cypress.Commands.add('loginViaUI', () => {
  cy.visit('/login');
  cy.get('[data-cy=login-username]').type(USERNAME);
  cy.get('[data-cy=login-password]').type(SENHA);
  cy.get('[data-cy=login-submit]').click();
  cy.url().should('include', '/funcionarios');
});

/**
 * Faz login direto via API e injeta o token no localStorage,
 * para os demais testes nao perderem tempo repetindo o fluxo de login.
 */
Cypress.Commands.add('loginViaApi', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
    username: USERNAME,
    senha: SENHA,
  }).then((response) => {
    window.localStorage.setItem('dixi_token', response.body.token);
    window.localStorage.setItem('dixi_username', response.body.username);
  });
});

/**
 * Gera um sufixo unico (timestamp) para evitar colisao de dados
 * (codigos/CPFs/matriculas unicos) entre execucoes de teste.
 */
Cypress.Commands.add('sufixoUnico', () => {
  return Date.now().toString().slice(-8);
});
