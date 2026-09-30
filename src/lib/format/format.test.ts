import { describe, it, expect } from 'vitest';
import { formatPrice } from '.';

describe('formatPrice', () => {
  it('formats integers as EUR without decimals', () => {
    expect(formatPrice(1329).replace(/ /g, ' ')).toBe('1.329 €');
  });

  it('formats zero', () => {
    expect(formatPrice(0).replace(/ /g, ' ')).toBe('0 €');
  });
});
