import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExpandableBlock } from '../ui';

const meta = {
  title: 'shared/ui/ExpandableBlock',
  component: ExpandableBlock,
  argTypes: {
    variant: { control: 'select', options: ['accent', 'neutral', 'warning'] },
  },
} satisfies Meta<typeof ExpandableBlock>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Accent: TStory = {
  args: {
    expandLabel: 'Подробнее',
    collapseLabel: 'Скрыть',
    children: 'Контент',
    variant: 'accent',
  },
};

export const Neutral: TStory = {
  args: {
    expandLabel: 'Подробнее',
    collapseLabel: 'Скрыть',
    children: 'Контент',
    variant: 'neutral',
  },
};

export const Warning: TStory = {
  args: {
    expandLabel: 'Подробнее',
    collapseLabel: 'Скрыть',
    children: 'Контент',
    variant: 'warning',
  },
};
