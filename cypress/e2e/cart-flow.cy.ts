describe('Full cart flow', () => {
  it('configures a phone, adds to cart, sees total, removes, and continues', () => {
    cy.visit('/products/SMG-S24U', { timeout: 30_000 });
    cy.get('[data-testid="add-to-cart"]', { timeout: 30_000 }).should('be.disabled');

    cy.get('[data-testid="storage-256 GB"]').click();
    cy.get('[data-testid="current-price"]').should('contain.text', '1.229');
    cy.get('[data-testid="color-Titanium Black"]').click();

    cy.get('[data-testid="add-to-cart"]').should('be.enabled').click();
    cy.location('pathname').should('eq', '/cart');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.get('[data-testid="summary-total"]').should('contain.text', '1.229');
    cy.get('[data-testid="cart-count"]').should('contain.text', '1');

    cy.get('[data-testid="remove-item"]').click();
    cy.contains('Tu carrito está vacío').should('be.visible');
    cy.get('[data-testid="cart-count"]').should('contain.text', '0');
  });

  it('persists the cart after a page reload (localStorage)', () => {
    cy.visit('/products/SMG-S24U', { timeout: 30_000 });
    cy.get('[data-testid="storage-512 GB"]', { timeout: 30_000 }).click();
    cy.get('[data-testid="color-Titanium Violet"]').click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.location('pathname').should('eq', '/cart');

    cy.reload();
    cy.get('[data-testid="cart-item"]', { timeout: 10_000 }).should('have.length', 1);
    cy.get('[data-testid="summary-total"]').should('contain.text', '1.329');
  });
});
