const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  useGrouping: 'always',
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}
