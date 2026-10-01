import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY, TEST_IDS } from '@/constants';
import { ProductGrid } from './index';
import { makeProductListItem } from '../../../../../tests/factories';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    return <img src={src} alt={alt} />;
  },
}));

describe('ProductGrid', () => {
  it('renders the empty state when there are no products', () => {
    render(<ProductGrid products={[]} />);
    const empty = screen.getByRole('status');
    expect(empty).toHaveTextContent(COPY.catalog.EMPTY);
    expect(screen.queryByTestId(TEST_IDS.PRODUCT_GRID)).not.toBeInTheDocument();
  });

  it('renders one list item per product', () => {
    const products = [
      makeProductListItem({ id: '1', name: 'A' }),
      makeProductListItem({ id: '2', name: 'B' }),
      makeProductListItem({ id: '3', name: 'C' }),
    ];
    render(<ProductGrid products={products} />);
    const grid = screen.getByTestId(TEST_IDS.PRODUCT_GRID);
    expect(grid.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
