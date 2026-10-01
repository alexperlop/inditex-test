import { COPY, ROUTES, TEST_IDS } from '../../src/constants';

const PRODUCT_ID = 'SMG-S24U';
const VISIT = { timeout: 30_000 } as const;
const LONG = 30_000;

describe('Product detail scenarios', () => {
  it('keeps Add to cart disabled until color + storage are chosen', () => {
    cy.visit(ROUTES.productDetail(PRODUCT_ID), VISIT);
    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`, { timeout: LONG }).should('be.disabled');
    cy.get(`[data-testid="${TEST_IDS.STORAGE_PICKER_PREFIX}-256 GB"]`).click();
    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`).should('be.disabled');
    cy.get(`[data-testid="${TEST_IDS.COLOR_PICKER_PREFIX}-Titanium Black"]`).click();
    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`).should('be.enabled');
  });

  it('updates the current price when a different storage is chosen', () => {
    cy.visit(ROUTES.productDetail(PRODUCT_ID), VISIT);
    cy.get(`[data-testid="${TEST_IDS.STORAGE_PICKER_PREFIX}-256 GB"]`, { timeout: LONG }).click();
    cy.get(`[data-testid="${TEST_IDS.CURRENT_PRICE}"]`).should('contain.text', '1.229');
    cy.get(`[data-testid="${TEST_IDS.STORAGE_PICKER_PREFIX}-512 GB"]`).click();
    cy.get(`[data-testid="${TEST_IDS.CURRENT_PRICE}"]`).should('contain.text', '1.329');
  });

  it('swaps the main gallery image when a different color is picked', () => {
    cy.visit(ROUTES.productDetail(PRODUCT_ID), VISIT);
    cy.get(`[data-testid="${TEST_IDS.COLOR_PICKER_PREFIX}-Titanium Violet"]`, {
      timeout: LONG,
    }).click();
    cy.get('img')
      .first()
      .invoke('attr', 'src')
      .then((initialSrc) => {
        cy.get(`[data-testid="${TEST_IDS.COLOR_PICKER_PREFIX}-Titanium Black"]`).click();
        cy.get('img').first().invoke('attr', 'src').should('not.equal', initialSrc);
      });
  });

  it('renders the specs section with its heading', () => {
    cy.visit(ROUTES.productDetail(PRODUCT_ID), VISIT);
    cy.contains('h2', COPY.productDetail.SPECS_HEADING, { timeout: LONG }).should('be.visible');
    cy.get('dl dd').its('length').should('be.greaterThan', 0);
  });

  it('breadcrumb back link returns to the catalog', () => {
    cy.visit(ROUTES.productDetail(PRODUCT_ID), VISIT);
    cy.contains('a', COPY.productDetail.BACK, { timeout: LONG }).click();
    cy.location('pathname').should('eq', ROUTES.HOME);
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"]`, { timeout: LONG }).should('exist');
  });

  it('renders not-found page when the product id does not exist', () => {
    cy.visit(ROUTES.productDetail('NON-EXISTENT-ID'), { failOnStatusCode: false, timeout: LONG });
    cy.contains(COPY.common.NOT_FOUND_TITLE, { timeout: LONG }).should('be.visible');
  });
});
