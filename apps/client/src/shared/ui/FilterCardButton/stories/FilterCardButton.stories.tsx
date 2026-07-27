import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FilterCardButton } from '../ui';

const meta = {
  title: 'shared/ui/FilterCardButton',
  component: FilterCardButton,
} satisfies Meta<typeof FilterCardButton>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = { args: { children: 'Жанр' } };
