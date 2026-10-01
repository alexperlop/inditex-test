import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COPY } from '@/constants';
import { QueryErrorRetry } from './index';

describe('QueryErrorRetry', () => {
  it('renders the message inside an alert', () => {
    render(<QueryErrorRetry message="Boom" onRetry={() => {}} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });

  it('invokes onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<QueryErrorRetry message="Boom" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: COPY.common.RETRY }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
