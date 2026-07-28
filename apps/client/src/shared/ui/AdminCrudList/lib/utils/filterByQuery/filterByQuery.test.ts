import { describe, expect, it } from 'vitest';

import { filterByQuery } from './filterByQuery';

describe('filterByQuery', () => {
  const items = [
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
  ];

  it('returns all items for empty query', () => {
    expect(filterByQuery(items, '  ', (x, q) => x.name.toLowerCase().includes(q))).toEqual(items);
  });

  it('filters by matcher', () => {
    expect(filterByQuery(items, 'be', (x, q) => x.name.toLowerCase().includes(q))).toEqual([
      { id: 2, name: 'Beta' },
    ]);
  });
});
