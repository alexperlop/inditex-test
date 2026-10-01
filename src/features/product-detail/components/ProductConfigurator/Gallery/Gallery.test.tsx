import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COPY, TEST_IDS } from '@/constants';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { Gallery } from './index';
import { ColorPicker } from '../ColorPicker';
import { makeProductDetail, makeColor } from '../../../../../../tests/factories';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    return <img src={src} alt={alt} />;
  },
}));

describe('Gallery', () => {
  it('falls back to the first colorOption image when nothing is selected', () => {
    const product = makeProductDetail({
      brand: 'Apple',
      name: 'iPhone',
      colorOptions: [
        makeColor({ name: 'Negro', imageUrl: 'https://x/black.webp' }),
        makeColor({ name: 'Blanco', imageUrl: 'https://x/white.webp' }),
      ],
    });
    render(
      <ConfiguratorProvider product={product}>
        <Gallery />
      </ConfiguratorProvider>,
    );
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('black.webp');
    expect(img.alt).toBe('Apple iPhone Negro');
  });

  it('swaps the image when a color is selected', async () => {
    const product = makeProductDetail({
      colorOptions: [
        makeColor({ name: 'Negro', imageUrl: 'https://x/black.webp' }),
        makeColor({ name: 'Blanco', imageUrl: 'https://x/white.webp' }),
      ],
    });
    const user = userEvent.setup();
    render(
      <ConfiguratorProvider product={product}>
        <ColorPicker />
        <Gallery />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Blanco`));
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('white.webp');
  });

  it('renders a placeholder when there are no color images', () => {
    const product = makeProductDetail({ colorOptions: [] });
    render(
      <ConfiguratorProvider product={product}>
        <Gallery />
      </ConfiguratorProvider>,
    );
    expect(screen.getByRole('img', { name: COPY.productDetail.NO_IMAGE })).toBeInTheDocument();
  });
});
