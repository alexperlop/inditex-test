describe('Catalog listing', () => {
  it('renders the initial product grid (SSR-hydrated from the real API)', () => {
    cy.visit('/', { timeout: 30_000 });
    cy.get('[data-testid="product-grid"] li', { timeout: 30_000 })
      .its('length')
      .should('be.greaterThan', 0)
      .and('be.lte', 20);
    cy.get('[data-testid="result-count"]').should('contain.text', 'resultado');
  });

  it('filters via debounced search and updates the URL', () => {
    cy.visit('/');
    cy.get('[data-testid="search-input"]', { timeout: 30_000 })
      .should('be.visible')
      .type('samsung');
    cy.location('search', { timeout: 5_000 }).should('include', 'search=samsung');
    cy.get('[data-testid="result-count"]', { timeout: 10_000 }).should('contain.text', 'resultado');
    cy.get('[data-testid="product-grid"]', { timeout: 10_000 })
      .invoke('text')
      .should('match', /samsung/i);
  });
});
