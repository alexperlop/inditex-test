import type { ColorOption, StorageOption } from '@/domain/product';

export interface ConfiguratorState {
  color: ColorOption | null;
  storage: StorageOption | null;
}

export type ConfiguratorAction =
  | { type: 'SET_COLOR'; color: ColorOption }
  | { type: 'SET_STORAGE'; storage: StorageOption }
  | { type: 'RESET'; state: ConfiguratorState };

export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction,
): ConfiguratorState {
  switch (action.type) {
    case 'SET_COLOR':
      return { ...state, color: action.color };
    case 'SET_STORAGE':
      return { ...state, storage: action.storage };
    case 'RESET':
      return action.state;
    default:
      return state;
  }
}

export const initialConfiguratorState: ConfiguratorState = {
  color: null,
  storage: null,
};
