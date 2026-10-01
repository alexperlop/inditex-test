import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TEST_IDS } from '@/constants';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { Price } from './index';
import { StoragePicker } from '../StoragePicker';
import { makeProductDetail, makeStorage } from '../../../../../../tests/factories';

describe('Price', () => {
  it('shows the product basePrice when no storage is selected', () => {
    const product = makeProductDetail({ basePrice: 1234 });
    render(
      <ConfiguratorProvider product={product}>
        <Price />
      </ConfiguratorProvider>,
    );
    expect(screen.getByTestId(TEST_IDS.CURRENT_PRICE)).toHaveTextContent(/1\.234/);
  });

  it('updates to the selected storage price', async () => {
    const product = makeProductDetail({
      basePrice: 999,
      storageOptions: [
        makeStorage({ capacity: '128 GB', price: 999 }),
        makeStorage({ capacity: '512 GB', price: 1399 }),
      ],
    });
    const user = userEvent.setup();
    render(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
        <Price />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-512 GB`));
    expect(screen.getByTestId(TEST_IDS.CURRENT_PRICE)).toHaveTextContent(/1\.399/);
  });
});
