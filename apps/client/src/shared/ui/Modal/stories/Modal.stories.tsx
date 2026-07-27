import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useState } from 'react';

import { Modal } from '../ui';

const meta = {
  title: 'shared/ui/Modal',
  component: Modal,
  args: {
    isOpen: true,
    onClose: () => undefined,
    children: 'Тело модалки',
    title: 'Заголовок',
  },
} satisfies Meta<typeof Modal>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  render: function ModalStory(args) {
    const [open, setOpen] = useState(true);
    return <Modal {...args} isOpen={open} onClose={() => setOpen(false)} />;
  },
};
