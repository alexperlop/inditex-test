import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COPY, TEST_IDS } from '@/constants';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { ColorPicker } from './index';
import { makeProductDetail, makeColor } from '../../../../../../tests/factories';

describe('ColorPicker', () => {
  it('renders one swatch per color option', () => {
    const product = makeProductDetail({
      colorOptions: [
        makeColor({ name: 'Negro' }),
        makeColor({ name: 'Blanco' }),
        makeColor({ name: 'Rojo' }),
      ],
    });
    render(
      <ConfiguratorProvider product={product}>
        <ColorPicker />
      </ConfiguratorProvider>,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('shows "sin selección" footer label initially', () => {
    const product = makeProductDetail();
    render(
      <ConfiguratorProvider product={product}>
        <ColorPicker />
      </ConfiguratorProvider>,
    );
    expect(screen.getByText(COPY.productDetail.COLOR_NONE)).toBeInTheDocument();
  });

  it('updates the footer label to the selected color', async () => {
    const product = makeProductDetail({
      colorOptions: [makeColor({ name: 'Negro' }), makeColor({ name: 'Blanco' })],
    });
    const user = userEvent.setup();
    render(
      <ConfiguratorProvider product={product}>
        <ColorPicker />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Blanco`));
    expect(screen.getByText('Blanco')).toBeInTheDocument();
    expect(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Blanco`)).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('applies the color hex as background on each swatch', () => {
    const product = makeProductDetail({
      colorOptions: [makeColor({ name: 'Negro', hexCode: '#000000' })],
    });
    render(
      <ConfiguratorProvider product={product}>
        <ColorPicker />
      </ConfiguratorProvider>,
    );
    expect(screen.getByTestId(`${TEST_IDS.COLOR_PICKER_PREFIX}-Negro`)).toHaveStyle({
      backgroundColor: '#000000',
    });
  });
});
