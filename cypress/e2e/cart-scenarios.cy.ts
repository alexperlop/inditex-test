import { COPY, ROUTES, TEST_IDS } from '../../src/constants';

const PRODUCT_ID = 'SMG-S24U';
const VISIT = { timeout: 30_000 } as const;
const LONG = 30_000;

function addConfiguration(storageCapacity: string, colorName: string) {
  cy.visit(ROUTES.productDetail(PRODUCT_ID), VISIT);
  cy.get(`[data-testid="${TEST_IDS.STORAGE_PICKER_PREFIX}-${storageCapacity}"]`, {
    timeout: LONG,
  }).click();
  cy.get(`[data-testid="${TEST_IDS.COLOR_PICKER_PREFIX}-${colorName}"]`).click();
  cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`).click();
  cy.location('pathname').should('eq', ROUTES.CART);
}

describe('Cart scenarios', () => {
  it('shows the empty state and a continue-shopping link when there is nothing', () => {
    cy.visit(ROUTES.CART);
    cy.contains('h1', COPY.cart.EMPTY_TITLE, { timeout: LONG }).should('be.visible');
    cy.contains(COPY.cart.EMPTY_HINT).should('be.visible');
    cy.contains('a', COPY.cart.CONTINUE).should('have.attr', 'href', ROUTES.HOME);
    cy.get(`[data-testid="${TEST_IDS.CART_COUNT}"]`).should('contain.text', '0');
  });

  it('adds two different configurations as two separate lines', () => {
    addConfiguration('256 GB', 'Titanium Black');
    addConfiguration('512 GB', 'Titanium Violet');

    cy.get(`[data-testid="${TEST_IDS.CART_ITEM}"]`).should('have.length', 2);
    cy.get(`[data-testid="${TEST_IDS.CART_COUNT}"]`).should('contain.text', '2');
    cy.get(`[data-testid="${TEST_IDS.SUMMARY_TOTAL}"]`).should('contain.text', '2.558');
  });

  it('does not add duplicates when the same configuration is added twice', () => {
    addConfiguration('256 GB', 'Titanium Black');
    addConfiguration('256 GB', 'Titanium Black');
    cy.get(`[data-testid="${TEST_IDS.CART_ITEM}"]`).should('have.length', 1);
  });

  it('removes one item of several and keeps the rest', () => {
    addConfiguration('256 GB', 'Titanium Black');
    addConfiguration('512 GB', 'Titanium Violet');

    cy.get(`[data-testid="${TEST_IDS.CART_ITEM}"]`).should('have.length', 2);
    cy.get(`[data-testid="${TEST_IDS.REMOVE_ITEM}"]`).first().click();
    cy.get(`[data-testid="${TEST_IDS.CART_ITEM}"]`).should('have.length', 1);
    cy.get(`[data-testid="${TEST_IDS.CART_COUNT}"]`).should('contain.text', '1');
  });

  it('displays a heading that includes the item count', () => {
    addConfiguration('256 GB', 'Titanium Black');
    cy.contains('h1', COPY.cart.headingWithCount(1)).should('be.visible');
  });

  it('"continue shopping" link from the summary returns to the catalog', () => {
    addConfiguration('256 GB', 'Titanium Black');
    cy.contains('a', COPY.cart.CONTINUE).click();
    cy.location('pathname').should('eq', ROUTES.HOME);
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"]`, { timeout: LONG }).should('exist');
  });
});

describe('Global navigation', () => {
  it('cart nav button links to the cart page', () => {
    cy.visit(ROUTES.HOME, VISIT);
    cy.get(`[data-testid="${TEST_IDS.CART_COUNT}"]`, { timeout: LONG }).parent('a').click();
    cy.location('pathname').should('eq', ROUTES.CART);
  });

  it('home brand link returns to the catalog from the cart', () => {
    cy.visit(ROUTES.CART);
    cy.get(`header a[aria-label="${COPY.nav.HOME_ARIA}"]`).first().click();
    cy.location('pathname').should('eq', ROUTES.HOME);
  });

  it('skip link targets the main content region', () => {
    cy.visit(ROUTES.HOME, VISIT);
    cy.contains('a', COPY.nav.SKIP_TO_CONTENT).should('have.attr', 'href', '#main');
    cy.get('main#main').should('exist');
  });

  it('unknown route renders the not-found page', () => {
    cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });
    cy.contains(COPY.common.NOT_FOUND_TITLE).should('be.visible');
    cy.contains('a', COPY.common.NOT_FOUND_LINK).should('have.attr', 'href', ROUTES.HOME);
  });
});
