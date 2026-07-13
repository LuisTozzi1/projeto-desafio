import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    defaultCommandTimeout: 8000,
    viewportWidth: 1440,
    viewportHeight: 900,
    env: {
      apiUrl: 'http://localhost:8080/api',
    },
  },
});
