import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('next/image', async () => {
  const { default: NextImage } = await import('../mocks/next-image');
  return { default: NextImage };
});
