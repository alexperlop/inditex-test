import { COPY, ROUTES, TEST_IDS } from '../../src/constants';

describe('Full cart flow', () => {
  it('configures a phone, adds to cart, sees total, removes, and continues', () => {
    cy.visit(ROUTES.productDetail('SMG-S24U'), { timeout: 30_000 });
    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`, { timeout: 30_000 }).should('be.disabled');

    cy.get(`[data-testid="${TEST_IDS.STORAGE_PICKER_PREFIX}-256 GB"]`).click();
    cy.get(`[data-testid="${TEST_IDS.CURRENT_PRICE}"]`).should('contain.text', '1.229');
    cy.get(`[data-testid="${TEST_IDS.COLOR_PICKER_PREFIX}-Titanium Black"]`).click();

    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`).should('be.enabled').click();
    cy.location('pathname').should('eq', ROUTES.CART);
    cy.get(`[data-testid="${TEST_IDS.CART_ITEM}"]`).should('have.length', 1);
    cy.get(`[data-testid="${TEST_IDS.SUMMARY_TOTAL}"]`).should('contain.text', '1.229');
    cy.get(`[data-testid="${TEST_IDS.CART_COUNT}"]`).should('contain.text', '1');

    cy.get(`[data-testid="${TEST_IDS.REMOVE_ITEM}"]`).click();
    cy.contains(COPY.cart.EMPTY_TITLE).should('be.visible');
    cy.get(`[data-testid="${TEST_IDS.CART_COUNT}"]`).should('contain.text', '0');
  });

  it('persists the cart after a page reload (localStorage)', () => {
    cy.visit(ROUTES.productDetail('SMG-S24U'), { timeout: 30_000 });
    cy.get(`[data-testid="${TEST_IDS.STORAGE_PICKER_PREFIX}-512 GB"]`, { timeout: 30_000 }).click();
    cy.get(`[data-testid="${TEST_IDS.COLOR_PICKER_PREFIX}-Titanium Violet"]`).click();
    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`).click();
    cy.location('pathname').should('eq', ROUTES.CART);

    cy.reload();
    cy.get(`[data-testid="${TEST_IDS.CART_ITEM}"]`, { timeout: 10_000 }).should('have.length', 1);
    cy.get(`[data-testid="${TEST_IDS.SUMMARY_TOTAL}"]`).should('contain.text', '1.329');
  });
});
