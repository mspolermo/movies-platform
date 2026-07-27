import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ExpandableBlock } from '../ui';

describe('ExpandableBlock', () => {
  it('expands and collapses with aria-expanded', async () => {
    const user = userEvent.setup();
    render(
      <ExpandableBlock collapseLabel="Hide" expandLabel="Show">
        Body
      </ExpandableBlock>
    );

    const trigger = screen.getByRole('button', { name: 'Show' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Body')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Hide' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Body')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hide' }));
    expect(screen.getByRole('button', { name: 'Show' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
  });
});
