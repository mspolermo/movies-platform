import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HorizontalCarousel } from '../ui';

const meta = {
  title: 'shared/ui/HorizontalCarousel',
  component: HorizontalCarousel,
  args: {
    children: null,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HorizontalCarousel>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  render: () => (
    <HorizontalCarousel>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          style={{ minWidth: 160, padding: 16, background: 'var(--color-bg-secondary)' }}
        >
          {n}
        </div>
      ))}
    </HorizontalCarousel>
  ),
};

export const NoSnap: TStory = {
  args: {
    snapType: 'none',
    arrows: 'always',
    children: (
      <>
        <div style={{ minWidth: 200 }}>A</div>
        <div style={{ minWidth: 200 }}>B</div>
      </>
    ),
  },
};
