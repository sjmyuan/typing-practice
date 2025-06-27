import React, { useState, useRef, useEffect } from 'react';
import CharacterDisplay from './CharacterDisplay';
import ProgressDisplay from './ProgressDisplay';
import FontSizeControl from './FontSizeControl';

// Character state types
type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';

// Font size types
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface CharacterData {
  char: string;
  state: CharacterState;
  typedChar?: string;
}

interface TypingAreaProps {
  prompt: string;
  onComplete: (stats: {
    accuracy: number;
    totalCharacters: number;
    correctCharacters: number;
    incorrectCharacters: number;
  }) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ prompt, onComplete }) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [characters, setCharacters] = useState<CharacterData[]>(() => 
    prompt.split('').map(char => ({ char, state: 'untyped' as CharacterState }))
  );
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('typingPracticeFontSize');
    if (saved && ['small', 'medium', 'large', 'extra-large'].includes(saved)) {
      return saved as FontSize;
    }
    return 'medium';
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus the typing area on mount and add global click listener
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }

    // Add global click listener to always refocus typing area
    const handleGlobalClick = () => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    };

    document.addEventListener('click', handleGlobalClick);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

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
    const newPosition = Math.min(cursorPosition + 1, prompt.length);
    
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
      
      // Check for completion with updated characters
      if (newPosition === prompt.length) {
        const typedCharacters = newCharacters.filter(char => char.state === 'correct' || char.state === 'incorrect');
        const correctCharacters = newCharacters.filter(char => char.state === 'correct');
        const incorrectCharacters = newCharacters.filter(char => char.state === 'incorrect');
        
        const stats = {
          accuracy: Math.round((correctCharacters.length / typedCharacters.length) * 100),
          totalCharacters: prompt.length,
          correctCharacters: correctCharacters.length,
          incorrectCharacters: incorrectCharacters.length
        };

        if (typeof onComplete === 'function') {
          onComplete(stats);
        }
      }
      
      return newCharacters;
    });
    
    // Move cursor forward
    setCursorPosition(newPosition);
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

  // Calculate statistics for display
  const getTypedCharacters = () => {
    return characters.filter(char => char.state === 'correct' || char.state === 'incorrect');
  };

  const getCorrectCharacters = () => {
    return characters.filter(char => char.state === 'correct');
  };

  // Handle clicking to focus
  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  // Font size management
  const fontSizeClasses = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl',
    'extra-large': 'text-7xl'
  };

  const fontSizeOrder: FontSize[] = ['small', 'medium', 'large', 'extra-large'];

  const handleIncreaseFontSize = () => {
    const currentIndex = fontSizeOrder.indexOf(fontSize);
    if (currentIndex < fontSizeOrder.length - 1) {
      const newFontSize = fontSizeOrder[currentIndex + 1];
      setFontSize(newFontSize);
      localStorage.setItem('typingPracticeFontSize', newFontSize);
    }
  };

  const handleDecreaseFontSize = () => {
    const currentIndex = fontSizeOrder.indexOf(fontSize);
    if (currentIndex > 0) {
      const newFontSize = fontSizeOrder[currentIndex - 1];
      setFontSize(newFontSize);
      localStorage.setItem('typingPracticeFontSize', newFontSize);
    }
  };

  const canIncreaseFontSize = fontSizeOrder.indexOf(fontSize) < fontSizeOrder.length - 1;
  const canDecreaseFontSize = fontSizeOrder.indexOf(fontSize) > 0;

  return (
    <div
      ref={containerRef}
      role="textbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="outline-none rounded-lg p-8 cursor-text bg-gray-50 transition-colors min-h-[60vh]"
      aria-label="practice area - click here and start typing"
    >
      <div className="flex justify-end mb-4">
        <FontSizeControl 
          onIncrease={handleIncreaseFontSize} 
          onDecrease={handleDecreaseFontSize} 
          canIncrease={canIncreaseFontSize} 
          canDecrease={canDecreaseFontSize}
        />
      </div>
      <div
        className={`flex flex-wrap gap-1 ${fontSizeClasses[fontSize]} font-mono select-none leading-relaxed mb-8`}
        aria-label="practice prompt"
        role="presentation"
      >
        {characters.map((charData, idx) => (
          <CharacterDisplay
            key={idx}
            char={charData.char}
            state={charData.state}
            index={idx}
            onClick={handleCharacterClick}
            showCursor={idx === cursorPosition && cursorPosition < prompt.length}
          />
        ))}
      </div>
      <ProgressDisplay
        typedCount={getTypedCharacters().length}
        totalCount={prompt.length}
        correctCount={getCorrectCharacters().length}
      />
    </div>
  );
};

export default TypingArea;
