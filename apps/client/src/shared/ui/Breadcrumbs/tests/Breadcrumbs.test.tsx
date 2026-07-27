import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from '../ui';

describe('Breadcrumbs', () => {
  it('marks last item as current page', () => {
    render(<Breadcrumbs items={[{ label: 'A', href: '/a' }, { label: 'B' }]} />);
    expect(screen.getByText('B')).toHaveAttribute('aria-current', 'page');
  });
});
