import React, { useState, useEffect, useRef } from 'react';

interface PracticeAreaProps {
  prompt: string;
}

// Character state types
type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';

interface CharacterData {
  char: string;
  state: CharacterState;
  typedChar?: string;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ prompt }) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [characters, setCharacters] = useState<CharacterData[]>(() => 
    prompt.split('').map(char => ({ char, state: 'untyped' as CharacterState }))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault(); // Prevent default browser behavior
    
    if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key.length === 1 && cursorPosition < prompt.length) {
      // Only accept single character keys and don't exceed prompt length
      handleCharacterInput(e.key);
    }
  };

  // Handle character input
  const handleCharacterInput = (inputChar: string) => {
    setCharacters(prev => {
      const newCharacters = [...prev];
      const expectedChar = prompt[cursorPosition];
      
      if (inputChar === expectedChar) {
        newCharacters[cursorPosition] = {
          char: expectedChar,
          state: 'correct',
          typedChar: inputChar
        };
      } else {
        newCharacters[cursorPosition] = {
          char: expectedChar,
          state: 'incorrect',
          typedChar: inputChar
        };
      }
      
      return newCharacters;
    });
    
    // Move cursor forward
    setCursorPosition(prev => Math.min(prev + 1, prompt.length));
  };

  // Handle backspace
  const handleBackspace = () => {
    if (cursorPosition > 0) {
      const newPosition = cursorPosition - 1;
      setCursorPosition(newPosition);
      
      setCharacters(prev => {
        const newCharacters = [...prev];
        // Reset character state to untyped and clear all characters after cursor
        for (let i = newPosition; i < newCharacters.length; i++) {
          newCharacters[i] = {
            char: prompt[i],
            state: 'untyped'
          };
        }
        return newCharacters;
      });
    }
  };

  // Handle character click for manual cursor positioning
  const handleCharacterClick = (index: number) => {
    // Mark characters between current cursor and clicked position as skipped
    setCharacters(prev => {
      const newCharacters = [...prev];
      
      if (index > cursorPosition) {
        // Moving forward - mark skipped characters
        for (let i = cursorPosition; i < index; i++) {
          if (newCharacters[i].state === 'untyped') {
            newCharacters[i] = {
              char: prompt[i],
              state: 'skipped'
            };
          }
        }
      } else if (index < cursorPosition) {
        // Moving backward - reset characters after clicked position to untyped
        for (let i = index; i < newCharacters.length; i++) {
          newCharacters[i] = {
            char: prompt[i],
            state: 'untyped'
          };
        }
      }
      
      return newCharacters;
    });
    
    setCursorPosition(index);
  };

  // Calculate statistics
  const getTypedCharacters = () => {
    return characters.filter(char => char.state === 'correct' || char.state === 'incorrect');
  };

  const getCorrectCharacters = () => {
    return characters.filter(char => char.state === 'correct');
  };

  // Auto-focus the container when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Handle clicking to focus
  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        ref={containerRef}
        role="textbox"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className="outline-none focus:ring-2 focus:ring-blue-400 rounded p-4 cursor-text bg-gray-50 focus:bg-white transition-colors"
        aria-label="practice area - click here and start typing"
      >
        <div
          className="flex flex-wrap gap-1 text-2xl font-mono select-none leading-relaxed"
          aria-label="practice prompt"
          role="presentation"
        >
          {characters.map((charData, idx) => {
            const isCurrentPosition = idx === cursorPosition;
            let className = 'relative inline-block min-w-[0.5rem] cursor-pointer';
            
            // Apply styling based on character state
            switch (charData.state) {
              case 'untyped':
                className += ' text-gray-400';
                break;
              case 'correct':
                className += ' text-green-600 font-bold bg-green-100 rounded px-1';
                break;
              case 'incorrect':
                className += ' text-red-600 font-bold bg-red-100 rounded px-1';
                break;
              case 'skipped':
                className += ' text-yellow-700 font-bold bg-yellow-100 rounded px-1 line-through';
                break;
            }

            return (
              <span
                key={idx}
                data-testid="practice-char"
                className={className}
                onClick={() => handleCharacterClick(idx)}
                aria-label={charData.state}
              >
                {charData.char === ' ' ? '\u00A0' : charData.char}
                {isCurrentPosition && cursorPosition < prompt.length && (
                  <span
                    data-testid="cursor"
                    className="absolute top-0 left-0 animate-pulse bg-blue-500 w-0.5 h-full shadow-lg"
                    style={{
                      animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          })}
          {cursorPosition === prompt.length && (
            <span className="text-green-600 font-bold ml-2">✓ Complete!</span>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {getTypedCharacters().length === 0 ? (
            <p>Click here and start typing to begin practice</p>
          ) : (
            <p>
              Progress: {getTypedCharacters().length}/{prompt.length} characters
              {getTypedCharacters().length > 0 && (
                <span className="ml-4">
                  Accuracy: {Math.round((getCorrectCharacters().length / getTypedCharacters().length) * 100)}%
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeArea;
