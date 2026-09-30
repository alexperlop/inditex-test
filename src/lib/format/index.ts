import { FORMAT } from '@/constants';

const priceFormatter = new Intl.NumberFormat(FORMAT.LOCALE, {
  style: 'currency',
  currency: FORMAT.CURRENCY,
  maximumFractionDigits: 0,
  useGrouping: 'always',
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}
