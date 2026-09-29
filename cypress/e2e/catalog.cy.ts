import { COPY, PAGINATION, ROUTES, SEARCH, TEST_IDS } from '../../src/constants';

const RESULT_WORD = COPY.catalog.resultMany(2).split(' ')[1] ?? 'resultado';

describe('Catalog listing', () => {
  it('renders the initial product grid (SSR-hydrated from the real API)', () => {
    cy.visit(ROUTES.HOME, { timeout: 30_000 });
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"] li`, { timeout: 30_000 })
      .its('length')
      .should('be.greaterThan', 0)
      .and('be.lte', PAGINATION.DEFAULT_LIMIT);
    cy.get(`[data-testid="${TEST_IDS.RESULT_COUNT}"]`).should('contain.text', RESULT_WORD);
  });

  it('filters via debounced search and updates the URL', () => {
    cy.visit(ROUTES.HOME);
    cy.get(`[data-testid="${TEST_IDS.SEARCH_INPUT}"]`, { timeout: 30_000 })
      .should('be.visible')
      .type('samsung');
    cy.location('search', { timeout: 5_000 }).should('include', `${SEARCH.QUERY_PARAM}=samsung`);
    cy.get(`[data-testid="${TEST_IDS.RESULT_COUNT}"]`, { timeout: 10_000 }).should(
      'contain.text',
      RESULT_WORD,
    );
    cy.get(`[data-testid="${TEST_IDS.PRODUCT_GRID}"]`, { timeout: 10_000 })
      .invoke('text')
      .should('match', /samsung/i);
  });
});
