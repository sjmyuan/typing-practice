import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import PinyinCharacterDisplay from './PinyinCharacterDisplay';

describe('PinyinCharacterDisplay', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Basic Character Rendering', () => {
    it('renders English character correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="a" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={false}
        />
      );
      expect(screen.getByTestId('pinyin-practice-char')).toHaveTextContent('a');
    });

    it('renders Chinese character correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={false}
        />
      );
      expect(screen.getByTestId('pinyin-practice-char')).toHaveTextContent('你');
    });

    it('renders space character as non-breaking space', () => {
      render(
        <PinyinCharacterDisplay 
          char=" " 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={false}
        />
      );
      const element = screen.getByTestId('pinyin-practice-char');
      expect(element.textContent).toContain('\u00A0');
    });

    it('has correct aria-label for character state', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="correct" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      expect(screen.getByTestId('pinyin-practice-char')).toHaveAttribute('aria-label', 'correct');
    });
  });

  describe('Pinyin Display', () => {
    it('shows pinyin when showPinyin is true for Chinese characters', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      expect(screen.getByTestId('pinyin-display')).toBeInTheDocument();
    });

    it('does not show pinyin when showPinyin is false', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={false}
        />
      );
      expect(screen.queryByTestId('pinyin-display')).not.toBeInTheDocument();
    });

    it('does not show pinyin for English characters even when showPinyin is true', () => {
      render(
        <PinyinCharacterDisplay 
          char="a" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      expect(screen.queryByTestId('pinyin-display')).not.toBeInTheDocument();
    });

    it('pinyin has correct styling', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      const pinyinElement = screen.getByTestId('pinyin-display');
      expect(pinyinElement).toHaveClass('text-[0.75em]');
      expect(pinyinElement).toHaveClass('text-gray-600');
      expect(pinyinElement).toHaveClass('leading-none');
      expect(pinyinElement).toHaveClass('mb-1');
      expect(pinyinElement).toHaveClass('select-none');
    });
  });

  describe('Character States Styling', () => {
    it('applies untyped styling correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      const char = screen.getByTestId('pinyin-practice-char');
      expect(char).toHaveClass('text-gray-400');
      expect(char).not.toHaveClass('text-green-600');
      expect(char).not.toHaveClass('text-red-600');
    });

    it('applies correct styling correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="correct" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      const char = screen.getByTestId('pinyin-practice-char');
      expect(char).toHaveClass('text-green-600');
      expect(char).toHaveClass('font-bold');
      expect(char).toHaveClass('bg-green-100');
    });

    it('applies incorrect styling correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="incorrect" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      const char = screen.getByTestId('pinyin-practice-char');
      expect(char).toHaveClass('text-red-600');
      expect(char).toHaveClass('font-bold');
      expect(char).toHaveClass('bg-red-100');
    });

    it('applies skipped styling correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="skipped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      const char = screen.getByTestId('pinyin-practice-char');
      expect(char).toHaveClass('text-yellow-700');
      expect(char).toHaveClass('font-bold');
      expect(char).toHaveClass('bg-yellow-100');
      expect(char).toHaveClass('line-through');
    });

    it('applies consistent base styling to all states', () => {
      const states: Array<'untyped' | 'correct' | 'incorrect' | 'skipped'> = 
        ['untyped', 'correct', 'incorrect', 'skipped'];
      
      states.forEach((state) => {
        const { unmount } = render(
          <PinyinCharacterDisplay 
            char="你" 
            state={state} 
            index={0} 
            onClick={mockOnClick}
            showCursor={false}
            showPinyin={true}
          />
        );
        const char = screen.getByTestId('pinyin-practice-char');
        expect(char).toHaveClass('relative');
        expect(char).toHaveClass('inline-flex');
        expect(char).toHaveClass('flex-col');
        expect(char).toHaveClass('items-center');
        expect(char).toHaveClass('cursor-pointer');
        expect(char).toHaveClass('px-0.5');
        expect(char).toHaveClass('rounded');
        expect(char).toHaveClass('min-w-[2rem]');
        unmount();
      });
    });
  });

  describe('Cursor Display', () => {
    it('shows cursor when showCursor is true', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
          showPinyin={true}
        />
      );
      expect(screen.getByTestId('cursor')).toBeInTheDocument();
    });

    it('does not show cursor when showCursor is false', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      expect(screen.queryByTestId('cursor')).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick with correct index when clicked', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={5} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      fireEvent.click(screen.getByTestId('pinyin-practice-char'));
      expect(mockOnClick).toHaveBeenCalledWith(5);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={3} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      const char = screen.getByTestId('pinyin-practice-char');
      fireEvent.click(char);
      fireEvent.click(char);
      expect(mockOnClick).toHaveBeenCalledTimes(2);
      expect(mockOnClick).toHaveBeenNthCalledWith(1, 3);
      expect(mockOnClick).toHaveBeenNthCalledWith(2, 3);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty character gracefully', () => {
      render(
        <PinyinCharacterDisplay 
          char="" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
          showPinyin={true}
        />
      );
      expect(screen.getByTestId('pinyin-practice-char')).toBeInTheDocument();
    });

    it('handles null onClick gracefully', () => {
      expect(() => {
        render(
          <PinyinCharacterDisplay 
            char="你" 
            state="untyped" 
            index={0} 
            onClick={null as any}
            showCursor={false}
            showPinyin={true}
          />
        );
      }).not.toThrow();
    });

    it('handles undefined onClick gracefully', () => {
      expect(() => {
        render(
          <PinyinCharacterDisplay 
            char="你" 
            state="untyped" 
            index={0} 
            onClick={undefined as any}
            showCursor={false}
            showPinyin={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Pinyin Individual Character Display', () => {
    it('renders pinyin as individual character spans', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
          showPinyin={true}
          pinyinInput="n"
        />
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const pinyinChars = pinyinDisplay.querySelectorAll('span.relative');
      
      expect(pinyinChars).toHaveLength(2); // 'n' and 'ǐ'
      expect(pinyinChars[0]).toHaveTextContent('n');
      expect(pinyinChars[1]).toHaveTextContent('ǐ');
    });

    it('shows cursor at correct position within pinyin', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
          showPinyin={true}
          pinyinInput="n"
        />
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const pinyinChars = pinyinDisplay.querySelectorAll('span.relative');
      
      // First character should be correct (typed)
      expect(pinyinChars[0]).toHaveClass('text-green-600');
      // Second character should have cursor
      expect(pinyinChars[1].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });

    it('shows correct/incorrect states for individual pinyin characters', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
          showPinyin={true}
          pinyinInput="nx" // wrong second character
        />
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const pinyinChars = pinyinDisplay.querySelectorAll('span.relative');
      
      // First character should be correct
      expect(pinyinChars[0]).toHaveClass('text-green-600');
      // Second character should be incorrect  
      expect(pinyinChars[1]).toHaveClass('text-red-600');
    });
  });

  describe('Tone Handling', () => {
    it('should accept keyboard input without tones for pinyin characters', () => {
      // Test that typing "ni" matches the pinyin "nǐ" for character "你"
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
          showPinyin={true}
          pinyinInput="ni" // User types "ni" for "nǐ"
        />
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const pinyinChars = pinyinDisplay.children;
      
      // Both characters should be correct even though user typed "ni" for "nǐ"
      expect(pinyinChars[0]).toHaveClass('text-green-600'); // 'n' should be correct
      expect(pinyinChars[1]).toHaveClass('text-green-600'); // 'i' should be correct for 'ǐ'
    });

    it('should show incorrect state when typing wrong pinyin', () => {
      render(
        <PinyinCharacterDisplay 
          char="你" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
          showPinyin={true}
          pinyinInput="na" // Wrong pinyin - should be "ni"
        />
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const pinyinChars = pinyinDisplay.children;
      
      expect(pinyinChars[0]).toHaveClass('text-green-600'); // 'n' is correct
      expect(pinyinChars[1]).toHaveClass('text-red-600'); // 'a' is incorrect for 'ǐ'
    });
  });

  describe('Font Size Scaling', () => {
    it('does not apply hardcoded font sizes that would override parent container sizing', () => {
      render(
        <div className="text-5xl">
          <PinyinCharacterDisplay
            char="你"
            state="untyped"
            index={0}
            onClick={() => {}}
            showCursor={false}
            showPinyin={true}
            pinyinInput=""
            pinyinState="neutral"
          />
        </div>
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const mainCharacter = screen.getByTestId('main-character');
      
      // Should not have hardcoded font sizes that override parent
      expect(pinyinDisplay).not.toHaveClass('text-base');
      expect(mainCharacter).not.toHaveClass('text-sm');
      
      // Should use relative sizing classes instead
      expect(pinyinDisplay.className).toMatch(/text-\[0\.75em\]/);
      // Main character should inherit from parent (no explicit font size class)
      expect(mainCharacter.className).not.toMatch(/text-(xs|sm|base|lg|xl)/);
    });

    it('scales pinyin display relative to main character when parent font size changes', () => {
      const { rerender } = render(
        <div className="text-xl">
          <PinyinCharacterDisplay
            char="你"
            state="untyped"
            index={0}
            onClick={() => {}}
            showCursor={false}
            showPinyin={true}
            pinyinInput=""
            pinyinState="neutral"
          />
        </div>
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const initialPinyinClasses = pinyinDisplay.className;
      
      // Re-render with larger parent font size
      rerender(
        <div className="text-7xl">
          <PinyinCharacterDisplay
            char="你"
            state="untyped"
            index={0}
            onClick={() => {}}
            showCursor={false}
            showPinyin={true}
            pinyinInput=""
            pinyinState="neutral"
          />
        </div>
      );
      
      // The classes should be the same (relative sizing), allowing CSS inheritance to work
      expect(pinyinDisplay.className).toBe(initialPinyinClasses);
    });

    it('maintains proper visual hierarchy between pinyin and main character at all font sizes', () => {
      render(
        <div className="text-3xl">
          <PinyinCharacterDisplay
            char="你"
            state="untyped"
            index={0}
            onClick={() => {}}
            showCursor={false}
            showPinyin={true}
            pinyinInput=""
            pinyinState="neutral"
          />
        </div>
      );
      
      const pinyinDisplay = screen.getByTestId('pinyin-display');
      const mainCharacter = screen.getByTestId('main-character');
      
      // Pinyin should be smaller than main character (relative sizing)
      // This test ensures we maintain visual hierarchy without hardcoded sizes
      expect(pinyinDisplay.className).toMatch(/text-\[0\.75em\]/);
      expect(mainCharacter.className).not.toMatch(/text-\[0\.75em\]/);
    });
  });
});
