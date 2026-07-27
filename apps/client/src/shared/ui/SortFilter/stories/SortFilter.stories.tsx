import type { TFilmSortBy } from '@common/types';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useState } from 'react';

import { SortFilter } from '../ui';

const meta = {
  title: 'shared/ui/SortFilter',
  component: SortFilter,
  argTypes: {
    selectedSort: {
      control: 'select',
      options: ['popularity', 'rating', 'novelty', 'alphabet'],
    },
  },
} satisfies Meta<typeof SortFilter>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  render: function SortFilterStory(args) {
    const [selectedSort, setSelectedSort] = useState<TFilmSortBy>(args.selectedSort ?? 'rating');
    return <SortFilter selectedSort={selectedSort} onUpdateSort={setSelectedSort} />;
  },
  args: { selectedSort: 'rating', onUpdateSort: () => {} },
};

export const Alphabet: TStory = {
  ...Default,
  args: { selectedSort: 'alphabet', onUpdateSort: () => {} },
};
