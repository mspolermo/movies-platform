import { beforeEach, describe, expect, it } from 'vitest';

import { getUsersSnapshot, resetUsersStub, updateUserRoleStub } from './usersStubApi';

describe('updateUserRoleStub', () => {
  beforeEach(() => {
    resetUsersStub();
  });

  it('allows demoting the last ADMIN (BE owns last-admin guard)', async () => {
    const admins = getUsersSnapshot().filter((u) => u.role === 'ADMIN');
    expect(admins.length).toBe(1);

    await expect(updateUserRoleStub(admins[0].id, { role: 'USER' })).resolves.toMatchObject({
      role: 'USER',
    });
    expect(getUsersSnapshot().find((u) => u.id === admins[0].id)?.role).toBe('USER');
  });

  it('updates role and roles[] meta', async () => {
    await expect(updateUserRoleStub(2, { role: 'ADMIN' })).resolves.toMatchObject({
      role: 'ADMIN',
      roles: [{ id: 1, value: 'ADMIN' }],
    });
  });

  it('returns null for unknown user', async () => {
    await expect(updateUserRoleStub(999, { role: 'USER' })).resolves.toBeNull();
  });
});
