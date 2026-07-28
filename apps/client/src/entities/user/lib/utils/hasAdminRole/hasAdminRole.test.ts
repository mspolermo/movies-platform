import { describe, expect, it } from 'vitest';

import { hasAdminRole } from './hasAdminRole';

describe('hasAdminRole', () => {
  it('returns false for null/empty', () => {
    expect(hasAdminRole(null)).toBe(false);
    expect(hasAdminRole(undefined)).toBe(false);
    expect(hasAdminRole({ roles: [] })).toBe(false);
  });

  it('returns true only when ADMIN present', () => {
    expect(
      hasAdminRole({
        roles: [{ id: 2, value: 'USER', description: '' }],
      })
    ).toBe(false);
    expect(
      hasAdminRole({
        roles: [
          { id: 3, value: 'MANAGER', description: '' },
          { id: 1, value: 'ADMIN', description: '' },
        ],
      })
    ).toBe(true);
  });
});
