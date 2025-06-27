import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CharacterDisplay from './CharacterDisplay';

describe('CharacterDisplay', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Character Rendering', () => {
    it('renders regular character correctly', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      expect(screen.getByTestId('practice-char')).toHaveTextContent('a');
    });

    it('renders space character as non-breaking space', () => {
      render(
        <CharacterDisplay 
          char=" " 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      const element = screen.getByTestId('practice-char');
      expect(element.textContent).toBe('\u00A0');
    });

    it('has correct aria-label for character state', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="correct" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      expect(screen.getByTestId('practice-char')).toHaveAttribute('aria-label', 'correct');
    });
  });

  describe('Character States Styling', () => {
    it('applies untyped styling correctly', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      const char = screen.getByTestId('practice-char');
      expect(char).toHaveClass('text-gray-400');
      expect(char).not.toHaveClass('text-green-600');
      expect(char).not.toHaveClass('text-red-600');
    });

    it('applies correct styling correctly', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="correct" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      const char = screen.getByTestId('practice-char');
      expect(char).toHaveClass('text-green-600');
      expect(char).toHaveClass('font-bold');
      expect(char).toHaveClass('bg-green-100');
    });

    it('applies incorrect styling correctly', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="incorrect" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      const char = screen.getByTestId('practice-char');
      expect(char).toHaveClass('text-red-600');
      expect(char).toHaveClass('font-bold');
      expect(char).toHaveClass('bg-red-100');
    });

    it('applies skipped styling correctly', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="skipped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      const char = screen.getByTestId('practice-char');
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
          <CharacterDisplay 
            char="a" 
            state={state} 
            index={0} 
            onClick={mockOnClick}
            showCursor={false}
          />
        );
        const char = screen.getByTestId('practice-char');
        expect(char).toHaveClass('relative');
        expect(char).toHaveClass('inline-block');
        expect(char).toHaveClass('min-w-[0.5rem]');
        expect(char).toHaveClass('cursor-pointer');
        expect(char).toHaveClass('px-0.5');
        expect(char).toHaveClass('rounded');
        unmount();
      });
    });
  });

  describe('Cursor Display', () => {
    it('shows cursor when showCursor is true', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={true}
        />
      );
      expect(screen.getByTestId('cursor')).toBeInTheDocument();
    });

    it('does not show cursor when showCursor is false', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      expect(screen.queryByTestId('cursor')).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick with correct index when clicked', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={5} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      fireEvent.click(screen.getByTestId('practice-char'));
      expect(mockOnClick).toHaveBeenCalledWith(5);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={3} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      const char = screen.getByTestId('practice-char');
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
        <CharacterDisplay 
          char="" 
          state="untyped" 
          index={0} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      expect(screen.getByTestId('practice-char')).toBeInTheDocument();
    });

    it('handles negative index gracefully', () => {
      render(
        <CharacterDisplay 
          char="a" 
          state="untyped" 
          index={-1} 
          onClick={mockOnClick}
          showCursor={false}
        />
      );
      fireEvent.click(screen.getByTestId('practice-char'));
      expect(mockOnClick).toHaveBeenCalledWith(-1);
    });

    it('handles null onClick gracefully', () => {
      expect(() => {
        render(
          <CharacterDisplay 
            char="a" 
            state="untyped" 
            index={0} 
            onClick={null as any}
            showCursor={false}
          />
        );
      }).not.toThrow();
    });

    it('handles undefined onClick gracefully', () => {
      expect(() => {
        render(
          <CharacterDisplay 
            char="a" 
            state="untyped" 
            index={0} 
            onClick={undefined as any}
            showCursor={false}
          />
        );
      }).not.toThrow();
    });
  });
});
