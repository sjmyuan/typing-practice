import React, { useState, useRef, useEffect } from 'react';
import CharacterDisplay from './CharacterDisplay';
import PinyinCharacterDisplay from './PinyinCharacterDisplay';
import ProgressDisplay from './ProgressDisplay';
import FontSizeControl from './FontSizeControl';
import { getPinyinWithoutTonesForChar, normalizePinyinInput, containsChinese, isChineseCharacterOrPunctuation, getEnglishPunctuationForChinese, isPinyinPracticeText } from '../utils/pinyinUtils';
import { type PracticeMode } from './StartScreen';

// Character state types
type CharacterState = 'untyped' | 'correct' | 'incorrect' | 'skipped';

// Font size types
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface CharacterData {
  char: string;
  state: CharacterState;
  typedChar?: string;
  pinyinInput?: string; // For collecting pinyin input
  expectedPinyin?: string; // Expected pinyin for the character
  pinyinState?: 'neutral' | 'correct' | 'incorrect'; // State of pinyin typing
}

interface TypingAreaProps {
  prompt: string;
  practiceMode?: PracticeMode;
  onComplete: (stats: {
    accuracy: number;
    totalCharacters: number;
    correctCharacters: number;
    incorrectCharacters: number;
  }) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ prompt, practiceMode, onComplete }) => {
  // Auto-detect practice mode based on prompt content
  const detectedPracticeMode: PracticeMode = practiceMode || (isPinyinPracticeText(prompt) ? 'pinyin' : 'english');
  
  const [cursorPosition, setCursorPosition] = useState(0);
  const [characters, setCharacters] = useState<CharacterData[]>(() => 
    prompt.split('').map(char => ({
      char,
      state: 'untyped' as CharacterState,
      expectedPinyin: detectedPracticeMode === 'pinyin' && containsChinese(char) ? getPinyinWithoutTonesForChar(char) : undefined,
      pinyinInput: ''
    }))
  );
  const [currentPinyinInput, setCurrentPinyinInput] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
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
    } else if (e.key === ' ' && detectedPracticeMode !== 'pinyin') {
      // Space key only for non-pinyin modes
      handleCharacterInput(' ');
    } else if (e.key.length === 1 && cursorPosition < prompt.length) {
      // Only accept single character keys and don't exceed prompt length
      if (detectedPracticeMode === 'pinyin') {
        // In pinyin mode, check if current character is Chinese or Chinese punctuation
        const currentChar = prompt[cursorPosition];
        if (isChineseCharacterOrPunctuation(currentChar)) {
          if (containsChinese(currentChar)) {
            // Handle Chinese characters with pinyin input
            handlePinyinInput(e.key);
          } else {
            // Handle Chinese punctuation - expect English equivalent
            handleCharacterInput(e.key);
          }
        } else {
          // For non-Chinese characters (punctuation, English, etc.), handle directly
          handleCharacterInput(e.key);
        }
      } else {
        handleCharacterInput(e.key);
      }
    }
  };

  // Handle pinyin input collection
  const handlePinyinInput = (inputChar: string) => {
    const newInput = currentPinyinInput + inputChar.toLowerCase();
    setCurrentPinyinInput(newInput);
    
    // Determine real-time pinyin state
    const expectedPinyin = characters[cursorPosition]?.expectedPinyin || '';
    let pinyinState: 'neutral' | 'correct' | 'incorrect' = 'neutral';
    
    if (newInput.length > 0 && expectedPinyin.length > 0) {
      const normalizedInput = normalizePinyinInput(newInput);
      const normalizedExpected = expectedPinyin;
      
      if (normalizedExpected.startsWith(normalizedInput)) {
        pinyinState = 'correct';
      } else {
        pinyinState = 'incorrect';
      }
    }
    
    // Update the current character's pinyin input display
    setCharacters(prev => {
      const newCharacters = [...prev];
      if (cursorPosition < newCharacters.length) {
        newCharacters[cursorPosition] = {
          ...newCharacters[cursorPosition],
          pinyinInput: newInput,
          pinyinState: pinyinState
        };
      }
      return newCharacters;
    });
    
    // Check if we've typed enough characters to match the expected pinyin length
    if (newInput.length === expectedPinyin.length && expectedPinyin.length > 0) {
      // Automatically validate and move to next character
      validatePinyinInputWithValue(newInput);
    }
  };

  // Validate pinyin input with a specific value
  const validatePinyinInputWithValue = (inputValue: string) => {
    if (cursorPosition >= prompt.length || isCompleted) return;
    
    const expectedPinyin = characters[cursorPosition]?.expectedPinyin || '';
    const normalizedInput = normalizePinyinInput(inputValue);
    const isCorrect = normalizedInput === expectedPinyin;
    
    // Move to next character and reset pinyin input first
    const newPosition = cursorPosition + 1;
    setCursorPosition(newPosition);
    setCurrentPinyinInput('');
    
    setCharacters(prev => {
      const newCharacters = [...prev];
      newCharacters[cursorPosition] = {
        ...newCharacters[cursorPosition],
        state: isCorrect ? 'correct' : 'incorrect',
        typedChar: inputValue,
        pinyinInput: inputValue,
        pinyinState: 'neutral' // Reset pinyin state after completion
      };
      
      // Check for completion after updating the character
      if (newPosition === prompt.length && !isCompleted) {
        setIsCompleted(true);
        
        // Calculate stats with the updated characters
        const typedCharacters = newCharacters.filter(char => char.state === 'correct' || char.state === 'incorrect');
        const correctCharacters = newCharacters.filter(char => char.state === 'correct');
        const incorrectCharacters = newCharacters.filter(char => char.state === 'incorrect');
        
        const stats = {
          accuracy: Math.round((correctCharacters.length / typedCharacters.length) * 100),
          totalCharacters: prompt.length,
          correctCharacters: correctCharacters.length,
          incorrectCharacters: incorrectCharacters.length
        };

        // Call onComplete synchronously
        if (typeof onComplete === 'function') {
          setTimeout(() => onComplete(stats), 0);
        }
      }
      
      return newCharacters;
    });
  };

  // Handle character input
  const handleCharacterInput = (inputChar: string) => {
    if (isCompleted) return;
    
    const newPosition = Math.min(cursorPosition + 1, prompt.length);
    
    setCharacters(prev => {
      const newCharacters = [...prev];
      const expectedChar = prompt[cursorPosition];
      
      let isCorrect = false;
      
      if (detectedPracticeMode === 'pinyin') {
        if (containsChinese(expectedChar)) {
          // For Chinese characters, compare normalized pinyin
          const expectedPinyin = getPinyinWithoutTonesForChar(expectedChar);
          const normalizedInput = normalizePinyinInput(inputChar);
          isCorrect = normalizedInput === expectedPinyin;
        } else if (isChineseCharacterOrPunctuation(expectedChar)) {
          // For Chinese punctuation, compare with English equivalent
          const expectedEnglish = getEnglishPunctuationForChinese(expectedChar);
          isCorrect = inputChar === expectedEnglish;
        } else {
          // For other characters, direct comparison
          isCorrect = inputChar === expectedChar;
        }
      } else {
        // For English mode, direct character comparison
        isCorrect = inputChar === expectedChar;
      }
      
      newCharacters[cursorPosition] = {
        char: expectedChar,
        state: isCorrect ? 'correct' : 'incorrect',
        typedChar: inputChar
      };
      
      // Check for completion with updated characters
      if (newPosition === prompt.length && !isCompleted) {
        setIsCompleted(true);
        
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
    if (detectedPracticeMode === 'pinyin' && cursorPosition < prompt.length) {
      const currentChar = prompt[cursorPosition];
      // Only handle pinyin input backspace for Chinese characters (not Chinese punctuation)
      if (containsChinese(currentChar) && currentPinyinInput.length > 0) {
        // Remove last character from current pinyin input
        const newInput = currentPinyinInput.slice(0, -1);
        setCurrentPinyinInput(newInput);
        
        // Determine real-time pinyin state
        const expectedPinyin = characters[cursorPosition]?.expectedPinyin || '';
        let pinyinState: 'neutral' | 'correct' | 'incorrect' = 'neutral';
        
        if (newInput.length > 0 && expectedPinyin.length > 0) {
          const normalizedInput = normalizePinyinInput(newInput);
          const normalizedExpected = expectedPinyin;
          
          if (normalizedExpected.startsWith(normalizedInput)) {
            pinyinState = 'correct';
          } else {
            pinyinState = 'incorrect';
          }
        }
        
        setCharacters(prev => {
          const newCharacters = [...prev];
          if (cursorPosition < newCharacters.length) {
            newCharacters[cursorPosition] = {
              ...newCharacters[cursorPosition],
              pinyinInput: newInput,
              pinyinState: pinyinState
            };
          }
          return newCharacters;
        });
        return; // Don't proceed to regular backspace logic
      }
    }
    
    // Regular backspace logic for moving cursor back
    if (cursorPosition > 0) {
      // Move cursor back and reset characters
      const newPosition = cursorPosition - 1;
      setCursorPosition(newPosition);
      setCurrentPinyinInput('');
      
      setCharacters(prev => {
        const newCharacters = [...prev];
        // Reset character state to untyped and clear all characters after cursor
        for (let i = newPosition; i < newCharacters.length; i++) {
          newCharacters[i] = {
            ...newCharacters[i],
            state: 'untyped',
            pinyinInput: '',
            pinyinState: 'neutral'
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
              ...newCharacters[i],
              state: 'skipped'
            };
          }
        }
      } else if (index < cursorPosition) {
        // Moving backward - reset characters after clicked position to untyped
        for (let i = index; i < newCharacters.length; i++) {
          newCharacters[i] = {
            ...newCharacters[i],
            state: 'untyped',
            pinyinInput: ''
          };
        }
      }
      
      return newCharacters;
    });
    
    setCursorPosition(index);
    setCurrentPinyinInput('');
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
      
      {/* Instructions for pinyin mode */}
      {detectedPracticeMode === 'pinyin' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Pinyin Practice Mode:</strong> Type the pinyin for each Chinese character. The cursor will automatically move to the next character when you've typed the correct number of characters. Tones are not required.
          </p>
        </div>
      )}
      
      <div
        className={`flex flex-wrap gap-1 ${fontSizeClasses[fontSize]} font-mono select-none leading-relaxed mb-8`}
        aria-label="practice prompt"
        role="presentation"
      >
        {characters.map((charData, idx) => {
          // Determine whether to use pinyin display based on character type and practice mode
          const shouldUsePinyinDisplay = detectedPracticeMode === 'pinyin' && isChineseCharacterOrPunctuation(charData.char);
          
          return shouldUsePinyinDisplay ? (
            <PinyinCharacterDisplay
              key={idx}
              char={charData.char}
              state={charData.state}
              index={idx}
              onClick={handleCharacterClick}
              showCursor={idx === cursorPosition && cursorPosition < prompt.length}
              showPinyin={true}
              pinyinInput={charData.pinyinInput || ''}
              pinyinState={charData.pinyinState || 'neutral'}
            />
          ) : (
            <CharacterDisplay
              key={idx}
              char={charData.char}
              state={charData.state}
              index={idx}
              onClick={handleCharacterClick}
              showCursor={idx === cursorPosition && cursorPosition < prompt.length}
            />
          );
        })}
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
