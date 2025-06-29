import type { Meta, StoryObj } from '@storybook/react-vite';
import PoemBrowser from './PoemBrowser';

const meta: Meta<typeof PoemBrowser> = {
  title: 'Components/PoemBrowser',
  component: PoemBrowser,
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
    onBack: () => console.log('Back to options clicked'),
  },
};
