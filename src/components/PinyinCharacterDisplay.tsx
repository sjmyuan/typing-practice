import React from 'react';
import TypingCursor from './TypingCursor';
import CharacterDisplay from './CharacterDisplay';
import { getPinyinForChar, getPinyinWithoutTonesForChar, containsChinese } from '../utils/pinyinUtils';

type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';
type PinyinState = 'neutral' | 'correct' | 'incorrect';

interface PinyinCharacterDisplayProps {
  char: string;
  state: CharacterState;
  index: number;
  onClick: (index: number) => void;
  showCursor: boolean;
  showPinyin?: boolean;
  pinyinInput?: string;
  pinyinState?: PinyinState;
}

const PinyinCharacterDisplay: React.FC<PinyinCharacterDisplayProps> = ({
  char,
  state,
  index,
  onClick,
  showCursor,
  showPinyin = false,
  pinyinInput = '',
  pinyinState = 'neutral'
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
  const pinyinWithoutTones = showPinyin && containsChinese(char) ? getPinyinWithoutTonesForChar(char) : null;
  
  // For pinyin display with cursor positioning using CharacterDisplay
  const renderPinyinWithCursor = () => {
    if (!pinyin || !pinyinWithoutTones) {
      return null;
    }

    const inputLength = pinyinInput.length;
    
    return pinyin.split('').map((pinyinChar, charIndex) => {
      let charState: CharacterState = 'untyped';
      
      if (charIndex < inputLength) {
        // Character already typed - compare against pinyin without tones
        const typedChar = pinyinInput[charIndex];
        const expectedChar = pinyinWithoutTones[charIndex];
        charState = typedChar === expectedChar ? 'correct' : 'incorrect';
      }
      
      // Show cursor at current typing position
      const showCharCursor = showCursor && charIndex === inputLength;
      
      return (
        <CharacterDisplay
          key={`pinyin-${index}-${charIndex}`}
          char={pinyinChar}
          state={charState}
          index={charIndex}
          onClick={() => {}} // No click handling for individual pinyin characters
          showCursor={showCharCursor}
        />
      );
    });
  };
  
  // Determine pinyin styling based on typing state
  let pinyinClassName = 'text-base leading-none mb-1 select-none relative';
  switch (pinyinState) {
    case 'correct':
      pinyinClassName += ' text-green-600';
      break;
    case 'incorrect':
      pinyinClassName += ' text-red-600';
      break;
    default:
      pinyinClassName += ' text-gray-600';
      break;
  }

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
          className={pinyinClassName}
          data-testid="pinyin-display"
        >
          {renderPinyinWithCursor()}
        </span>
      )}
      
      {/* Main character */}
      <span className="relative text-sm" data-testid="main-character">
        {displayChar}
        {showCursor && !containsChinese(char) && <TypingCursor visible={true} />}
      </span>
    </span>
  );
};

export default PinyinCharacterDisplay;
