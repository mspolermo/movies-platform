import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Loader } from '../ui';

describe('Loader', () => {
  it('has status role', () => {
    render(<Loader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
