import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SvgIcon } from '@/shared/ui/SvgIcon';

import { Button } from '../ui';

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'red', 'outline'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = { args: { children: 'Сохранить', variant: 'default' } };
export const Red: TStory = { args: { children: 'Удалить', variant: 'red' } };
export const Outline: TStory = { args: { children: 'Отмена', variant: 'outline' } };
export const Loading: TStory = { args: { children: '…', loading: true } };
export const WithIcon: TStory = {
  args: {
    children: 'Фильтры',
    variant: 'outline',
    icon: <SvgIcon aria-hidden icon="filters" size={20} />,
  },
};
export const Disabled: TStory = { args: { children: 'Недоступно', disabled: true } };
