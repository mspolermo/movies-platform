import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadMoreSection } from '../ui';

describe('LoadMoreSection', () => {
  it('shows load more when hasMore', () => {
    render(
      <LoadMoreSection hasMore isLoading={false} onLoadMore={() => {}}>
        x
      </LoadMoreSection>
    );
    expect(screen.getByRole('button', { name: 'Показать ещё' })).toBeInTheDocument();
  });

  it('hides load more while loading', () => {
    render(
      <LoadMoreSection hasMore isLoading onLoadMore={() => {}}>
        x
      </LoadMoreSection>
    );
    expect(screen.queryByRole('button', { name: 'Показать ещё' })).toBeNull();
  });
});
