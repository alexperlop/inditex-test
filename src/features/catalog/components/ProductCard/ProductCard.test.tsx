import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ROUTES } from '@/constants';
import { ProductCard } from './index';
import { makeProductListItem } from '../../../../../tests/factories';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const {
      src,
      alt,
      fill: _fill,
      sizes: _sizes,
      ...rest
    } = props as {
      src: string;
      alt: string;
      fill?: boolean;
      sizes?: string;
    };
    return <img src={src} alt={alt} {...rest} />;
  },
}));

describe('ProductCard', () => {
  it('links to the product detail route using the id', () => {
    const product = makeProductListItem({ id: 'ABC-1' });
    render(<ProductCard product={product} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.productDetail('ABC-1'));
  });

  it('renders brand, name and formatted price', () => {
    const product = makeProductListItem({
      brand: 'Samsung',
      name: 'Galaxy S24',
      basePrice: 1200,
    });
    render(<ProductCard product={product} />);
    expect(screen.getByText('Samsung')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText(/1\.200/)).toBeInTheDocument();
  });

  it('uses "brand name" as the image alt text', () => {
    const product = makeProductListItem({ brand: 'Xiaomi', name: 'Redmi 13' });
    render(<ProductCard product={product} />);
    expect(screen.getByRole('img', { name: 'Xiaomi Redmi 13' })).toBeInTheDocument();
  });
});
