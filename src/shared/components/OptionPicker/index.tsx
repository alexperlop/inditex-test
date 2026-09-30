'use client';

import type { ReactNode, CSSProperties } from 'react';
import styles from './OptionPicker.module.scss';

interface OptionRenderContext {
  selected: boolean;
}

export interface OptionPickerProps<T> {
  legend: string;
  ariaLabel?: string;
  items: readonly T[];
  getKey: (item: T) => string;
  getOptionLabel?: (item: T) => string;
  isSelected: (item: T) => boolean;
  onSelect: (item: T) => void;
  renderOption: (item: T, ctx: OptionRenderContext) => ReactNode;
  testIdPrefix: string;
  groupClassName?: string;
  optionClassName?: string;
  selectedClassName?: string;
  optionStyle?: (item: T) => CSSProperties | undefined;
  footer?: ReactNode;
}

export function OptionPicker<T>({
  legend,
  ariaLabel,
  items,
  getKey,
  getOptionLabel,
  isSelected,
  onSelect,
  renderOption,
  testIdPrefix,
  groupClassName,
  optionClassName,
  selectedClassName,
  optionStyle,
  footer,
}: OptionPickerProps<T>) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={groupClassName} role="radiogroup" aria-label={ariaLabel ?? legend}>
        {items.map((item) => {
          const selected = isSelected(item);
          const key = getKey(item);
          const label = getOptionLabel?.(item);
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              title={label}
              className={`${optionClassName ?? ''} ${selected ? (selectedClassName ?? '') : ''}`}
              style={optionStyle?.(item)}
              onClick={() => onSelect(item)}
              data-testid={`${testIdPrefix}-${key}`}
            >
              {renderOption(item, { selected })}
            </button>
          );
        })}
      </div>
      {footer}
    </fieldset>
  );
}
