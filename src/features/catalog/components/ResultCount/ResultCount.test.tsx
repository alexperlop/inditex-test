import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY, TEST_IDS } from '@/constants';
import { ResultCount } from './index';

describe('ResultCount', () => {
  it('renders the singular copy when there is exactly one result', () => {
    render(<ResultCount count={1} />);
    expect(screen.getByTestId(TEST_IDS.RESULT_COUNT)).toHaveTextContent(COPY.catalog.RESULT_ONE);
  });

  it('renders the plural copy for multiple results', () => {
    render(<ResultCount count={5} />);
    expect(screen.getByTestId(TEST_IDS.RESULT_COUNT)).toHaveTextContent(COPY.catalog.resultMany(5));
  });

  it('renders zero as plural copy', () => {
    render(<ResultCount count={0} />);
    expect(screen.getByTestId(TEST_IDS.RESULT_COUNT)).toHaveTextContent(COPY.catalog.resultMany(0));
  });

  it('is announced as a polite live region', () => {
    render(<ResultCount count={2} />);
    expect(screen.getByTestId(TEST_IDS.RESULT_COUNT)).toHaveAttribute('aria-live', 'polite');
  });
});
