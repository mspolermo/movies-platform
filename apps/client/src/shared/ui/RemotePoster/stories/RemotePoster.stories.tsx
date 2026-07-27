import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';

import { RemotePoster } from '../ui';

const sizedDecorator: Decorator = (Story) => (
  <div style={{ position: 'relative', width: 160, height: 240 }}>
    <Story />
  </div>
);

const meta = {
  title: 'shared/ui/RemotePoster',
  component: RemotePoster,
  decorators: [sizedDecorator],
} satisfies Meta<typeof RemotePoster>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: { alt: 'Poster', size: 'm', src: 'https://picsum.photos/200/300' },
};

export const Fallback: TStory = {
  args: { alt: 'Poster', size: 's', src: null },
};
