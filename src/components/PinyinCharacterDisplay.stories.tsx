import type { Meta, StoryObj } from '@storybook/react';
import PinyinCharacterDisplay from './PinyinCharacterDisplay';

const meta = {
  title: 'Components/PinyinCharacterDisplay',
  component: PinyinCharacterDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    char: '你',
    state: 'untyped',
    index: 0,
    onClick: () => {},
    showCursor: false,
    showPinyin: true,
  },
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['untyped', 'correct', 'incorrect', 'skipped'],
    },
    char: {
      control: { type: 'text' },
    },
    index: {
      control: { type: 'number' },
    },
    showCursor: {
      control: { type: 'boolean' },
    },
    showPinyin: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof PinyinCharacterDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChineseCharacterWithPinyin: Story = {
  args: {
    char: '你',
    state: 'untyped',
    showPinyin: true,
  },
};

export const ChineseCharacterWithoutPinyin: Story = {
  args: {
    char: '你',
    state: 'untyped',
    showPinyin: false,
  },
};

export const EnglishCharacter: Story = {
  args: {
    char: 'a',
    state: 'untyped',
    showPinyin: true, // Should not show pinyin for English
  },
};

export const CorrectState: Story = {
  args: {
    char: '好',
    state: 'correct',
    showPinyin: true,
  },
};

export const IncorrectState: Story = {
  args: {
    char: '学',
    state: 'incorrect',
    showPinyin: true,
  },
};

export const SkippedState: Story = {
  args: {
    char: '习',
    state: 'skipped',
    showPinyin: true,
  },
};

export const WithCursor: Story = {
  args: {
    char: '世',
    state: 'untyped',
    showCursor: true,
    showPinyin: true,
  },
};

export const SpaceCharacter: Story = {
  args: {
    char: ' ',
    state: 'untyped',
    showPinyin: true,
  },
};

export const PinyinPracticeExample: Story = {
  decorators: [
    () => (
      <div className="flex text-3xl font-mono gap-1">
        <PinyinCharacterDisplay 
          char="你" 
          state="correct" 
          index={0} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="好" 
          state="incorrect" 
          index={1} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="世" 
          state="skipped" 
          index={2} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="界" 
          state="untyped" 
          index={3} 
          onClick={() => {}} 
          showCursor={true} 
          showPinyin={true} 
        />
      </div>
    ),
  ],
};

export const MixedTextExample: Story = {
  decorators: [
    () => (
      <div className="flex text-3xl font-mono gap-1">
        <PinyinCharacterDisplay 
          char="H" 
          state="correct" 
          index={0} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="e" 
          state="correct" 
          index={1} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="l" 
          state="correct" 
          index={2} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="l" 
          state="correct" 
          index={3} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="o" 
          state="correct" 
          index={4} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char=" " 
          state="correct" 
          index={5} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={6} 
          onClick={() => {}} 
          showCursor={true} 
          showPinyin={true} 
        />
        <PinyinCharacterDisplay 
          char="好" 
          state="untyped" 
          index={7} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
      </div>
    ),
  ],
};
