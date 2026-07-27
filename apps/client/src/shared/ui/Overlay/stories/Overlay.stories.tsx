import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useState } from 'react';

import { Overlay } from '../ui';

const meta = {
  title: 'shared/ui/Overlay',
  component: Overlay,
  args: {
    isOpen: true,
    onClose: () => undefined,
    children: <div style={{ padding: 24 }}>Content</div>,
  },
} satisfies Meta<typeof Overlay>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  render: function OverlayStory(args) {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <button type="button" onClick={() => setOpen((v) => !v)}>
          Toggle
        </button>
        <Overlay {...args} isOpen={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
