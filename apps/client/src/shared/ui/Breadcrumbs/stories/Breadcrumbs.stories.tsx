import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Breadcrumbs } from '../ui';

const meta = {
  title: 'shared/ui/Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: { items: [{ label: 'Главная', href: '/' }, { label: 'Фильмы' }] },
};
