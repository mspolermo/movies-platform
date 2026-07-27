import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QualityTag } from '../ui';

const meta = {
  title: 'shared/ui/QualityTag',
  component: QualityTag,
} satisfies Meta<typeof QualityTag>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = { args: { quality: 'FullHD' } };
