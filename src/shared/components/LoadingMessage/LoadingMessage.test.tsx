import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingMessage } from './index';

describe('LoadingMessage', () => {
  it('renders the label inside a polite live region', () => {
    render(<LoadingMessage label="Cargando productos…" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Cargando productos…');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('renders any label passed as prop', () => {
    render(<LoadingMessage label="Loading cart" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading cart');
  });
});
