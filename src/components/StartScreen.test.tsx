import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import StartScreen from './StartScreen';

describe('StartScreen', () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
  });

  describe('Rendering', () => {
    it('renders textarea for prompt input', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders start practice button', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByRole('button', { name: /start practice/i })).toBeInTheDocument();
    });

    it('has placeholder text in textarea', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByPlaceholderText(/enter the text you want to practice typing/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('button is disabled when textarea is empty', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const button = screen.getByRole('button', { name: /start practice/i });
      expect(button).toBeDisabled();
    });

    it('button is enabled when textarea has content', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /start practice/i });
      
      await user.type(textarea, 'Hello world');
      expect(button).toBeEnabled();
    });

    it('button remains disabled for empty form, preventing submission', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const button = screen.getByRole('button', { name: /start practice/i });
      expect(button).toBeDisabled();
      
      // Try to click disabled button - should not trigger onStart
      await user.click(button);
      expect(mockOnStart).not.toHaveBeenCalled();
    });

    it('shows error when text is too short after form submission', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hi');
      await user.click(screen.getByRole('button', { name: /start practice/i }));
      
      expect(screen.getByText(/please enter at least 3 characters/i)).toBeInTheDocument();
      expect(mockOnStart).not.toHaveBeenCalled();
    });

    it('clears error when user types more text', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      
      // First trigger an error by submitting short text
      await user.type(textarea, 'Hi');
      await user.click(screen.getByRole('button', { name: /start practice/i }));
      expect(screen.getByText(/please enter at least 3 characters/i)).toBeInTheDocument();
      
      // Then type more to clear the error
      await user.type(textarea, ' there');
      expect(screen.queryByText(/please enter at least 3 characters/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onStart with trimmed prompt when valid text is submitted', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '  Hello world  ');
      await user.click(screen.getByRole('button', { name: /start practice/i }));
      
      expect(mockOnStart).toHaveBeenCalledWith('Hello world');
    });

    it('button remains disabled for whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /start practice/i });
      
      await user.type(textarea, '   ');
      expect(button).toBeDisabled();
      
      // Try to click disabled button - should not trigger onStart
      await user.click(button);
      expect(mockOnStart).not.toHaveBeenCalled();
    });

    it('submits form when button is clicked with valid text', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello world');
      
      const button = screen.getByRole('button', { name: /start practice/i });
      await user.click(button);
      
      expect(mockOnStart).toHaveBeenCalledWith('Hello world');
    });

    it('can submit form using Enter when button is focused', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      
      await user.type(textarea, 'Hello world');
      await user.tab(); // Move focus to button
      await user.keyboard('{Enter}');
      
      expect(mockOnStart).toHaveBeenCalledWith('Hello world');
    });
  });

  describe('Textarea Properties', () => {
    it('has correct maxLength', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });

    it('has correct number of rows', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('is not resizable', () => {
      render(<StartScreen onStart={mockOnStart} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });
  });

  describe('Accessibility', () => {
    it('form is accessible', () => {
      render(<StartScreen onStart={mockOnStart} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('error message is announced to screen readers when validation fails', async () => {
      const user = userEvent.setup();
      render(<StartScreen onStart={mockOnStart} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hi');
      await user.click(screen.getByRole('button', { name: /start practice/i }));
      
      const errorMessage = screen.getByText(/please enter at least 3 characters/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('no error messages shown for disabled button states', () => {
      render(<StartScreen onStart={mockOnStart} />);
      
      // Should not show any error messages initially
      expect(screen.queryByText(/please enter/i)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null onStart gracefully', () => {
      expect(() => {
        render(<StartScreen onStart={() => {}} />);
      }).not.toThrow();
    });

    it('handles undefined onStart gracefully', () => {
      expect(() => {
        render(<StartScreen onStart={() => {}} />);
      }).not.toThrow();
    });
  });
});
