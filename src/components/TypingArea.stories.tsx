import type { Meta, StoryObj } from '@storybook/react-vite';
import TypingArea from './TypingArea';

const meta: Meta<typeof TypingArea> = {
  title: 'Components/TypingArea',
  component: TypingArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    prompt: {
      control: 'text',
      description: 'The text prompt for typing practice',
    },
    onComplete: {
      action: 'completed',
      description: 'Function called when typing is completed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortWord: Story = {
  args: {
    prompt: 'hello',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const LongerText: Story = {
  args: {
    prompt: 'The quick brown fox jumps over the lazy dog',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const WithPunctuation: Story = {
  args: {
    prompt: 'Hello, world! How are you?',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const Numbers: Story = {
  args: {
    prompt: 'The year is 2025',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const SingleCharacter: Story = {
  args: {
    prompt: 'a',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const MultipleSpaces: Story = {
  args: {
    prompt: 'a b c d e',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const Interactive: Story = {
  args: {
    prompt: 'Type this text',
    onComplete: (stats) => alert(`Completed! Accuracy: ${stats.accuracy}%`),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <div className="mb-4 text-sm text-gray-600">
          Click in the area below and start typing to test the component
        </div>
        <Story />
      </div>
    ),
  ],
};

export const ChinesePinyinMixed: Story = {
  args: {
    prompt: 'Hello 你好世界！',
    practiceMode: 'pinyin',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};

export const ChineseWithPunctuation: Story = {
  args: {
    prompt: '你好，世界！我很高兴。',
    practiceMode: 'pinyin',
    onComplete: (stats) => console.log('Completed with stats:', stats),
  },
};
