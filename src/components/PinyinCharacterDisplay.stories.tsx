import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
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
    pinyinInput: {
      control: { type: 'text' },
    },
    pinyinState: {
      control: { type: 'select' },
      options: ['neutral', 'correct', 'incorrect'],
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

export const PinyinTypingStates: Story = {
  name: 'Pinyin Typing Progress',
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div>Ready to Type</div>
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={() => {}} 
          showCursor={true} 
          showPinyin={true} 
          pinyinInput=""
          pinyinState="neutral"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>Typing "n"</div>
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={1} 
          onClick={() => {}} 
          showCursor={true} 
          showPinyin={true} 
          pinyinInput="n"
          pinyinState="correct"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>Typing "ni" (Complete)</div>
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={2} 
          onClick={() => {}} 
          showCursor={true} 
          showPinyin={true} 
          pinyinInput="ni"
          pinyinState="correct"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>Wrong Input "nx"</div>
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={3} 
          onClick={() => {}} 
          showCursor={true} 
          showPinyin={true} 
          pinyinInput="nx"
          pinyinState="incorrect"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>Completed Character</div>
        <PinyinCharacterDisplay 
          char="你" 
          state="correct" 
          index={4} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
          pinyinInput=""
          pinyinState="neutral"
        />
      </div>
    </div>
  ),
};

export const FontSizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div>With Pinyin (Larger Pinyin, Smaller Character)</div>
        <PinyinCharacterDisplay 
          char="学" 
          state="untyped" 
          index={0} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={true} 
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>English Character (Normal Size)</div>
        <PinyinCharacterDisplay 
          char="A" 
          state="untyped" 
          index={1} 
          onClick={() => {}} 
          showCursor={false} 
          showPinyin={false} 
        />
      </div>
    </div>
  ),
};

export const CursorPositions: Story = {
  name: 'Cursor Movement in Pinyin',
  render: () => (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div>Chinese: Cursor moves in Pinyin</div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <PinyinCharacterDisplay 
            char="好" 
            state="untyped" 
            index={0} 
            onClick={() => {}} 
            showCursor={true} 
            showPinyin={true} 
            pinyinInput=""
          />
          <PinyinCharacterDisplay 
            char="好" 
            state="untyped" 
            index={1} 
            onClick={() => {}} 
            showCursor={true} 
            showPinyin={true} 
            pinyinInput="h"
          />
          <PinyinCharacterDisplay 
            char="好" 
            state="untyped" 
            index={2} 
            onClick={() => {}} 
            showCursor={true} 
            showPinyin={true} 
            pinyinInput="ha"
          />
          <PinyinCharacterDisplay 
            char="好" 
            state="untyped" 
            index={3} 
            onClick={() => {}} 
            showCursor={true} 
            showPinyin={true} 
            pinyinInput="hao"
          />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>English: Cursor in Character</div>
        <div style={{ marginTop: '10px' }}>
          <PinyinCharacterDisplay 
            char="H" 
            state="untyped" 
            index={4} 
            onClick={() => {}} 
            showCursor={true} 
            showPinyin={false} 
          />
        </div>
      </div>
    </div>
  ),
};

export const InteractiveExample: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl">
        Type the pinyin for the character: 
        <span className="font-bold text-2xl"> 你 </span>
        (Press Enter after typing)
      </div>
      <PinyinCharacterDisplay 
        char="你" 
        state="untyped" 
        index={0} 
        onClick={() => {}} 
        showCursor={true} 
        showPinyin={true} 
        pinyinInput=""
        pinyinState="neutral"
      />
    </div>
  ),
};

// Integration test for font size scaling in actual usage
export const FontSizeScaling: Story = {
  name: 'Font Size Scaling Demo',
  render: () => {
    const [fontSize, setFontSize] = React.useState<'text-xl' | 'text-3xl' | 'text-5xl' | 'text-7xl'>('text-3xl');
    
    const fontSizes = ['text-xl', 'text-3xl', 'text-5xl', 'text-7xl'] as const;
    const currentIndex = fontSizes.indexOf(fontSize);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div>
          <button 
            onClick={() => setFontSize(fontSizes[Math.max(0, currentIndex - 1)])}
            disabled={currentIndex === 0}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            Decrease Font Size
          </button>
          <span>Current: {fontSize}</span>
          <button 
            onClick={() => setFontSize(fontSizes[Math.min(fontSizes.length - 1, currentIndex + 1)])}
            disabled={currentIndex === fontSizes.length - 1}
            style={{ marginLeft: '10px', padding: '8px 16px' }}
          >
            Increase Font Size
          </button>
        </div>
        
        <div className={`${fontSize} font-mono`} style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3>English Character</h3>
            <PinyinCharacterDisplay 
              char="A" 
              state="untyped" 
              index={0} 
              onClick={() => {}} 
              showCursor={false} 
              showPinyin={false}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Chinese Character with Pinyin</h3>
            <PinyinCharacterDisplay 
              char="你" 
              state="untyped" 
              index={1} 
              onClick={() => {}} 
              showCursor={false} 
              showPinyin={true} 
              pinyinInput=""
              pinyinState="neutral"
            />
          </div>
          
          <div>
            <h3>Chinese Character with Typed Pinyin</h3>
            <PinyinCharacterDisplay 
              char="好" 
              state="untyped" 
              index={2} 
              onClick={() => {}} 
              showCursor={true} 
              showPinyin={true} 
              pinyinInput="ha"
              pinyinState="neutral"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const UntypedIncorrectState: Story = {
  args: {
    char: '你',
    state: 'incorrect',
    showPinyin: true,
    pinyinInput: 'xin',
    pinyinState: 'incorrect',
  },
};

export const ChinesePunctuationComma: Story = {
  args: {
    char: '，',
    state: 'untyped',
    showPinyin: true,
    pinyinInput: '',
    pinyinState: 'neutral',
  },
};

export const ChinesePunctuationExclamation: Story = {
  args: {
    char: '！',
    state: 'correct',
    showPinyin: true,
    pinyinInput: '',
    pinyinState: 'neutral',
  },
};

export const ChinesePunctuationPeriod: Story = {
  args: {
    char: '。',
    state: 'untyped',
    showPinyin: true,
    pinyinInput: '',
    pinyinState: 'neutral',
  },
};

export const ChinesePunctuationQuestion: Story = {
  args: {
    char: '？',
    state: 'incorrect',
    showPinyin: true,
    pinyinInput: '',
    pinyinState: 'neutral',
  },
};
