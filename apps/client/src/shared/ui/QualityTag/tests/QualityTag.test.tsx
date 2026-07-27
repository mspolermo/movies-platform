import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QualityTag } from '../ui';

describe('QualityTag', () => {
  it('shows quality text', () => {
    render(<QualityTag quality="HD" />);
    expect(screen.getByText('HD')).toBeInTheDocument();
  });

  it('renders as paragraph', () => {
    render(<QualityTag quality="FullHD" />);
    expect(screen.getByText('FullHD').tagName).toBe('P');
  });
});
