// Runs before every spec file. Use this to configure global behavior.

// Prevent uncaught app errors from breaking tests when they are not the SUT.
Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  cy.window({ log: false }).then((win) => {
    win.localStorage.clear();
  });
});
