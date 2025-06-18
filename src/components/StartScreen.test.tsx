import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import StartScreen from './StartScreen';

describe('StartScreen', () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
  });

  describe('Rendering', () => {
    it('renders start practice button', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByRole('button', { name: /start practice/i })).toBeInTheDocument();
    });

    it('centers the button', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('text-center');
    });
  });

  describe('Button Styling', () => {
    it('applies correct CSS classes to button', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('bg-blue-500');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('rounded-lg');
      expect(button).toHaveClass('hover:bg-blue-600');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
      expect(button).toHaveClass('focus:ring-blue-400');
      expect(button).toHaveClass('text-lg');
      expect(button).toHaveClass('font-medium');
    });

    it('has correct button text', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByRole('button')).toHaveTextContent('Start Practice');
    });
  });

  describe('Click Handling', () => {
    it('calls onStart when button is clicked', () => {
      render(<StartScreen onStart={mockOnStart} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      expect(mockOnStart).toHaveBeenCalledTimes(2);
    });

    it('calls onStart without parameters', () => {
      render(<StartScreen onStart={mockOnStart} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnStart).toHaveBeenCalledWith();
    });
  });

  describe('Accessibility', () => {
    it('button is focusable', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('button has correct role', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('button text is accessible', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByText('Start Practice')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null onStart gracefully', () => {
      expect(() => {
        render(<StartScreen onStart={null as any} />);
      }).not.toThrow();
    });

    it('handles undefined onStart gracefully', () => {
      expect(() => {
        render(<StartScreen onStart={undefined as any} />);
      }).not.toThrow();
    });

    it('does not crash when clicking with null onStart', () => {
      render(<StartScreen onStart={null as any} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });

    it('does not crash when clicking with undefined onStart', () => {
      render(<StartScreen onStart={undefined as any} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
  });

  describe('Container Structure', () => {
    it('renders in proper container structure', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const button = screen.getByRole('button');
      const container = button.parentElement;
      expect(container).toHaveClass('text-center');
    });
  });
});
