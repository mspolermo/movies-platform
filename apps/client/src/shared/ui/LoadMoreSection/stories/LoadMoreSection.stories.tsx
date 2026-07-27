import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LoadMoreSection } from '../ui';

const meta = {
  title: 'shared/ui/LoadMoreSection',
  component: LoadMoreSection,
} satisfies Meta<typeof LoadMoreSection>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: { children: 'List', onLoadMore: () => {}, isLoading: false, hasMore: true },
};
