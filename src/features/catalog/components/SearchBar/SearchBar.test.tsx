import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ROUTES, SEARCH, TEST_IDS } from '@/constants';
import { SearchBar } from './index';

const routerReplace = vi.fn();
let currentSearch = '';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: routerReplace, push: vi.fn(), back: vi.fn() }),
  useSearchParams: () =>
    new URLSearchParams(currentSearch ? `${SEARCH.QUERY_PARAM}=${currentSearch}` : ''),
}));

beforeEach(() => {
  routerReplace.mockClear();
  currentSearch = '';
});

describe('SearchBar', () => {
  it('renders the input with the initial value and placeholder', () => {
    render(<SearchBar initialValue="iphone" />);
    const input = screen.getByTestId(TEST_IDS.SEARCH_INPUT) as HTMLInputElement;
    expect(input.value).toBe('iphone');
    expect(input).toHaveAttribute('type', 'search');
  });

  it('updates the URL after the debounce when the user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    await user.type(screen.getByTestId(TEST_IDS.SEARCH_INPUT), 'sam');

    await waitFor(
      () => {
        expect(routerReplace).toHaveBeenCalledWith(`${ROUTES.HOME}?${SEARCH.QUERY_PARAM}=sam`, {
          scroll: false,
        });
      },
      { timeout: SEARCH.DEBOUNCE_MS + 500 },
    );
  });

  it('removes the query param when the input is cleared', async () => {
    currentSearch = 'sam';
    const user = userEvent.setup();
    render(<SearchBar initialValue="sam" />);
    await user.clear(screen.getByTestId(TEST_IDS.SEARCH_INPUT));

    await waitFor(
      () => {
        expect(routerReplace).toHaveBeenCalledWith(ROUTES.HOME, { scroll: false });
      },
      { timeout: SEARCH.DEBOUNCE_MS + 500 },
    );
  });

  it('does not push a navigation when the debounced value equals the current URL', async () => {
    currentSearch = 'xiaomi';
    render(<SearchBar initialValue="xiaomi" />);
    await new Promise((r) => setTimeout(r, SEARCH.DEBOUNCE_MS + 100));
    expect(routerReplace).not.toHaveBeenCalled();
  });
});
