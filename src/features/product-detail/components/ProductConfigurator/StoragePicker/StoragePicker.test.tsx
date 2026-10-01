import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TEST_IDS } from '@/constants';
import { ConfiguratorProvider } from '@/features/product-detail/state/ConfiguratorContext';
import { StoragePicker } from './index';
import { makeProductDetail, makeStorage } from '../../../../../../tests/factories';

describe('StoragePicker', () => {
  it('renders one option per storage with capacity and price', () => {
    const product = makeProductDetail({
      storageOptions: [
        makeStorage({ capacity: '128 GB', price: 999 }),
        makeStorage({ capacity: '256 GB', price: 1099 }),
      ],
    });
    render(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
      </ConfiguratorProvider>,
    );
    expect(screen.getByText('128 GB')).toBeInTheDocument();
    expect(screen.getByText('256 GB')).toBeInTheDocument();
    expect(screen.getByText(/999/)).toBeInTheDocument();
    expect(screen.getByText(/1\.099/)).toBeInTheDocument();
  });

  it('marks the clicked option as checked', async () => {
    const product = makeProductDetail({
      storageOptions: [makeStorage({ capacity: '128 GB' }), makeStorage({ capacity: '256 GB' })],
    });
    const user = userEvent.setup();
    render(
      <ConfiguratorProvider product={product}>
        <StoragePicker />
      </ConfiguratorProvider>,
    );
    await user.click(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-256 GB`));
    expect(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-256 GB`)).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByTestId(`${TEST_IDS.STORAGE_PICKER_PREFIX}-128 GB`)).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });
});
