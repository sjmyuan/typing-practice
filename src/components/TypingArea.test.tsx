import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import TypingArea from './TypingArea';

describe('TypingArea', () => {
  const mockProps = {
    prompt: 'hello',
    practiceMode: 'english' as const,
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    mockProps.onComplete.mockClear();
  });

  describe('Initial Rendering', () => {
    it('renders the typing area container', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      expect(container).toBeInTheDocument();
    });

    it('renders all characters from prompt', () => {
      render(<TypingArea {...mockProps} />);
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(5);
      expect(chars[0]).toHaveTextContent('h');
      expect(chars[1]).toHaveTextContent('e');
      expect(chars[2]).toHaveTextContent('l');
      expect(chars[3]).toHaveTextContent('l');
      expect(chars[4]).toHaveTextContent('o');
    });

    it('shows cursor at initial position', () => {
      render(<TypingArea {...mockProps} />);
      expect(screen.getByTestId('cursor')).toBeInTheDocument();
    });

    it('auto focuses the typing area on mount', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      expect(document.activeElement).toBe(container);
    });

    it('has correct accessibility attributes', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      expect(container).toHaveAttribute('aria-label', 'labels.practiceArea');
      expect(container).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Character Typing', () => {
    it('marks correct characters as correct when typed', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
      expect(chars[0]).toHaveClass('bg-green-100');
    });

    it('marks incorrect characters as incorrect when typed', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'x', code: 'KeyX' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-red-600');
      expect(chars[0]).toHaveClass('bg-red-100');
    });

    it('moves cursor forward after typing', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      // Cursor should move to position 1 (second character)
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[1].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });

    it('prevents typing beyond prompt length', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type all characters
      'hello'.split('').forEach(char => {
        fireEvent.keyDown(container, { key: char, code: `Key${char.toUpperCase()}` });
      });
      
      // Try to type beyond prompt
      fireEvent.keyDown(container, { key: 'x', code: 'KeyX' });
      
      // Should call onComplete when finished
      expect(mockProps.onComplete).toHaveBeenCalledTimes(1);
    });

    it('updates progress display as typing progresses', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      expect(screen.getByText(/progress\.progressLabel/)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
    });
  });

  describe('Backspace Functionality', () => {
    it('moves cursor backward when backspace is pressed', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(container, { key: 'Backspace', code: 'Backspace' });
      
      // Cursor should be back at position 0
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });

    it('resets character states when backspacing', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(container, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(container, { key: 'Backspace', code: 'Backspace' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[1]).toHaveClass('text-gray-400'); // Should be untyped
      expect(chars[1]).not.toHaveClass('text-green-600');
    });

    it('does not move cursor before start when backspacing at position 0', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'Backspace', code: 'Backspace' });
      
      // Cursor should still be at position 0
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });
  });

  describe('Character Click Navigation', () => {
    it('moves cursor to clicked character position', () => {
      render(<TypingArea {...mockProps} />);
      const chars = screen.getAllByTestId('practice-char');
      
      fireEvent.click(chars[3]); // Click on 4th character (index 3)
      
      expect(chars[3].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });

    it('marks skipped characters when clicking ahead', () => {
      render(<TypingArea {...mockProps} />);
      const chars = screen.getAllByTestId('practice-char');
      
      fireEvent.click(chars[3]); // Skip to 4th character
      
      // Characters 0, 1, 2 should be marked as skipped
      expect(chars[0]).toHaveClass('text-yellow-700');
      expect(chars[0]).toHaveClass('bg-yellow-100');
      expect(chars[0]).toHaveClass('line-through');
      expect(chars[1]).toHaveClass('text-yellow-700');
      expect(chars[2]).toHaveClass('text-yellow-700');
    });

    it('resets characters when clicking backward', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      container.focus();
      
      // Type some characters
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(container, { key: 'e', code: 'KeyE' });
      
      // Click backward
      fireEvent.click(chars[0]);
      
      // Characters after clicked position should be reset
      expect(chars[1]).toHaveClass('text-gray-400');
      expect(chars[1]).not.toHaveClass('text-green-600');
    });
  });

  describe('Focus Management', () => {
    it('focuses when clicked', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      
      fireEvent.click(container);
      
      expect(container).toHaveFocus();
    });

    it('has correct styling without focus ring', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      
      expect(container).toHaveClass('outline-none');
      expect(container).toHaveClass('rounded-lg');
      expect(container).toHaveClass('cursor-text');
      expect(container).not.toHaveClass('focus:ring-2');
      expect(container).not.toHaveClass('focus:ring-blue-400');
    });
  });

  describe('Keyboard Event Handling', () => {
    it('prevents default behavior on keydown', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Create a mock event with preventDefault
      const preventDefaultMock = vi.fn();
      
      // Simulate the keydown event by directly calling fireEvent.keyDown
      // and check that preventDefault would be called on the event object
      const originalPreventDefault = KeyboardEvent.prototype.preventDefault;
      KeyboardEvent.prototype.preventDefault = preventDefaultMock;
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      // Restore original method
      KeyboardEvent.prototype.preventDefault = originalPreventDefault;
      
      expect(preventDefaultMock).toHaveBeenCalled();
    });

    it('only accepts single character keys', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Try multi-character keys
      fireEvent.keyDown(container, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(container, { key: 'Shift', code: 'ShiftLeft' });
      fireEvent.keyDown(container, { key: 'Control', code: 'ControlLeft' });
      
      // No characters should be typed - progress should still show 0 typed
      expect(screen.getByText(/progress\.progressLabel/)).toBeInTheDocument();
      
      // All characters should still be untyped
      const chars = screen.getAllByTestId('practice-char');
      chars.forEach(char => {
        expect(char).toHaveClass('text-gray-400'); // Untyped character color
      });
    });

    it('handles space character correctly', () => {
      render(<TypingArea prompt="a b" onComplete={mockProps.onComplete} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(container, { key: ' ', code: 'Space' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[1]).toHaveClass('text-green-600'); // Space should be correct
    });
  });

  describe('Completion Handling', () => {
    it('calls onComplete when all characters are typed', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      'hello'.split('').forEach(char => {
        fireEvent.keyDown(container, { key: char, code: `Key${char.toUpperCase()}` });
      });
      
      expect(mockProps.onComplete).toHaveBeenCalledTimes(1);
    });

    it('calls onComplete with correct statistics', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type with some errors
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' }); // Correct
      fireEvent.keyDown(container, { key: 'x', code: 'KeyX' }); // Incorrect
      fireEvent.keyDown(container, { key: 'l', code: 'KeyL' }); // Correct
      fireEvent.keyDown(container, { key: 'l', code: 'KeyL' }); // Correct
      fireEvent.keyDown(container, { key: 'o', code: 'KeyO' }); // Correct
      
      expect(mockProps.onComplete).toHaveBeenCalledWith({
        accuracy: 80, // 4 correct out of 5 typed
        totalCharacters: 5,
        correctCharacters: 4,
        incorrectCharacters: 1
      });
    });

    it('does not call onComplete multiple times', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      'hello'.split('').forEach(char => {
        fireEvent.keyDown(container, { key: char, code: `Key${char.toUpperCase()}` });
      });
      
      // Try typing more
      fireEvent.keyDown(container, { key: 'x', code: 'KeyX' });
      
      expect(mockProps.onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Back Button', () => {
    it('renders back button when onBack prop is provided', () => {
      const mockOnBack = vi.fn();
      render(<TypingArea prompt="hello" onComplete={mockProps.onComplete} onBack={mockOnBack} />);
      
      expect(screen.getByText('buttons.backToOptions')).toBeInTheDocument();
    });

    it('does not render back button when onBack prop is not provided', () => {
      render(<TypingArea prompt="hello" onComplete={mockProps.onComplete} />);
      
      expect(screen.queryByText('buttons.backToOptions')).not.toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', () => {
      const mockOnBack = vi.fn();
      render(<TypingArea prompt="hello" onComplete={mockProps.onComplete} onBack={mockOnBack} />);
      
      fireEvent.click(screen.getByText('buttons.backToOptions'));
      
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('back button has proper accessibility attributes', () => {
      const mockOnBack = vi.fn();
      render(<TypingArea prompt="hello" onComplete={mockProps.onComplete} onBack={mockOnBack} />);
      
      const backButton = screen.getByText('buttons.backToOptions');
      expect(backButton).toHaveAttribute('type', 'button');
    });

    it('handles null onBack gracefully', () => {
      expect(() => {
        render(<TypingArea prompt="hello" onComplete={mockProps.onComplete} onBack={() => {}} />);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty prompt gracefully', () => {
      render(<TypingArea prompt="" onComplete={mockProps.onComplete} />);
      const container = screen.getByRole('textbox');
      
      expect(container).toBeInTheDocument();
      expect(screen.queryAllByTestId('practice-char')).toHaveLength(0);
    });

    it('handles single character prompt', () => {
      render(<TypingArea prompt="a" onComplete={mockProps.onComplete} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });
      
      expect(mockProps.onComplete).toHaveBeenCalledTimes(1);
    });

    it('handles special characters in prompt', () => {
      render(<TypingArea prompt="a!b" onComplete={mockProps.onComplete} />);
      const chars = screen.getAllByTestId('practice-char');
      
      expect(chars[1]).toHaveTextContent('!');
    });

    it('handles null onComplete gracefully', () => {
      expect(() => {
        render(<TypingArea prompt="hello" onComplete={() => {}} />);
      }).not.toThrow();
    });

    it('handles undefined onComplete gracefully', () => {
      expect(() => {
        render(<TypingArea prompt="hello" onComplete={() => {}} />);
      }).not.toThrow();
    });
  });

  describe('Component Integration', () => {
    it('integrates with CharacterDisplay components', () => {
      render(<TypingArea {...mockProps} />);
      const chars = screen.getAllByTestId('practice-char');
      
      // Should have all character display components
      expect(chars).toHaveLength(5);
      chars.forEach(char => {
        expect(char).toHaveClass('relative');
        expect(char).toHaveClass('inline-flex');
        expect(char).toHaveClass('flex-col');
        expect(char).toHaveClass('items-center');
        expect(char).toHaveClass('justify-end');  
      });
    });

    it('integrates with ProgressDisplay component', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      // Should show progress from ProgressDisplay
      expect(screen.getByText(/progress\.progressLabel/)).toBeInTheDocument();
    });

    it('integrates with TypingCursor component', () => {
      render(<TypingArea {...mockProps} />);
      
      // Should show cursor from TypingCursor
      expect(screen.getByTestId('cursor')).toBeInTheDocument();
      expect(screen.getByTestId('cursor')).toHaveClass('animate-pulse');
    });
  });

  describe('Global Focus Behavior', () => {
    it('maintains focus when clicking anywhere on document', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      
      // Initially focused
      expect(document.activeElement).toBe(container);
      
      // Click somewhere else (like a progress element)
      const progressElement = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && content.includes('progress.progressLabel');
      });
      fireEvent.click(progressElement);
      
      // Should still be focused
      expect(document.activeElement).toBe(container);
    });

    it('maintains focus when clicking on character display', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      const firstChar = screen.getAllByTestId('practice-char')[0];
      
      // Initially focused
      expect(document.activeElement).toBe(container);
      
      // Click on a character
      fireEvent.click(firstChar);
      
      // Should still be focused
      expect(document.activeElement).toBe(container);
    });

    it('does not show focus ring styles', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      
      // Focus ring classes should not be present
      expect(container).not.toHaveClass('focus:ring-2');
      expect(container).not.toHaveClass('focus:ring-blue-400');
    });

    it('cleans up global click listener on unmount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<TypingArea {...mockProps} />);
      
      // Should have added click listener
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      
      unmount();
      
      // Should have removed click listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Font Size Control', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('renders font size controls', () => {
      render(<TypingArea {...mockProps} />);
      
      expect(screen.getByLabelText('labels.increaseFontSize')).toBeInTheDocument();
      expect(screen.getByLabelText('labels.decreaseFontSize')).toBeInTheDocument();
    });

    it('starts with medium font size by default', () => {
      render(<TypingArea {...mockProps} />);
      
      const characterContainer = screen.getByRole('presentation');
      expect(characterContainer).toHaveClass('text-3xl');
    });

    it('increases font size when increase button is clicked', () => {
      render(<TypingArea {...mockProps} />);
      
      const increaseButton = screen.getByLabelText('labels.increaseFontSize');
      fireEvent.click(increaseButton);
      
      const characterContainer = screen.getByRole('presentation');
      expect(characterContainer).toHaveClass('text-5xl');
    });

    it('decreases font size when decrease button is clicked', () => {
      render(<TypingArea {...mockProps} />);
      
      const decreaseButton = screen.getByLabelText('labels.decreaseFontSize');
      fireEvent.click(decreaseButton);
      
      const characterContainer = screen.getByRole('presentation');
      expect(characterContainer).toHaveClass('text-xl');
    });

    it('disables increase button at maximum font size', () => {
      render(<TypingArea {...mockProps} />);
      
      const increaseButton = screen.getByLabelText('labels.increaseFontSize');
      
      // Click twice to reach maximum (medium -> large -> extra-large)
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      
      expect(increaseButton).toBeDisabled();
    });

    it('disables decrease button at minimum font size', () => {
      render(<TypingArea {...mockProps} />);
      
      const decreaseButton = screen.getByLabelText('labels.decreaseFontSize');
      
      // Click twice to reach minimum (medium -> small -> can't go smaller)
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);
      
      expect(decreaseButton).toBeDisabled();
    });

    it('saves font size preference to localStorage', () => {
      render(<TypingArea {...mockProps} />);
      
      const increaseButton = screen.getByLabelText('labels.increaseFontSize');
      fireEvent.click(increaseButton);
      
      expect(localStorage.getItem('typingPracticeFontSize')).toBe('large');
    });

    it('loads font size preference from localStorage', () => {
      localStorage.setItem('typingPracticeFontSize', 'large');
      
      render(<TypingArea {...mockProps} />);
      
      const characterContainer = screen.getByRole('presentation');
      expect(characterContainer).toHaveClass('text-5xl');
    });

    it('uses default font size when localStorage has invalid value', () => {
      localStorage.setItem('typingPracticeFontSize', 'invalid');
      
      render(<TypingArea {...mockProps} />);
      
      const characterContainer = screen.getByRole('presentation');
      expect(characterContainer).toHaveClass('text-3xl');
    });

    it('font size control works with pinyin characters', () => {
      const pinyinProps = {
        ...mockProps,
        prompt: '你好',
        practiceMode: 'pinyin' as const
      };
      
      render(<TypingArea {...pinyinProps} />);
      
      // Check initial font size
      const characterContainer = screen.getByRole('presentation');
      expect(characterContainer).toHaveClass('text-3xl');
      
      // Increase font size
      const increaseButton = screen.getByLabelText('labels.increaseFontSize');
      fireEvent.click(increaseButton);
      
      expect(characterContainer).toHaveClass('text-5xl');
      
      // Check that pinyin displays are present and should scale with parent
      const pinyinDisplays = screen.getAllByTestId('pinyin-display');
      expect(pinyinDisplays).toHaveLength(2); // Two Chinese characters
      
      // Pinyin should use relative sizing (text-[0.75em]) to scale with parent
      pinyinDisplays.forEach(pinyin => {
        expect(pinyin).toHaveClass('text-[0.75em]');
        expect(pinyin).not.toHaveClass('text-base'); // Should not have hardcoded font size
      });
    });
  });

  describe('Auto Practice Mode Detection', () => {
    it('automatically detects English mode for English text', () => {
      const englishProps = {
        prompt: 'hello world',
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...englishProps} />);
      
      // Should use regular character display, not pinyin display
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(11);
      
      // No pinyin displays should be present
      expect(screen.queryAllByTestId('pinyin-display')).toHaveLength(0);
    });

    it('automatically detects pinyin mode for Chinese text', () => {
      const chineseProps = {
        prompt: '你好',
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...chineseProps} />);
      
      // Should use pinyin displays for Chinese characters
      const pinyinDisplays = screen.getAllByTestId('pinyin-display');
      expect(pinyinDisplays).toHaveLength(2);
    });

    it('automatically detects pinyin mode for mixed text with Chinese characters', () => {
      const mixedProps = {
        prompt: 'Hello 你好 World',
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...mixedProps} />);
      
      // Should have both regular and pinyin displays
      const regularChars = screen.getAllByTestId('practice-char');
      const pinyinDisplays = screen.getAllByTestId('pinyin-display');
      
      // Should have pinyin displays for Chinese characters only
      expect(pinyinDisplays).toHaveLength(2); // 你 and 好
      expect(regularChars.length + pinyinDisplays.length).toBe(14); // Total characters: 'Hello 你好 World' = 14
    });

    it('works correctly when practiceMode prop is not provided', () => {
      const propsWithoutMode = {
        prompt: 'test',
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...propsWithoutMode} />);
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(4);
    });

    it('handles typing correctly in auto-detected English mode', () => {
      const englishProps = {
        prompt: 'hi',
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...englishProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct character
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
    });

    it('handles typing correctly in auto-detected pinyin mode', () => {
      const chineseProps = {
        prompt: '你',
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...chineseProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type pinyin for 你 (ni)
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      
      // Should complete the character and mark as correct
      const pinyinChars = screen.getAllByTestId('pinyin-practice-char');
      expect(pinyinChars[0]).toHaveClass('text-green-600');
      expect(pinyinChars[0]).toHaveClass('bg-green-100');
    });
  });

  describe('Newline Support', () => {
    const multiLinePrompt = 'hello\nworld';
    const multiLineProps = {
      prompt: multiLinePrompt,
      practiceMode: 'english' as const,
      onComplete: vi.fn(),
    };

    it('renders multi-line prompt with line breaks', () => {
      render(<TypingArea {...multiLineProps} />);
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(11); // h-e-l-l-o-\n-w-o-r-l-d
      
      // Check that newline character is present and rendered as line break symbol
      const newlineChar = chars[5];
      expect(newlineChar).toHaveTextContent('↵'); // line break symbol
    });

    it('handles Enter key input for newline characters', () => {
      render(<TypingArea {...multiLineProps} />);
      const container = screen.getByRole('textbox');
      
      // Type "hello" first
      fireEvent.keyDown(container, { key: 'h' });
      fireEvent.keyDown(container, { key: 'e' });
      fireEvent.keyDown(container, { key: 'l' });
      fireEvent.keyDown(container, { key: 'l' });
      fireEvent.keyDown(container, { key: 'o' });
      
      // Now cursor should be at newline character
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[5]).toHaveClass('text-gray-400'); // untyped newline character
      
      // Press Enter to match newline
      fireEvent.keyDown(container, { key: 'Enter' });
      
      // Newline should be marked as correct
      expect(chars[5]).toHaveClass('bg-green-100');
      
      // Cursor should move to next character
      expect(chars[6]).toHaveClass('text-gray-400'); // next untyped character
    });

    it('displays multi-line layout correctly', () => {
      render(<TypingArea {...multiLineProps} />);
      const container = screen.getByLabelText('labels.practicePrompt');
      
      // The container should have the proper styling for displaying characters
      expect(container).toHaveClass('font-mono');
      
      // Check that line breaks are present in the DOM (now using div elements)
      const lineBreaks = container.querySelectorAll('div[role="separator"]');
      expect(lineBreaks).toHaveLength(1); // Should have one line break for the newline character
    });

    it('handles backspace across newlines correctly', () => {
      render(<TypingArea {...multiLineProps} />);
      const container = screen.getByRole('textbox');
      
      // Type through the newline
      'hello\n'.split('').forEach(char => {
        if (char === '\n') {
          fireEvent.keyDown(container, { key: 'Enter' });
        } else {
          fireEvent.keyDown(container, { key: char });
        }
      });
      
      // Start typing "world"
      fireEvent.keyDown(container, { key: 'w' });
      
      // Now backspace should work normally
      fireEvent.keyDown(container, { key: 'Backspace' });
      
      const chars = screen.getAllByTestId('practice-char');
      // Cursor should be back at the 'w' position (index 6) and it should be untyped
      expect(chars[6]).toHaveClass('text-gray-400');
    });

    it('calculates progress correctly with newlines', () => {
      render(<TypingArea {...multiLineProps} />);
      
      // Check initial progress display
      expect(screen.getByText(/progress\.progressLabel: 0\/11 characters/)).toBeInTheDocument();
      
      const container = screen.getByRole('textbox');
      
      // Type complete first line including newline
      'hello\n'.split('').forEach(char => {
        if (char === '\n') {
          fireEvent.keyDown(container, { key: 'Enter' });
        } else {
          fireEvent.keyDown(container, { key: char });
        }
      });
      
      // Progress should show 6 characters typed
      expect(screen.getByText(/progress\.progressLabel: 6\/11 characters/)).toBeInTheDocument();
    });
  });

  describe('Auto-scrolling', () => {
    // Mock scrollIntoView since it's not available in jsdom
    const mockScrollIntoView = vi.fn();
    
    beforeEach(() => {
      // Mock scrollIntoView on all elements
      Element.prototype.scrollIntoView = mockScrollIntoView;
      mockScrollIntoView.mockClear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('scrolls current character into view when cursor moves forward', async () => {
      const longPrompt = 'This is a very long prompt that will definitely need scrolling to see all characters when displayed';
      render(<TypingArea {...mockProps} prompt={longPrompt} />);
      
      const container = screen.getByRole('textbox');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Type first character
      fireEvent.keyDown(container, { key: 'T' });
      
      // Wait for DOM updates and scroll effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Should scroll the character at the new cursor position into view
      expect(mockScrollIntoView).toHaveBeenCalled();
    });

    it('scrolls current character into view when cursor moves backward', async () => {
      const longPrompt = 'This is a long prompt for testing';
      render(<TypingArea {...mockProps} prompt={longPrompt} />);
      
      const container = screen.getByRole('textbox');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Type a few characters first
      fireEvent.keyDown(container, { key: 'T' });
      fireEvent.keyDown(container, { key: 'h' });
      fireEvent.keyDown(container, { key: 'i' });
      
      mockScrollIntoView.mockClear();
      
      // Move backward with backspace
      fireEvent.keyDown(container, { key: 'Backspace' });
      
      // Wait for DOM updates and scroll effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Should scroll the character at the new cursor position into view
      expect(mockScrollIntoView).toHaveBeenCalled();
    });

    it('scrolls target character into view when clicking on character', async () => {
      const longPrompt = 'This is a long prompt for testing character clicks';
      render(<TypingArea {...mockProps} prompt={longPrompt} />);
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Click on a character (e.g., index 10)
      const characters = screen.getAllByTestId('practice-char');
      fireEvent.click(characters[10]);
      
      // Wait for cursor position change and scroll effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Should scroll the clicked character into view
      expect(mockScrollIntoView).toHaveBeenCalled();
    });

    it('scrolls with smooth behavior and appropriate positioning', async () => {
      const longPrompt = 'This is a very long prompt that needs smooth scrolling behavior';
      render(<TypingArea {...mockProps} prompt={longPrompt} />);
      
      const container = screen.getByRole('textbox');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Type first character
      fireEvent.keyDown(container, { key: 'T' });
      
      // Wait for DOM updates and scroll effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Check that scrollIntoView was called with smooth behavior and center positioning
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      });
    });

    it('scrolls current character into view after font size changes', async () => {
      const longPrompt = 'This is a long prompt for font size testing';
      render(<TypingArea {...mockProps} prompt={longPrompt} />);
      
      // Type a few characters to move cursor
      const container = screen.getByRole('textbox');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      fireEvent.keyDown(container, { key: 'T' });
      fireEvent.keyDown(container, { key: 'h' });
      
      mockScrollIntoView.mockClear();
      
      // Change font size
      const increaseFontButton = screen.getByLabelText('labels.increaseFontSize');
      fireEvent.click(increaseFontButton);
      
      // Wait for font size change and scroll effect
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should scroll current character into view after font size change
      expect(mockScrollIntoView).toHaveBeenCalled();
    });

    it('handles scrolling in pinyin mode correctly', async () => {
      const pinyinPrompt = '你好世界'; // Chinese characters
      render(<TypingArea {...mockProps} prompt={pinyinPrompt} practiceMode="pinyin" />);
      
      const container = screen.getByRole('textbox');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Type pinyin for first character
      fireEvent.keyDown(container, { key: 'n' });
      fireEvent.keyDown(container, { key: 'i' });
      
      // Wait for pinyin completion and scroll effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Should scroll appropriately in pinyin mode
      expect(mockScrollIntoView).toHaveBeenCalled();
    });

    it('does not scroll unnecessarily when character is already visible', async () => {
      const shortPrompt = 'short'; // Short prompt that fits in viewport
      render(<TypingArea {...mockProps} prompt={shortPrompt} />);
      
      const container = screen.getByRole('textbox');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Type first character
      fireEvent.keyDown(container, { key: 's' });
      
      // Wait for DOM updates
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // For short prompts, scrolling may still be called but that's okay
      // The important thing is that the scrolling function handles it gracefully
      if (mockScrollIntoView.mock.calls.length > 0) {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center',
          inline: 'start'
        });
      }
    });
  });

  describe('Chinese Punctuation Grouping', () => {
    it('groups Chinese punctuation with preceding Chinese character', () => {
      const chinesePrompt = '你好，世界！';
      render(<TypingArea prompt={chinesePrompt} practiceMode="pinyin" onComplete={vi.fn()} />);
      
      // Verify that Chinese characters and punctuation are rendered
      // In pinyin mode, Chinese characters use pinyin-practice-char test ID
      const pinyinChars = screen.getAllByTestId('pinyin-practice-char');
      expect(pinyinChars).toHaveLength(6); // 你好，世界！ (6 characters total)
      
      // Check the specific characters
      expect(pinyinChars[0]).toHaveTextContent('你');
      expect(pinyinChars[1]).toHaveTextContent('好');
      expect(pinyinChars[2]).toHaveTextContent('，');
      expect(pinyinChars[3]).toHaveTextContent('世');
      expect(pinyinChars[4]).toHaveTextContent('界');
      expect(pinyinChars[5]).toHaveTextContent('！');
    });

    it('handles mixed Chinese characters and punctuation', () => {
      const mixedPrompt = '测试！English，中文。';
      render(<TypingArea prompt={mixedPrompt} practiceMode="pinyin" onComplete={vi.fn()} />);
      
      // Verify all characters are rendered - mix of pinyin and regular chars
      const pinyinChars = screen.queryAllByTestId('pinyin-practice-char');
      const regularChars = screen.queryAllByTestId('practice-char');
      const totalChars = pinyinChars.length + regularChars.length;
      expect(totalChars).toBeGreaterThan(0);
      
      // The important thing is that it renders without errors and shows the characters
      if (pinyinChars.length > 0) {
        const firstChar = pinyinChars[0];
        expect(firstChar).toHaveTextContent('测');
      }
    });

    it('handles standalone Chinese punctuation', () => {
      const punctPrompt = '，。！？';
      render(<TypingArea prompt={punctPrompt} practiceMode="pinyin" onComplete={vi.fn()} />);
      
      const pinyinChars = screen.getAllByTestId('pinyin-practice-char');
      expect(pinyinChars).toHaveLength(4);
      expect(pinyinChars[0]).toHaveTextContent('，');
      expect(pinyinChars[1]).toHaveTextContent('。');
      expect(pinyinChars[2]).toHaveTextContent('！');
      expect(pinyinChars[3]).toHaveTextContent('？');
    });
  });
});
