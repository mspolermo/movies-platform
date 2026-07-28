import { describe, expect, it } from 'vitest';

import { buildAdminBreadcrumbs } from './buildAdminBreadcrumbs';

describe('buildAdminBreadcrumbs', () => {
  it('dashboard has only Администрирование without href', () => {
    expect(buildAdminBreadcrumbs()).toEqual([{ label: 'Администрирование' }]);
  });

  it('does not include Главная and links admin root', () => {
    expect(buildAdminBreadcrumbs({ label: 'Фильмы' })).toEqual([
      { label: 'Администрирование', href: '/admin' },
      { label: 'Фильмы' },
    ]);
  });
});
