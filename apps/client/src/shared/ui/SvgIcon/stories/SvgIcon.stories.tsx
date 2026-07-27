import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { iconsLibrary } from '../constants';
import { SvgIcon } from '../ui';

const iconNames = Object.keys(iconsLibrary) as Array<keyof typeof iconsLibrary>;

const meta = {
  title: 'shared/ui/SvgIcon',
  component: SvgIcon,
  args: {
    icon: 'search',
    size: 24,
  },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    size: { control: 'text' },
  },
} satisfies Meta<typeof SvgIcon>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Sizes: TStory = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--color-text)' }}>
      <SvgIcon icon="search" size={16} />
      <SvgIcon icon="search" size={24} />
      <SvgIcon icon="search" size={48} />
      <SvgIcon icon="search" size="2rem" />
    </div>
  ),
};

export const Catalog: TStory = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
        gap: 16,
        color: 'var(--color-text)',
        width: 480,
      }}
    >
      {iconNames.map((icon) => (
        <div
          key={icon}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <SvgIcon icon={icon} size={24} />
          <span style={{ fontSize: 11 }}>{icon}</span>
        </div>
      ))}
    </div>
  ),
};

export const Decorative: TStory = {
  args: {
    icon: 'search',
  },
};

export const Meaningful: TStory = {
  args: {
    icon: 'search',
    'aria-label': 'Поиск',
  },
};
