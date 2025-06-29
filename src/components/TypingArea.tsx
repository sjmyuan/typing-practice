import React, { useState, useRef, useEffect, useCallback } from 'react';
import CharacterDisplay from './CharacterDisplay';
import PinyinCharacterDisplay from './PinyinCharacterDisplay';
import ProgressDisplay from './ProgressDisplay';
import FontSizeControl from './FontSizeControl';
import CharacterAlignmentControl, { type CharacterAlignment } from './CharacterAlignmentControl';
import { getPinyinWithoutTonesForChar, normalizePinyinInput, containsChinese, isChineseCharacterOrPunctuation, getEnglishPunctuationForChinese, isPinyinPracticeText, containsChinesePunctuation } from '../utils/pinyinUtils';
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
  const [characterAlignment, setCharacterAlignment] = useState<CharacterAlignment>(() => {
    const saved = localStorage.getItem('typingPracticeCharacterAlignment');
    if (saved && ['left', 'center', 'right', 'justify'].includes(saved)) {
      return saved as CharacterAlignment;
    }
    return 'left';
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRefs = useRef<(HTMLElement | null)[]>([]);

  // Initialize character refs array
  useEffect(() => {
    characterRefs.current = new Array(prompt.length).fill(null);
  }, [prompt.length]);

  // Check if current character needs scrolling (visibility check - vertical only)
  const isCharacterNearViewportEdge = useCallback(() => {
    if (cursorPosition >= characterRefs.current.length || !containerRef.current) {
      return false;
    }

    const currentCharElement = characterRefs.current[cursorPosition];
    if (!currentCharElement) {
      return false;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const charRect = currentCharElement.getBoundingClientRect();
    
    // Define buffer zone only for bottom edge (20% of container height)
    const verticalBuffer = containerRect.height * 0.2;
    
    // Check if character is not visible at top (no buffer) or approaching bottom edge (with buffer)
    const isNotVisibleAtTop = charRect.top < containerRect.top;
    const isNearBottomEdge = charRect.bottom > containerRect.bottom - verticalBuffer;
    
    return isNotVisibleAtTop || isNearBottomEdge;
  }, [cursorPosition]);

  // Smart scroll function that only scrolls when necessary
  const scrollToCurrentCharacterIfNeeded = useCallback(() => {
    if (cursorPosition >= characterRefs.current.length) {
      return;
    }

    const currentCharElement = characterRefs.current[cursorPosition];
    if (!currentCharElement || typeof currentCharElement.scrollIntoView !== 'function') {
      return;
    }

    // Only scroll if character is near viewport edge (vertical only)
    if (isCharacterNearViewportEdge()) {
      currentCharElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start' // Use 'start' instead of 'nearest' for consistent horizontal positioning
      });
    }
  }, [cursorPosition, isCharacterNearViewportEdge]);

  // Scroll to current character when cursor position changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    const animFrameId = requestAnimationFrame(() => {
      scrollToCurrentCharacterIfNeeded();
    });

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [cursorPosition, scrollToCurrentCharacterIfNeeded]);

  // Scroll to current character when font size changes (always scroll on font change)
  useEffect(() => {
    // Use requestAnimationFrame to ensure font size changes are rendered
    const animFrameId = requestAnimationFrame(() => {
      if (cursorPosition < characterRefs.current.length) {
        const currentCharElement = characterRefs.current[cursorPosition];
        if (currentCharElement && typeof currentCharElement.scrollIntoView === 'function') {
          currentCharElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start' // Use 'start' instead of 'nearest' for consistent horizontal positioning
          });
        }
      }
    });

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [fontSize, cursorPosition]);

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
    } else if (e.key === 'Enter' && cursorPosition < prompt.length && prompt[cursorPosition] === '\n') {
      // Handle Enter key for newline characters
      handleCharacterInput('\n');
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

  // Character width classes that scale with font size for consistent alignment
  // Widths are designed to accommodate longest pinyin (up to 7 characters like "chuang", "shuang")
  const characterWidthClasses = {
    small: 'w-16',         // 64px width for text-xl - fits ~7 chars
    medium: 'w-24',        // 96px width for text-3xl - fits ~7 chars  
    large: 'w-44',         // 176px width for text-5xl - fits ~7 chars
    'extra-large': 'w-56'  // 224px width for text-7xl - fits ~7 chars
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

  const handleCharacterAlignmentChange = (alignment: CharacterAlignment) => {
    setCharacterAlignment(alignment);
    localStorage.setItem('typingPracticeCharacterAlignment', alignment);
  };

  // Word grouping interface
  interface WordGroup {
    characters: CharacterData[];
    startIndex: number;
    endIndex: number;
  }

  // Helper functions for character classification
  const isPunctuation = (char: string): boolean => {
    if (containsChinesePunctuation(char)) {
      return true;
    }
    const englishPunctuation = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
    return englishPunctuation.test(char);
  };

  const isChinesePunctuation = (char: string): boolean => {
    return isChineseCharacterOrPunctuation(char) && !containsChinese(char);
  };

  const isWordBreaker = (char: string): boolean => {
    return char === ' ';
  };

  // Group characters into words for better justify alignment
  const groupCharactersIntoWords = (characters: CharacterData[]): WordGroup[] => {
    const words: WordGroup[] = [];
    let currentWord: CharacterData[] = [];
    let wordStartIndex = 0;

    const finalizeCurrentWord = (endIndex: number) => {
      if (currentWord.length > 0) {
        words.push({
          characters: [...currentWord],
          startIndex: wordStartIndex,
          endIndex
        });
        currentWord = [];
      }
    };

    const startNewWord = (startIndex: number) => {
      wordStartIndex = startIndex;
    };

    const addSingleCharacterWord = (charData: CharacterData, index: number) => {
      words.push({
        characters: [charData],
        startIndex: index,
        endIndex: index
      });
    };

    const addCharacterToCurrentWord = (charData: CharacterData, index: number) => {
      if (currentWord.length === 0) {
        startNewWord(index);
      }
      currentWord.push(charData);
    };

    characters.forEach((charData, index) => {
      const char = charData.char;

      // Handle spaces as separate word groups
      if (isWordBreaker(char)) {
        finalizeCurrentWord(index - 1);
        addSingleCharacterWord(charData, index);
        startNewWord(index + 1);
        return;
      }

      // Handle Chinese characters - each forms its own group, potentially with following Chinese punctuation or line breaks
      if (containsChinese(char)) {
        finalizeCurrentWord(index - 1);
        addCharacterToCurrentWord(charData, index);

        // Check if next character is Chinese punctuation or line break that should be grouped with this character
        const nextIndex = index + 1;
        const nextChar = nextIndex < characters.length ? characters[nextIndex] : null;
        
        if (!nextChar || (!isChinesePunctuation(nextChar.char) && nextChar.char !== '\n')) {
          // No Chinese punctuation or line break follows, complete this Chinese character group
          finalizeCurrentWord(index);
          startNewWord(nextIndex);
        }
        // If Chinese punctuation or line break follows, let it be handled in the next iteration
        return;
      }

      // Handle line breaks - group with preceding word (especially Chinese characters)
      if (char === '\n') {
        if (currentWord.length > 0) {
          // Add to current word and finalize
          addCharacterToCurrentWord(charData, index);
          finalizeCurrentWord(index);
          startNewWord(index + 1);
        } else {
          // Standalone line break - treat as its own group
          addSingleCharacterWord(charData, index);
          startNewWord(index + 1);
        }
        return;
      }

      // Handle punctuation
      if (isPunctuation(char)) {
        if (isChinesePunctuation(char) && currentWord.length > 0) {
          // Chinese punctuation following a Chinese character - add to current word and finalize
          addCharacterToCurrentWord(charData, index);
          finalizeCurrentWord(index);
          startNewWord(index + 1);
        } else if (currentWord.length > 0) {
          // English punctuation - add to current English word
          addCharacterToCurrentWord(charData, index);
        } else {
          // Standalone punctuation - treat as its own group
          addSingleCharacterWord(charData, index);
          startNewWord(index + 1);
        }
        return;
      }

      // Handle regular characters (English letters, digits, etc.)
      addCharacterToCurrentWord(charData, index);
    });

    // Finalize any remaining word
    finalizeCurrentWord(characters.length - 1);

    return words;
  };

  // Character alignment classes - updated for word-based alignment
  const characterAlignmentClasses = {
    left: 'flex flex-wrap justify-start',
    center: 'flex flex-wrap justify-center',
    right: 'flex flex-wrap justify-end',
    justify: 'flex flex-wrap justify-between'
  };

  return (
    <div
      ref={containerRef}
      role="textbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="outline-none rounded-lg p-8 cursor-text bg-gray-50 transition-colors"
      aria-label="practice area - click here and start typing"
    >
      <div className="flex justify-end gap-4 mb-4">
        <CharacterAlignmentControl 
          currentAlignment={characterAlignment}
          onAlignmentChange={handleCharacterAlignmentChange}
        />
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
        className={`${fontSizeClasses[fontSize]} ${characterAlignmentClasses[characterAlignment]} font-mono select-none leading-relaxed mb-8`}
        aria-label="practice prompt"
        role="presentation"
      >
        {groupCharactersIntoWords(characters).map((wordGroup, wordIndex) => {
          // Check if this word group contains only a space (standalone space)
          const isStandaloneSpace = wordGroup.characters.length === 1 && wordGroup.characters[0].char === ' ';
          
          if (isStandaloneSpace) {
            // Render standalone space
            const charData = wordGroup.characters[0];
            const idx = wordGroup.startIndex;
            
            return (
              <CharacterDisplay
                key={`word-${wordIndex}`}
                char={charData.char}
                state={charData.state}
                index={idx}
                onClick={handleCharacterClick}
                showCursor={idx === cursorPosition && cursorPosition < prompt.length}
                ref={el => { characterRefs.current[idx] = el; }}
              />
            );
          }
          
          // Check if this word group contains a line break
          const hasLineBreak = wordGroup.characters.some(char => char.char === '\n');
          
          // Render word group as a unit
          const wordElement = (
            <div key={`word-${wordIndex}`} className="inline-flex">
              {wordGroup.characters.map((charData, charIndex) => {
                const idx = wordGroup.startIndex + charIndex;
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
                    characterWidth={characterWidthClasses[fontSize]}
                    ref={el => { characterRefs.current[idx] = el; }}
                  />
                ) : (
                  <CharacterDisplay
                    key={idx}
                    char={charData.char}
                    state={charData.state}
                    index={idx}
                    onClick={handleCharacterClick}
                    showCursor={idx === cursorPosition && cursorPosition < prompt.length}
                    ref={el => { characterRefs.current[idx] = el; }}
                  />
                );
              })}
            </div>
          );
          
          // If the word group contains a line break, add a line break after it
          if (hasLineBreak) {
            return (
              <React.Fragment key={`word-${wordIndex}`}>
                {wordElement}
                <div className="w-full" role="separator" aria-hidden="true" />
              </React.Fragment>
            );
          }
          
          return wordElement;
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
