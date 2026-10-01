import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { COPY } from '@/constants';
import { withErrorBoundary } from './index';

function Boom({ shouldThrow }: { shouldThrow: boolean }): ReactElement {
  if (shouldThrow) throw new Error('explode');
  return <p>ok</p>;
}

describe('withErrorBoundary', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('renders the wrapped component when no error happens', () => {
    const Wrapped = withErrorBoundary(Boom);
    render(<Wrapped shouldThrow={false} />);
    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('shows the default fallback when the child throws', () => {
    const Wrapped = withErrorBoundary(Boom);
    render(<Wrapped shouldThrow />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      COPY.common.errorBoundaryMessage('explode'),
    );
    expect(screen.getByRole('button', { name: COPY.common.RETRY })).toBeInTheDocument();
  });

  it('resets to render children again after Retry', async () => {
    const user = userEvent.setup();
    const Wrapped = withErrorBoundary(Boom);
    const { rerender } = render(<Wrapped shouldThrow />);
    rerender(<Wrapped shouldThrow={false} />);

    await user.click(screen.getByRole('button', { name: COPY.common.RETRY }));
    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('allows a custom fallback renderer', () => {
    const Wrapped = withErrorBoundary(Boom, {
      fallback: (error) => <p data-testid="custom">{`custom: ${error.message}`}</p>,
    });
    render(<Wrapped shouldThrow />);
    expect(screen.getByTestId('custom')).toHaveTextContent('custom: explode');
  });

  it('sets a readable displayName for devtools', () => {
    const Named = () => <p />;
    Named.displayName = 'Named';
    const Wrapped = withErrorBoundary(Named);
    expect(Wrapped.displayName).toBe('withErrorBoundary(Named)');
  });
});
