import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import TypingArea from './TypingArea';

describe('TypingArea', () => {
  const mockProps = {
    prompt: 'hello',
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
      expect(container).toHaveAttribute('aria-label', 'practice area - click here and start typing');
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
      
      expect(screen.getByText('Progress: 1/5 characters')).toBeInTheDocument();
      expect(screen.getByText('Accuracy: 100%')).toBeInTheDocument();
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

    it('has correct focus styling', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      
      expect(container).toHaveClass('focus:ring-2');
      expect(container).toHaveClass('focus:ring-blue-400');
      expect(container).toHaveClass('focus:bg-white');
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
      expect(screen.getByText('Progress: 0/5 characters')).toBeInTheDocument();
      
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
        render(<TypingArea prompt="hello" onComplete={null as any} />);
      }).not.toThrow();
    });

    it('handles undefined onComplete gracefully', () => {
      expect(() => {
        render(<TypingArea prompt="hello" onComplete={undefined as any} />);
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
        expect(char).toHaveClass('inline-block');
      });
    });

    it('integrates with ProgressDisplay component', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      // Should show progress from ProgressDisplay
      expect(screen.getByText('Progress: 1/5 characters')).toBeInTheDocument();
    });

    it('integrates with TypingCursor component', () => {
      render(<TypingArea {...mockProps} />);
      
      // Should show cursor from TypingCursor
      expect(screen.getByTestId('cursor')).toBeInTheDocument();
      expect(screen.getByTestId('cursor')).toHaveClass('animate-pulse');
    });
  });
});
