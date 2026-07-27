import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RemotePoster } from '../ui';

describe('RemotePoster', () => {
  it('shows fallback without src', () => {
    render(<RemotePoster alt="x" size="s" src={null} />);
    expect(screen.getByText('Нет изображения')).toBeInTheDocument();
  });

  it('shows image and hides skeleton after load', () => {
    const { container } = render(
      <RemotePoster alt="Poster" size="s" src="https://example.com/p.jpg" />
    );

    const img = screen.getByRole('img', { name: 'Poster' });
    expect(img).toBeInTheDocument();
    expect(container.querySelector('[class*="skeleton"]')).toBeTruthy();

    fireEvent.load(img);
    expect(container.querySelector('[class*="skeleton"]')).toBeNull();
  });

  it('shows fallback after image error', () => {
    render(<RemotePoster alt="Poster" size="s" src="https://example.com/broken.jpg" />);

    fireEvent.error(screen.getByRole('img', { name: 'Poster' }));
    expect(screen.getByText('Нет изображения')).toBeInTheDocument();
  });

  it('uses accessible fallback when label is empty', () => {
    render(<RemotePoster alt="x" fallbackLabel="" size="s" src={null} />);
    expect(screen.getByRole('img', { name: 'Изображение недоступно' })).toBeInTheDocument();
  });
});
