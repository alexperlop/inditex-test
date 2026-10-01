import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { Header } from './index';
import { makeProductDetail } from '../../../../../../tests/factories';

describe('Header', () => {
  it('renders the brand uppercased and the product name as h1', () => {
    const product = makeProductDetail({ brand: 'Apple', name: 'iPhone 15 Pro' });
    render(
      <ConfiguratorProvider product={product}>
        <Header />
      </ConfiguratorProvider>,
    );
    expect(screen.getByText('APPLE')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('iPhone 15 Pro');
  });
});
