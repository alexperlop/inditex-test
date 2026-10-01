import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionPicker } from './index';

interface Item {
  id: string;
  label: string;
}

const items: Item[] = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
];

function setup(overrides: Partial<React.ComponentProps<typeof OptionPicker<Item>>> = {}) {
  const onSelect = vi.fn();
  const utils = render(
    <OptionPicker<Item>
      legend="Options"
      items={items}
      getKey={(i) => i.id}
      getOptionLabel={(i) => i.label}
      isSelected={(i) => i.id === 'b'}
      onSelect={onSelect}
      renderOption={(i) => <span>{i.label}</span>}
      testIdPrefix="opt"
      {...overrides}
    />,
  );
  return { ...utils, onSelect };
}

describe('OptionPicker', () => {
  it('renders a radiogroup with one radio per item', () => {
    setup();
    const group = screen.getByRole('radiogroup', { name: 'Options' });
    expect(within(group).getAllByRole('radio')).toHaveLength(items.length);
  });

  it('marks the selected item with aria-checked', () => {
    setup();
    const selected = screen.getByTestId('opt-b');
    expect(selected).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('opt-a')).toHaveAttribute('aria-checked', 'false');
  });

  it('invokes onSelect with the item when clicked', async () => {
    const { onSelect } = setup();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('opt-c'));
    expect(onSelect).toHaveBeenCalledWith(items[2]);
  });

  it('uses the ariaLabel for the group when provided', () => {
    setup({ ariaLabel: 'Pick one', isSelected: () => false });
    expect(screen.getByRole('radiogroup', { name: 'Pick one' })).toBeInTheDocument();
  });

  it('applies optionStyle output as inline style', () => {
    setup({
      optionStyle: (item) => ({ backgroundColor: item.id === 'a' ? 'rgb(255, 0, 0)' : undefined }),
      isSelected: () => false,
    });
    expect(screen.getByTestId('opt-a')).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });

  it('renders the footer content below the group', () => {
    setup({ footer: <p data-testid="footer">done</p>, isSelected: () => false });
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
