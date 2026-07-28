import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NotFoundView } from '../ui';

const meta = {
  title: 'shared/ui/NotFoundView',
  component: NotFoundView,
} satisfies Meta<typeof NotFoundView>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Custom: TStory = {
  args: {
    title: '404',
    description: 'Страница не найдена',
  },
};
