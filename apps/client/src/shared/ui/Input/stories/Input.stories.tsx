import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '../ui';

const meta = {
  title: 'shared/ui/Input',
  component: Input,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof Input>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = { args: { label: 'Email', placeholder: 'you@example.com' } };

export const WithError: TStory = {
  args: { label: 'Email', error: 'Неверный формат', defaultValue: 'bad' },
};

export const Clearable: TStory = {
  args: { placeholder: 'Поиск…', clearable: true, defaultValue: 'query' },
};

export const Small: TStory = {
  args: { label: 'Имя', size: 'small', placeholder: '…' },
};
