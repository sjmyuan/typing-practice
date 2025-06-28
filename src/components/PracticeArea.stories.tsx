import type { Meta, StoryObj } from '@storybook/react-vite';
import PracticeArea from './PracticeArea';

const meta: Meta<typeof PracticeArea> = {
  title: 'Components/PracticeArea',
  component: PracticeArea,
  tags: ['autodocs'],
  argTypes: {
    initialPrompt: {
      control: 'text',
      description: 'The prompt text for typing practice',
      defaultValue: 'hello world',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PracticeArea>;

export const Default: Story = {
  args: {
    initialPrompt: 'Hello, world!',
  },
};

export const ShortPrompt: Story = {
  args: {
    initialPrompt: 'cat',
  },
};

export const LongPrompt: Story = {
  args: {
    initialPrompt: 'The quick brown fox jumps over the lazy dog.',
  },
};

export const WithSpaces: Story = {
  args: {
    initialPrompt: 'Practice typing with spaces',
  },
};
