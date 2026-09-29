import { describe, it, expect } from 'vitest';
import { CONFIGURATOR_ACTION } from '@/constants';
import {
  configuratorReducer,
  initialConfiguratorState,
  type ConfiguratorState,
} from './configuratorReducer';

const color = { name: 'Negro', hexCode: '#000', imageUrl: 'https://x/y.webp' };
const storage = { capacity: '256 GB', price: 999 };

describe('configuratorReducer', () => {
  it('sets color without touching storage', () => {
    const next = configuratorReducer(initialConfiguratorState, {
      type: CONFIGURATOR_ACTION.SET_COLOR,
      color,
    });
    expect(next).toEqual({ color, storage: null });
  });

  it('sets storage without touching color', () => {
    const next = configuratorReducer(initialConfiguratorState, {
      type: CONFIGURATOR_ACTION.SET_STORAGE,
      storage,
    });
    expect(next).toEqual({ color: null, storage });
  });

  it('resets to a given state', () => {
    const target: ConfiguratorState = { color, storage };
    const next = configuratorReducer(initialConfiguratorState, {
      type: CONFIGURATOR_ACTION.RESET,
      state: target,
    });
    expect(next).toBe(target);
  });
});
