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
      expect(pinyinElement).toHaveClass('text-xs');
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
});
