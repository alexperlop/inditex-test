import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY, ROUTES } from '@/constants';
import { SimilarProducts } from './index';
import { makeProductListItem } from '../../../../../tests/factories';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    return <img src={src} alt={alt} />;
  },
}));

describe('SimilarProducts', () => {
  it('renders nothing when there are no similar items', () => {
    const { container } = render(<SimilarProducts items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a heading and a card per similar product', () => {
    const items = [
      makeProductListItem({ id: 'S1', name: 'Pixel' }),
      makeProductListItem({ id: 'S2', name: 'Nothing Phone' }),
    ];
    render(<SimilarProducts items={items} />);
    expect(
      screen.getByRole('heading', { name: COPY.productDetail.SIMILAR_HEADING }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /Pixel/ })).toHaveAttribute(
      'href',
      ROUTES.productDetail('S1'),
    );
  });
});
