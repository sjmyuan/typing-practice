import { forwardRef } from 'react';
import TypingCursor from './TypingCursor';
import { getPinyinForChar, getPinyinWithoutTonesForChar, containsChinese, containsChinesePunctuation, getEnglishPunctuationForChinese } from '../utils/pinyinUtils';

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
  characterWidth?: string;
}

const PinyinCharacterDisplay = forwardRef<HTMLSpanElement, PinyinCharacterDisplayProps>(({
  char,
  state,
  index,
  onClick,
  showCursor,
  showPinyin = false,
  pinyinInput = '',
  pinyinState = 'neutral',
  characterWidth = 'min-w-[2rem]'
}, ref) => {
  // Apply consistent base styling to all characters to maintain uniform width
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

  const displayChar = char === ' ' ? '\u00A0' : char;
  const pinyin = showPinyin && containsChinese(char) ? getPinyinForChar(char) : null;
  const pinyinWithoutTones = showPinyin && containsChinese(char) ? getPinyinWithoutTonesForChar(char) : null;
  
  // Handle Chinese punctuation display
  const isChinesePunct = containsChinesePunctuation(char);
  const englishPunctuation = isChinesePunct ? getEnglishPunctuationForChinese(char) : null;
  
  // For pinyin display with cursor positioning
  const renderPinyinWithCursor = () => {
    if (!pinyin || !pinyinWithoutTones) {
      return null;
    }

    const inputLength = pinyinInput.length;
    
    return pinyin.split('').map((pinyinChar, charIndex) => {
      let charStyle = '';
      
      if (charIndex < inputLength) {
        // Character already typed - compare against pinyin without tones
        const typedChar = pinyinInput[charIndex];
        const expectedChar = pinyinWithoutTones[charIndex];
        charStyle = typedChar === expectedChar ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
      } else {
        charStyle = 'text-gray-400';
      }
      
      // Show cursor at current typing position
      const showCharCursor = showCursor && charIndex === inputLength;
      
      return (
        <span key={`pinyin-${index}-${charIndex}`} className={`relative ${charStyle}`}>
          {pinyinChar}
          {showCharCursor && <TypingCursor visible={true} />}
        </span>
      );
    });
  };
  
  // For English punctuation display with cursor positioning
  const renderEnglishPunctuationWithCursor = () => {
    if (!englishPunctuation) {
      return null;
    }

    const inputLength = pinyinInput.length;
    
    return englishPunctuation.split('').map((punctChar, charIndex) => {
      let charStyle = '';
      
      if (charIndex < inputLength) {
        // Character already typed
        const typedChar = pinyinInput[charIndex];
        charStyle = typedChar === punctChar ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
      } else {
        charStyle = 'text-gray-400';
      }
      
      // Show cursor at current typing position
      const showCharCursor = showCursor && charIndex === inputLength;
      
      return (
        <span key={`punct-${index}-${charIndex}`} className={`relative ${charStyle}`}>
          {punctChar}
          {showCharCursor && <TypingCursor visible={true} />}
        </span>
      );
    });
  };
  
  // Determine pinyin styling based on typing state
  let pinyinClassName = 'leading-none mb-1 select-none relative text-[0.75em]';
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
      ref={ref}
      data-testid="pinyin-practice-char"
      className={className}
      onClick={handleClick}
      aria-label={state}
    >
      {/* Pinyin display above Chinese character OR English punctuation above Chinese punctuation */}
      {(pinyin || (showPinyin && englishPunctuation)) && (
        <span 
          className={pinyinClassName}
          data-testid="pinyin-display"
        >
          {pinyin ? renderPinyinWithCursor() : renderEnglishPunctuationWithCursor()}
        </span>
      )}
      
      {/* Main character */}
      <span className="relative" data-testid="main-character">
        {displayChar}
        {showCursor && !containsChinese(char) && !isChinesePunct && <TypingCursor visible={true} />}
      </span>
    </span>
  );
});

PinyinCharacterDisplay.displayName = 'PinyinCharacterDisplay';

export default PinyinCharacterDisplay;
