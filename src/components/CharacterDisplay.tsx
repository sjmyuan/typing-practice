import React from 'react';
import TypingCursor from './TypingCursor';

type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';

interface CharacterDisplayProps {
  char: string;
  state: CharacterState;
  index: number;
  onClick: (index: number) => void;
  showCursor: boolean;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  char,
  state,
  index,
  onClick,
  showCursor
}) => {
  // Apply consistent base styling to all characters to maintain uniform width
  let className = 'relative inline-block min-w-[0.5rem] cursor-pointer px-0.5 rounded';
  
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
      data-testid="practice-char"
      className={className}
      onClick={handleClick}
      aria-label={state}
    >
      {char === ' ' ? '\u00A0' : char === '\n' ? '↵' : char}
      {showCursor && <TypingCursor visible={true} />}
    </span>
  );
};

export default CharacterDisplay;
