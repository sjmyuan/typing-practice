import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CompletionScreen from './CompletionScreen';

describe('CompletionScreen', () => {
  const mockOnRestart = vi.fn();
  const mockOnStartNew = vi.fn();

  beforeEach(() => {
    mockOnRestart.mockClear();
    mockOnStartNew.mockClear();
  });

  describe('Rendering', () => {
    it('renders completion title', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
    });

    it('renders accuracy percentage', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Final Accuracy: 85%')).toBeInTheDocument();
    });

    it('renders practice again button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();
    });

    it('renders start new practice button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByRole('button', { name: /start new practice/i })).toBeInTheDocument();
    });

    it('centers the content', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const title = screen.getByText('Practice Complete!');
      const innerDiv = title.closest('div'); // This is the mb-6 div
      const outerDiv = innerDiv?.parentElement; // This is the text-center div
      expect(outerDiv).toHaveClass('text-center');
    });
  });

  describe('Title Styling', () => {
    it('applies correct CSS classes to title', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const title = screen.getByText('Practice Complete!');
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-bold');
      expect(title).toHaveClass('text-green-600');
      expect(title).toHaveClass('mb-2');
    });

    it('title is an h3 element', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Practice Complete!');
    });
  });

  describe('Accuracy Display', () => {
    it('displays different accuracy values correctly', () => {
      const accuracyValues = [0, 25, 50, 75, 100];
      
      accuracyValues.forEach((accuracy) => {
        const { unmount } = render(<CompletionScreen accuracy={accuracy} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
        expect(screen.getByText(`Final Accuracy: ${accuracy}%`)).toBeInTheDocument();
        unmount();
      });
    });

    it('applies correct CSS classes to accuracy text', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const accuracyText = screen.getByText('Final Accuracy: 85%');
      expect(accuracyText).toHaveClass('text-lg');
      expect(accuracyText).toHaveClass('text-gray-700');
    });

    it('accuracy text is in a paragraph', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const accuracyText = screen.getByText('Final Accuracy: 85%');
      expect(accuracyText.tagName).toBe('P');
    });
  });

  describe('Button Styling', () => {
    it('applies correct CSS classes to Practice Again button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const button = screen.getByRole('button', { name: /practice again/i });
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
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByRole('button', { name: /practice again/i })).toHaveTextContent('Practice Again');
      expect(screen.getByRole('button', { name: /start new practice/i })).toHaveTextContent('Start New Practice');
    });
  });

  describe('Layout Structure', () => {
    it('has correct margin between title/accuracy section and button', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const titleSection = screen.getByText('Practice Complete!').closest('div');
      expect(titleSection).toHaveClass('mb-6');
    });

    it('maintains proper component structure', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const titleElement = screen.getByText('Practice Complete!');
      const titleDiv = titleElement.closest('div');
      const container = titleDiv?.parentElement;
      expect(container).toHaveClass('text-center');
    });
  });

  describe('Click Handling', () => {
    it('calls onRestart when Practice Again button is clicked', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const practiceAgainButton = screen.getByRole('button', { name: /practice again/i });
      fireEvent.click(practiceAgainButton);
      expect(mockOnRestart).toHaveBeenCalledTimes(1);
      expect(mockOnStartNew).not.toHaveBeenCalled();
    });

    it('calls onStartNew when Start New Practice button is clicked', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const startNewButton = screen.getByRole('button', { name: /start new practice/i });
      fireEvent.click(startNewButton);
      expect(mockOnStartNew).toHaveBeenCalledTimes(1);
      expect(mockOnRestart).not.toHaveBeenCalled();
    });

    it('handles multiple clicks on Practice Again correctly', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const practiceAgainButton = screen.getByRole('button', { name: /practice again/i });
      fireEvent.click(practiceAgainButton);
      fireEvent.click(practiceAgainButton);
      expect(mockOnRestart).toHaveBeenCalledTimes(2);
    });

    it('handles multiple clicks on Start New Practice correctly', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const startNewButton = screen.getByRole('button', { name: /start new practice/i });
      fireEvent.click(startNewButton);
      fireEvent.click(startNewButton);
      expect(mockOnStartNew).toHaveBeenCalledTimes(2);
    });

    it('calls callbacks without parameters', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      fireEvent.click(screen.getByRole('button', { name: /practice again/i }));
      fireEvent.click(screen.getByRole('button', { name: /start new practice/i }));
      expect(mockOnRestart).toHaveBeenCalledWith();
      expect(mockOnStartNew).toHaveBeenCalledWith();
    });
  });

  describe('Accessibility', () => {
    it('Practice Again button is focusable', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const button = screen.getByRole('button', { name: /practice again/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it('Start New Practice button is focusable', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      const button = screen.getByRole('button', { name: /start new practice/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it('title has correct heading role', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles 0% accuracy', () => {
      render(<CompletionScreen accuracy={0} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Final Accuracy: 0%')).toBeInTheDocument();
    });

    it('handles 100% accuracy', () => {
      render(<CompletionScreen accuracy={100} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Final Accuracy: 100%')).toBeInTheDocument();
    });

    it('handles negative accuracy gracefully', () => {
      render(<CompletionScreen accuracy={-10} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Final Accuracy: -10%')).toBeInTheDocument();
    });

    it('handles accuracy over 100% gracefully', () => {
      render(<CompletionScreen accuracy={150} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Final Accuracy: 150%')).toBeInTheDocument();
    });

    it('handles decimal accuracy gracefully', () => {
      render(<CompletionScreen accuracy={85.7} onRestart={mockOnRestart} onStartNew={mockOnStartNew} />);
      expect(screen.getByText('Final Accuracy: 85.7%')).toBeInTheDocument();
    });

    it('handles null onRestart gracefully', () => {
      expect(() => {
        render(<CompletionScreen accuracy={85} onRestart={() => {}} onStartNew={mockOnStartNew} />);
      }).not.toThrow();
    });

    it('handles undefined onRestart gracefully', () => {
      expect(() => {
        render(<CompletionScreen accuracy={85} onRestart={() => {}} onStartNew={mockOnStartNew} />);
      }).not.toThrow();
    });

    it('handles null onStartNew gracefully', () => {
      expect(() => {
        render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={() => {}} />);
      }).not.toThrow();
    });

    it('handles undefined onStartNew gracefully', () => {
      expect(() => {
        render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={() => {}} />);
      }).not.toThrow();
    });

    it('does not crash when clicking Practice Again with null onRestart', () => {
      render(<CompletionScreen accuracy={85} onRestart={() => {}} onStartNew={mockOnStartNew} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /practice again/i }));
      }).not.toThrow();
    });

    it('does not crash when clicking Practice Again with undefined onRestart', () => {
      render(<CompletionScreen accuracy={85} onRestart={() => {}} onStartNew={mockOnStartNew} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /practice again/i }));
      }).not.toThrow();
    });

    it('does not crash when clicking Start New Practice with null onStartNew', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={() => {}} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /start new practice/i }));
      }).not.toThrow();
    });

    it('does not crash when clicking Start New Practice with undefined onStartNew', () => {
      render(<CompletionScreen accuracy={85} onRestart={mockOnRestart} onStartNew={() => {}} />);
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /start new practice/i }));
      }).not.toThrow();
    });
  });
});
