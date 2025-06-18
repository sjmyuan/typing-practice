import type { Meta, StoryObj } from '@storybook/react';
import CompletionScreen from './CompletionScreen';

const meta: Meta<typeof CompletionScreen> = {
  title: 'Components/CompletionScreen',
  component: CompletionScreen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    accuracy: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Accuracy percentage achieved',
    },
    onRestart: {
      action: 'restarted',
      description: 'Function called when restart button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Perfect: Story = {
  args: {
    accuracy: 100,
    onRestart: () => console.log('Practice restarted!'),
  },
};

export const Good: Story = {
  args: {
    accuracy: 85,
    onRestart: () => console.log('Practice restarted!'),
  },
};

export const Average: Story = {
  args: {
    accuracy: 65,
    onRestart: () => console.log('Practice restarted!'),
  },
};

export const Poor: Story = {
  args: {
    accuracy: 30,
    onRestart: () => console.log('Practice restarted!'),
  },
};

export const Zero: Story = {
  args: {
    accuracy: 0,
    onRestart: () => console.log('Practice restarted!'),
  },
};

export const Interactive: Story = {
  args: {
    accuracy: 78,
    onRestart: () => alert('Practice would restart now!'),
  },
};
