import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Card } from '../ui';

const meta = {
  title: 'shared/ui/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Small: TStory = {
  args: { title: 'Иван Иванов', photoUrl: 'https://picsum.photos/100', type: 'small' },
};

export const Big: TStory = {
  args: { title: 'Анна Петрова', photoUrl: 'https://picsum.photos/120', type: 'big' },
};

export const WithRole: TStory = {
  args: {
    title: 'Иван Иванов',
    role: 'Актёр',
    photoUrl: 'https://picsum.photos/100',
    type: 'small',
  },
};
