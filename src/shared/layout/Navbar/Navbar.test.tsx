import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY, ROUTES } from '@/constants';
import { Navbar } from './index';

describe('Navbar', () => {
  it('renders the brand link pointing to home', () => {
    render(<Navbar />);
    const home = screen.getByRole('link', { name: COPY.nav.HOME_ARIA });
    expect(home).toHaveAttribute('href', ROUTES.HOME);
  });

  it('exposes the primary navigation landmark', () => {
    render(<Navbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: COPY.nav.PRIMARY_ARIA })).toBeInTheDocument();
  });

  it('renders the content passed as right slot', () => {
    render(<Navbar right={<button type="button">cart</button>} />);
    expect(screen.getByRole('button', { name: 'cart' })).toBeInTheDocument();
  });
});
