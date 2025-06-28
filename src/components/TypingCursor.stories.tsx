import type { Meta, StoryObj } from '@storybook/react-vite';
import TypingCursor from './TypingCursor';

const meta: Meta<typeof TypingCursor> = {
  title: 'Components/TypingCursor',
  component: TypingCursor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Whether the cursor should be visible',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  args: {
    visible: true,
  },
  decorators: [
    (Story) => (
      <div className="relative inline-block bg-gray-100 p-4 text-2xl font-mono">
        A<Story />
      </div>
    ),
  ],
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
  decorators: [
    (Story) => (
      <div className="relative inline-block bg-gray-100 p-4 text-2xl font-mono">
        A<Story />
      </div>
    ),
  ],
};

export const InText: Story = {
  args: {
    visible: true,
  },
  decorators: [
    (Story) => (
      <div className="flex text-2xl font-mono">
        <span className="relative inline-block px-1">H</span>
        <span className="relative inline-block px-1">e</span>
        <span className="relative inline-block px-1">
          l<Story />
        </span>
        <span className="relative inline-block px-1 text-gray-400">l</span>
        <span className="relative inline-block px-1 text-gray-400">o</span>
      </div>
    ),
  ],
};
