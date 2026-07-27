import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from '../ui';

const meta = {
  title: 'shared/ui/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = { args: {} };
