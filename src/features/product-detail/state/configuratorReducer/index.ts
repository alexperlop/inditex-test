import { CONFIGURATOR_ACTION } from '@/constants';
import type { ColorOption, StorageOption } from '@/domain/product';

export interface ConfiguratorState {
  color: ColorOption | null;
  storage: StorageOption | null;
}

export type ConfiguratorAction =
  | { type: typeof CONFIGURATOR_ACTION.SET_COLOR; color: ColorOption }
  | { type: typeof CONFIGURATOR_ACTION.SET_STORAGE; storage: StorageOption }
  | { type: typeof CONFIGURATOR_ACTION.RESET; state: ConfiguratorState };

export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction,
): ConfiguratorState {
  switch (action.type) {
    case CONFIGURATOR_ACTION.SET_COLOR:
      return { ...state, color: action.color };
    case CONFIGURATOR_ACTION.SET_STORAGE:
      return { ...state, storage: action.storage };
    case CONFIGURATOR_ACTION.RESET:
      return action.state;
    default:
      return state;
  }
}

export const initialConfiguratorState: ConfiguratorState = {
  color: null,
  storage: null,
};
