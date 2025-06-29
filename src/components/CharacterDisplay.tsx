import React, { forwardRef } from 'react';
import TypingCursor from './TypingCursor';

type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';

interface CharacterDisplayProps {
  char: string;
  state: CharacterState;
  index: number;
  onClick: (index: number) => void;
  showCursor: boolean;
  characterWidth?: string;
}

const CharacterDisplay = forwardRef<HTMLSpanElement, CharacterDisplayProps>(({
  char,
  state,
  index,
  onClick,
  showCursor,
  characterWidth = 'min-w-[0.5rem]'
}, ref) => {
  // Apply consistent base styling to all characters to maintain uniform width
  // Use flex-col layout with justify-end to match PinyinCharacterDisplay height
  let className = `relative inline-flex flex-col items-center justify-end cursor-pointer px-0.5 rounded ${characterWidth}`;
  
  // Apply color and background styling based on character state
  switch (state) {
    case 'untyped':
      className += ' text-gray-400';
      break;
    case 'correct':
      className += ' text-green-600 font-bold bg-green-100';
      break;
    case 'incorrect':
      className += ' text-red-600 font-bold bg-red-100';
      break;
    case 'skipped':
      className += ' text-yellow-700 font-bold bg-yellow-100 line-through';
      break;
  }

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(index);
    }
  };

  return (
    <span
      ref={ref}
      data-testid="practice-char"
      className={className}
      onClick={handleClick}
      aria-label={state}
    >
      {/* Invisible spacer to match pinyin height */}
      <span className="leading-none mb-1 select-none text-[0.75em] invisible">
        &nbsp;
      </span>
      
      {/* Main character */}
      <span className="relative">
        {char === ' ' ? '\u00A0' : char === '\n' ? '↵' : char}
        {showCursor && <TypingCursor visible={true} />}
      </span>
    </span>
  );
});

CharacterDisplay.displayName = 'CharacterDisplay';

export default CharacterDisplay;
