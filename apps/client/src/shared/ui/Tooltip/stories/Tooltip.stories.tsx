import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tooltip } from '../ui';

const meta = {
  title: 'shared/ui/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: { content: 'Подсказка', children: <span tabIndex={0}>?</span> },
};
