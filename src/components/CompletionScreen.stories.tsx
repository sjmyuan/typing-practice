import type { Meta, StoryObj } from '@storybook/react-vite';
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
      action: 'practice-again',
      description: 'Function called when Practice Again button is clicked',
    },
    onStartNew: {
      action: 'start-new',
      description: 'Function called when Start New Practice button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Perfect: Story = {
  args: {
    accuracy: 100,
    onRestart: () => console.log('Practice Again clicked!'),
    onStartNew: () => console.log('Start New Practice clicked!'),
  },
};

export const Good: Story = {
  args: {
    accuracy: 85,
    onRestart: () => console.log('Practice Again clicked!'),
    onStartNew: () => console.log('Start New Practice clicked!'),
  },
};

export const Average: Story = {
  args: {
    accuracy: 65,
    onRestart: () => console.log('Practice Again clicked!'),
    onStartNew: () => console.log('Start New Practice clicked!'),
  },
};

export const Poor: Story = {
  args: {
    accuracy: 30,
    onRestart: () => console.log('Practice Again clicked!'),
    onStartNew: () => console.log('Start New Practice clicked!'),
  },
};

export const Zero: Story = {
  args: {
    accuracy: 0,
    onRestart: () => console.log('Practice Again clicked!'),
    onStartNew: () => console.log('Start New Practice clicked!'),
  },
};

export const Interactive: Story = {
  args: {
    accuracy: 78,
    onRestart: () => alert('Practice Again clicked!'),
    onStartNew: () => alert('Start New Practice clicked!'),
  },
};
