import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NotFoundView } from '../ui';

describe('NotFoundView', () => {
  it('renders default title and description', () => {
    render(<NotFoundView />);
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(
      screen.getByText('К сожалению, по вашему запросу ничего не найдено')
    ).toBeInTheDocument();
  });

  it('renders custom description', () => {
    render(<NotFoundView description="Кастом" />);
    expect(screen.getByText('Кастом')).toBeInTheDocument();
  });
});
