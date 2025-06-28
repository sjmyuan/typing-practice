import type { Meta, StoryObj } from '@storybook/react-vite';
import StartScreen from './StartScreen';

const meta: Meta<typeof StartScreen> = {
  title: 'Components/StartScreen',
  component: StartScreen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onStart: {
      action: 'started',
      description: 'Function called when start button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStart: () => console.log('Practice started!'),
  },
};

export const Interactive: Story = {
  args: {
    onStart: () => alert('Practice would start now!'),
  },
};
