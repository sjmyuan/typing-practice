import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CompletionScreen from './CompletionScreen';

describe('CompletionScreen', () => {
  const mockOnRestart = vi.fn();

  beforeEach(() => {
    mockOnRestart.mockClear();
  });

  describe('Rendering', () => {
    it('renders completion title', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
    });

    it('renders accuracy percentage', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      expect(screen.getByText('Final Accuracy: 85%')).toBeInTheDocument();
    });

    it('renders practice again button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();
    });

    it('centers the content', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const title = screen.getByText('Practice Complete!');
      const innerDiv = title.closest('div'); // This is the mb-6 div
      const outerDiv = innerDiv?.parentElement; // This is the text-center div
      expect(outerDiv).toHaveClass('text-center');
    });
  });

  describe('Title Styling', () => {
    it('applies correct CSS classes to title', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const title = screen.getByText('Practice Complete!');
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-bold');
      expect(title).toHaveClass('text-green-600');
      expect(title).toHaveClass('mb-2');
    });

    it('title is an h3 element', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Practice Complete!');
    });
  });

  describe('Accuracy Display', () => {
    it('displays different accuracy values correctly', () => {
      const accuracyValues = [0, 25, 50, 75, 100];
      
      accuracyValues.forEach((accuracy) => {
        const { unmount } = render(<CompletionScreen accuracy={accuracy} onRestart={mockOnRestart} />);
        expect(screen.getByText(`Final Accuracy: ${accuracy}%`)).toBeInTheDocument();
        unmount();
      });
    });

    it('applies correct CSS classes to accuracy text', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const accuracyText = screen.getByText('Final Accuracy: 85%');
      expect(accuracyText).toHaveClass('text-lg');
      expect(accuracyText).toHaveClass('text-gray-700');
    });

    it('accuracy text is in a paragraph', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const accuracyText = screen.getByText('Final Accuracy: 85%');
      expect(accuracyText.tagName).toBe('P');
    });
  });

  describe('Button Styling', () => {
    it('applies correct CSS classes to button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8');
      expect(button).toHaveClass('py-4');
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('rounded-lg');
      expect(button).toHaveClass('hover:bg-blue-700');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-4');
      expect(button).toHaveClass('focus:ring-blue-300');
      expect(button).toHaveClass('text-lg');
      expect(button).toHaveClass('font-semibold');
      expect(button).toHaveClass('shadow-lg');
      expect(button).toHaveClass('transition-all');
      expect(button).toHaveClass('duration-200');
    });

    it('has correct button text', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      expect(screen.getByRole('button')).toHaveTextContent('Practice Again');
    });
  });

  describe('Layout Structure', () => {
    it('has correct margin between title/accuracy section and button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const titleSection = screen.getByText('Practice Complete!').closest('div');
      expect(titleSection).toHaveClass('mb-6');
    });

    it('maintains proper component structure', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const titleElement = screen.getByText('Practice Complete!');
      const titleDiv = titleElement.closest('div');
      const container = titleDiv?.parentElement;
      expect(container).toHaveClass('text-center');
    });
  });

  describe('Click Handling', () => {
    it('calls onRestart when button is clicked', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnRestart).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      expect(mockOnRestart).toHaveBeenCalledTimes(2);
    });

    it('calls onRestart without parameters', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnRestart).toHaveBeenCalledWith();
    });
  });

  describe('Accessibility', () => {
    it('button is focusable', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('title has correct heading role', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} />);
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles 0% accuracy', () => {
      render(<CompletionScreen accuracy={0} onRestart={mockOnRestart} />);
      expect(screen.getByText('Final Accuracy: 0%')).toBeInTheDocument();
    });

    it('handles 100% accuracy', () => {
      render(<CompletionScreen accuracy={100} onRestart={mockOnRestart} />);
      expect(screen.getByText('Final Accuracy: 100%')).toBeInTheDocument();
    });

    it('handles negative accuracy gracefully', () => {
      render(<CompletionScreen accuracy={-10} onRestart={mockOnRestart} />);
      expect(screen.getByText('Final Accuracy: -10%')).toBeInTheDocument();
    });

    it('handles accuracy over 100% gracefully', () => {
      render(<CompletionScreen accuracy={150} onRestart={mockOnRestart} />);
      expect(screen.getByText('Final Accuracy: 150%')).toBeInTheDocument();
    });

    it('handles decimal accuracy gracefully', () => {
      render(<CompletionScreen accuracy={85.7} onRestart={mockOnRestart} />);
      expect(screen.getByText('Final Accuracy: 85.7%')).toBeInTheDocument();
    });

    it('handles null onRestart gracefully', () => {
      expect(() => {
        render(<CompletionScreen accuracy={85} onRestart={null as any} />);
      }).not.toThrow();
    });

    it('handles undefined onRestart gracefully', () => {
      expect(() => {
        render(<CompletionScreen accuracy={85} onRestart={undefined as any} />);
      }).not.toThrow();
    });

    it('does not crash when clicking with null onRestart', () => {
      render(<CompletionScreen accuracy={85} onRestart={null as any} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });

    it('does not crash when clicking with undefined onRestart', () => {
      render(<CompletionScreen accuracy={85} onRestart={undefined as any} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
  });
});
