import type { Meta, StoryObj } from '@storybook/react';
import ProgressDisplay from './ProgressDisplay';

const meta: Meta<typeof ProgressDisplay> = {
  title: 'Components/ProgressDisplay',
  component: ProgressDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    typedCount: {
      control: 'number',
      description: 'Number of characters typed',
    },
    totalCount: {
      control: 'number',
      description: 'Total number of characters in the prompt',
    },
    correctCount: {
      control: 'number',
      description: 'Number of correctly typed characters',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  args: {
    typedCount: 0,
    totalCount: 10,
    correctCount: 0,
  },
};

export const InProgress: Story = {
  args: {
    typedCount: 5,
    totalCount: 10,
    correctCount: 4,
  },
};

export const Perfect: Story = {
  args: {
    typedCount: 10,
    totalCount: 10,
    correctCount: 10,
  },
};

export const WithErrors: Story = {
  args: {
    typedCount: 8,
    totalCount: 15,
    correctCount: 5,
  },
};

export const LowAccuracy: Story = {
  args: {
    typedCount: 10,
    totalCount: 20,
    correctCount: 3,
  },
};

export const SingleCharacter: Story = {
  args: {
    typedCount: 1,
    totalCount: 1,
    correctCount: 1,
  },
};

export const LongText: Story = {
  args: {
    typedCount: 45,
    totalCount: 100,
    correctCount: 38,
  },
};
