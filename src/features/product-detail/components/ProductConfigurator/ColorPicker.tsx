'use client';

import { COPY, TEST_IDS } from '@/constants';
import type { ColorOption } from '@/domain/product';
import { OptionPicker } from '@/shared/components/OptionPicker';
import {
  useConfiguratorActions,
  useConfiguratorProduct,
  useConfiguratorState,
} from '@/features/product-detail/state/ConfiguratorContext';
import styles from './ColorPicker.module.scss';

export function ColorPicker() {
  const product = useConfiguratorProduct();
  const state = useConfiguratorState();
  const { setColor } = useConfiguratorActions();
  const selectedName = state.color?.name ?? COPY.productDetail.COLOR_NONE;

  return (
    <OptionPicker<ColorOption>
      legend={COPY.productDetail.COLOR_LEGEND}
      ariaLabel={COPY.productDetail.colorAria(selectedName)}
      items={product.colorOptions}
      getKey={(o) => o.name}
      isSelected={(o) => state.color?.name === o.name}
      onSelect={setColor}
      renderOption={() => null}
      testIdPrefix={TEST_IDS.COLOR_PICKER_PREFIX}
      groupClassName={styles.swatches}
      optionClassName={styles.swatch}
      selectedClassName={styles.selected}
      optionStyle={(o) => ({ backgroundColor: o.hexCode })}
      footer={
        <p className={styles.selectedLabel} aria-live="polite">
          {selectedName}
        </p>
      }
    />
  );
}
