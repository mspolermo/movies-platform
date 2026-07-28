import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useState } from 'react';

import { Select } from '../ui';

const OPTIONS = [
  { value: 'actor', label: 'Актёр' },
  { value: 'director', label: 'Режиссёр' },
  { value: 'writer', label: 'Сценарист' },
];

const meta = {
  title: 'shared/ui/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Single: TStory = {
  args: {
    label: 'Роль',
    options: OPTIONS,
    value: 'actor',
    onChange: () => undefined,
  },
};

const MultipleDemo = () => {
  const [value, setValue] = useState<string[]>(['actor']);
  return <Select multiple label="Профессии" options={OPTIONS} value={value} onChange={setValue} />;
};

export const Multiple = {
  render: () => <MultipleDemo />,
};
