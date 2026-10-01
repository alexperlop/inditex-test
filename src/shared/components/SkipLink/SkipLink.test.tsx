import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY } from '@/constants';
import { SkipLink } from './index';

describe('SkipLink', () => {
  it('points to #main by default', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: COPY.nav.SKIP_TO_CONTENT });
    expect(link).toHaveAttribute('href', '#main');
  });

  it('honors a custom target id', () => {
    render(<SkipLink targetId="content" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#content');
  });
});
