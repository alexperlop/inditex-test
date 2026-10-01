import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageContainer } from './index';

describe('PageContainer', () => {
  it('renders its children', () => {
    render(
      <PageContainer>
        <p>child</p>
      </PageContainer>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('passes through arbitrary HTML attributes', () => {
    render(
      <PageContainer data-testid="pc" id="root-container">
        <span />
      </PageContainer>,
    );
    const container = screen.getByTestId('pc');
    expect(container).toHaveAttribute('id', 'root-container');
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('concatenates a custom className with the module class', () => {
    render(
      <PageContainer className="extra" data-testid="pc">
        <span />
      </PageContainer>,
    );
    expect(screen.getByTestId('pc').className).toContain('extra');
  });
});
