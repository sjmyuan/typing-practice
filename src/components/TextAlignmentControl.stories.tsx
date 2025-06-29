import type { Meta, StoryObj } from '@storybook/react';
import TextAlignmentControl from './TextAlignmentControl';

const meta: Meta<typeof TextAlignmentControl> = {
  title: 'Components/TextAlignmentControl',
  component: TextAlignmentControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentAlignment: {
      control: { type: 'radio' },
      options: ['left', 'center', 'right', 'justify'],
    },
    onAlignmentChange: { action: 'alignment-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  args: {
    currentAlignment: 'left',
  },
};

export const Center: Story = {
  args: {
    currentAlignment: 'center',
  },
};

export const Right: Story = {
  args: {
    currentAlignment: 'right',
  },
};

export const Justify: Story = {
  args: {
    currentAlignment: 'justify',
  },
};

export const Interactive: Story = {
  args: {
    currentAlignment: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on different alignment buttons to see the interaction.',
      },
    },
  },
};
