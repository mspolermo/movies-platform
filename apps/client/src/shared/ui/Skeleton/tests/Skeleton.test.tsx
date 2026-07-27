import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from '../ui';

describe('Skeleton', () => {
  it('applies width and height', () => {
    const { container } = render(<Skeleton height={20} width={100} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('20px');
  });
});
