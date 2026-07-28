import { describe, expect, it } from 'vitest';

import { isAdminNavActive } from './isAdminNavActive';

describe('isAdminNavActive', () => {
  it('matches /admin exactly for overview', () => {
    expect(isAdminNavActive('/admin', '/admin')).toBe(true);
    expect(isAdminNavActive('/admin/films', '/admin')).toBe(false);
  });

  it('matches section paths and nested routes', () => {
    expect(isAdminNavActive('/admin/films', '/admin/films')).toBe(true);
    expect(isAdminNavActive('/admin/films/new', '/admin/films')).toBe(true);
    expect(isAdminNavActive('/admin/film', '/admin/films')).toBe(false);
  });
});
