import React from 'react';
import TypingCursor from './TypingCursor';
import { getPinyinForChar, containsChinese } from '../utils/pinyinUtils';

type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';

interface PinyinCharacterDisplayProps {
  char: string;
  state: CharacterState;
  index: number;
  onClick: (index: number) => void;
  showCursor: boolean;
  showPinyin?: boolean;
  pinyinInput?: string;
}

const PinyinCharacterDisplay: React.FC<PinyinCharacterDisplayProps> = ({
  char,
  state,
  index,
  onClick,
  showCursor,
  showPinyin = false,
  pinyinInput = ''
}) => {
  // Apply consistent base styling to all characters to maintain uniform width
  let className = 'relative inline-flex flex-col items-center cursor-pointer px-0.5 rounded min-w-[2rem]';
  
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

  const displayChar = char === ' ' ? '\u00A0' : char;
  const pinyin = showPinyin && containsChinese(char) ? getPinyinForChar(char) : null;
  
  // Show current pinyin input if typing this character
  const showInputProgress = showCursor && pinyinInput.length > 0;

  return (
    <span
      data-testid="pinyin-practice-char"
      className={className}
      onClick={handleClick}
      aria-label={state}
    >
      {/* Pinyin display above character */}
      {pinyin && (
        <span 
          className="text-xs text-gray-600 leading-none mb-1 select-none"
          data-testid="pinyin-display"
        >
          {pinyin}
        </span>
      )}
      
      {/* Current pinyin input progress */}
      {showInputProgress && (
        <span 
          className="text-xs text-blue-600 leading-none mb-1 font-mono bg-blue-100 px-1 rounded"
          data-testid="pinyin-input"
        >
          {pinyinInput}
        </span>
      )}
      
      {/* Main character */}
      <span className="relative">
        {displayChar}
        {showCursor && <TypingCursor visible={true} />}
      </span>
    </span>
  );
};

export default PinyinCharacterDisplay;
