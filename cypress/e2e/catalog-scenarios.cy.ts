import { COPY, ROUTES, SEARCH, TEST_IDS } from '../../src/constants';

const VISIT = { timeout: 30_000 } as const;
const LONG = 30_000;

describe('Catalog scenarios', () => {
  it('shows the "no results" copy when a search returns empty', () => {
    cy.visit(ROUTES.HOME, VISIT);
    cy.get(`[data-testid="${TEST_IDS.SEARCH_INPUT}"]`, { timeout: LONG }).type('zzzzzzzzzzzzz');
    cy.get(`[data-testid="${TEST_IDS.RESULT_COUNT}"]`, { timeout: LONG }).should(
      'contain.text',
      COPY.catalog.resultMany(0),
    );
    cy.contains(COPY.catalog.EMPTY).should('be.visible');
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"]`).should('not.exist');
  });

  it('deep-links with a search param and pre-fills the input', () => {
    cy.visit(`${ROUTES.HOME}?${SEARCH.QUERY_PARAM}=samsung`, VISIT);
    cy.get(`[data-testid="${TEST_IDS.SEARCH_INPUT}"]`, { timeout: LONG }).should(
      'have.value',
      'samsung',
    );
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"] li`, { timeout: LONG })
      .its('length')
      .should('be.greaterThan', 0);
  });

  it('removes the query param from the URL when the input is cleared', () => {
    cy.visit(`${ROUTES.HOME}?${SEARCH.QUERY_PARAM}=xiaomi`, VISIT);
    cy.get(`[data-testid="${TEST_IDS.SEARCH_INPUT}"]`, { timeout: LONG }).clear();
    cy.location('search', { timeout: 10_000 }).should('not.include', SEARCH.QUERY_PARAM);
  });

  it('navigates from a product card to its detail page', () => {
    cy.visit(ROUTES.HOME, VISIT);
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"] li a`, { timeout: LONG }).first().click();
    cy.location('pathname', { timeout: LONG }).should('match', /^\/products\//);
    cy.get(`[data-testid="${TEST_IDS.ADD_TO_CART}"]`, { timeout: LONG }).should('exist');
  });
});
