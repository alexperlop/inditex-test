import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COPY, SPEC_LABELS } from '@/constants';
import { Specs } from './index';
import { makeSpecs } from '../../../../../tests/factories';

describe('Specs', () => {
  it('renders a heading and every spec row', () => {
    const specs = makeSpecs({
      brand: 'Samsung',
      name: 'Galaxy',
      description: 'una descripción',
      screen: '6.7"',
      resolution: '2340x1080',
      processor: 'Exynos',
      mainCamera: '50MP',
      selfieCamera: '12MP',
      battery: '4500 mAh',
      os: 'Android 14',
      screenRefreshRate: '120 Hz',
    });
    render(<Specs specs={specs} />);
    expect(
      screen.getByRole('heading', { name: COPY.productDetail.SPECS_HEADING }),
    ).toBeInTheDocument();
    SPEC_LABELS.forEach(([key, label]) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(specs[key])).toBeInTheDocument();
    });
  });
});
