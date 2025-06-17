import type { Meta, StoryObj } from '@storybook/react';
import PracticeArea from './PracticeArea';

const meta: Meta<typeof PracticeArea> = {
  title: 'PracticeArea',
  component: PracticeArea,
  tags: ['autodocs'],
  argTypes: {
    prompt: {
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
    prompt: 'Hello, world!',
  },
};

export const ShortPrompt: Story = {
  args: {
    prompt: 'cat',
  },
};

export const LongPrompt: Story = {
  args: {
    prompt: 'The quick brown fox jumps over the lazy dog.',
  },
};

export const WithSpaces: Story = {
  args: {
    prompt: 'Practice typing with spaces',
  },
};
