import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FilterCardButton } from '../ui';

describe('FilterCardButton', () => {
  it('renders children as presentational surface', () => {
    const { container } = render(<FilterCardButton>Жанр</FilterCardButton>);
    expect(screen.getByText('Жанр')).toBeInTheDocument();
    expect(container.querySelector('[role="button"]')).toBeNull();
  });
});
