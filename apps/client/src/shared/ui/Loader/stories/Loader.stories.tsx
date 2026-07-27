import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Loader } from '../ui';

const meta = {
  title: 'shared/ui/Loader',
  component: Loader,
} satisfies Meta<typeof Loader>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = { args: {} };
