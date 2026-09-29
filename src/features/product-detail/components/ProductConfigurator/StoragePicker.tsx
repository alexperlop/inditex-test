'use client';

import type { StorageOption } from '@/domain/product';
import { OptionPicker } from '@/shared/components/OptionPicker';
import {
  useConfiguratorActions,
  useConfiguratorProduct,
  useConfiguratorState,
} from '@/features/product-detail/state/ConfiguratorContext';
import { formatPrice } from '@/lib/format';
import styles from './StoragePicker.module.scss';

export function StoragePicker() {
  const product = useConfiguratorProduct();
  const state = useConfiguratorState();
  const { setStorage } = useConfiguratorActions();

  return (
    <OptionPicker<StorageOption>
      legend="Almacenamiento"
      items={product.storageOptions}
      getKey={(o) => o.capacity}
      isSelected={(o) => state.storage?.capacity === o.capacity}
      onSelect={setStorage}
      testIdPrefix="storage"
      groupClassName={styles.options}
      optionClassName={styles.option}
      selectedClassName={styles.selected}
      renderOption={(o) => (
        <>
          <span className={styles.capacity}>{o.capacity}</span>
          <span className={styles.price}>{formatPrice(o.price)}</span>
        </>
      )}
    />
  );
}
