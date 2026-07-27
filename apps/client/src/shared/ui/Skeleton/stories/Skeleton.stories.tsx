import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Skeleton } from '../ui';

const meta = {
  title: 'shared/ui/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Pulse: TStory = { args: { width: 200, height: 24, animation: 'pulse' } };

export const Wave: TStory = { args: { width: 200, height: 24, animation: 'wave' } };

export const Circular: TStory = {
  args: { variant: 'circular', width: 48, height: 48, animation: 'pulse' },
};
