import type { Meta, StoryObj } from '@storybook/react-vite';
import EnhancedStartScreen from './EnhancedStartScreen';

const meta: Meta<typeof EnhancedStartScreen> = {
  title: 'Components/EnhancedStartScreen',
  component: EnhancedStartScreen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStart: (text: string) => console.log('Start practice with:', text),
  },
};
