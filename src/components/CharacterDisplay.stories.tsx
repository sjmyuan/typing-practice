import type { Meta, StoryObj } from '@storybook/react-vite';
import CharacterDisplay from './CharacterDisplay';

const meta: Meta<typeof CharacterDisplay> = {
  title: 'Components/CharacterDisplay',
  component: CharacterDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    char: {
      control: 'text',
      description: 'The character to display',
    },
    state: {
      control: 'select',
      options: ['untyped', 'correct', 'incorrect', 'skipped'],
      description: 'The current state of the character',
    },
    index: {
      control: 'number',
      description: 'The index position of the character',
    },
    showCursor: {
      control: 'boolean',
      description: 'Whether to show the cursor on this character',
    },
  },
  args: {
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Untyped: Story = {
  args: {
    char: 'a',
    state: 'untyped',
    index: 0,
    showCursor: false,
  },
};

export const Correct: Story = {
  args: {
    char: 'a',
    state: 'correct',
    index: 0,
    showCursor: false,
  },
};

export const Incorrect: Story = {
  args: {
    char: 'a',
    state: 'incorrect',
    index: 0,
    showCursor: false,
  },
};

export const Skipped: Story = {
  args: {
    char: 'a',
    state: 'skipped',
    index: 0,
    showCursor: false,
  },
};

export const WithCursor: Story = {
  args: {
    char: 'a',
    state: 'untyped',
    index: 0,
    showCursor: true,
  },
};

export const Space: Story = {
  args: {
    char: ' ',
    state: 'untyped',
    index: 0,
    showCursor: false,
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-2">
        <Story />
      </div>
    ),
  ],
};

export const Word: Story = {
  args: {
    char: 'l',
    state: 'correct',
    index: 2,
    showCursor: true,
  },
  decorators: [
    (Story) => (
      <div className="flex text-2xl font-mono">
        <CharacterDisplay char="h" state="correct" index={0} onClick={() => {}} showCursor={false} />
        <CharacterDisplay char="e" state="correct" index={1} onClick={() => {}} showCursor={false} />
        <Story />
        <CharacterDisplay char="l" state="untyped" index={3} onClick={() => {}} showCursor={false} />
        <CharacterDisplay char="o" state="untyped" index={4} onClick={() => {}} showCursor={false} />
      </div>
    ),
  ],
};

export const MixedStates: Story = {
  decorators: [
    () => (
      <div className="flex text-2xl font-mono gap-1">
        <CharacterDisplay char="h" state="correct" index={0} onClick={() => {}} showCursor={false} />
        <CharacterDisplay char="e" state="incorrect" index={1} onClick={() => {}} showCursor={false} />
        <CharacterDisplay char="l" state="skipped" index={2} onClick={() => {}} showCursor={false} />
        <CharacterDisplay char="l" state="untyped" index={3} onClick={() => {}} showCursor={true} />
        <CharacterDisplay char="o" state="untyped" index={4} onClick={() => {}} showCursor={false} />
      </div>
    ),
  ],
};
