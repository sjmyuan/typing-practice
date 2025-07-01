import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import PracticeArea from './PracticeArea';

describe('PracticeArea', () => {
  const testPrompt = 'hello';

  // Helper function to start practice session with custom prompt
  const startPracticeSessionWithPrompt = async (prompt: string = testPrompt) => {
    const user = userEvent.setup();
    
    // First, click "Create Your Own Content" to enter custom input mode
    const customTextButton = screen.getByRole('button', { name: /create your own content/i });
    await user.click(customTextButton);
    
    // Type prompt in textarea
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, prompt);
    
    // Click start button
    const startButton = screen.getByRole('button', { name: /start practice/i });
    await user.click(startButton);
    
    // Return the practice textbox
    return screen.getByRole('textbox');
  };

  describe('Initial State', () => {
    it('renders start screen initially', () => {
      render(<PracticeArea />);
      // Should show mode selection buttons initially
      expect(screen.getByRole('button', { name: /create your own content/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /browse existing poems/i })).toBeInTheDocument();
    });
  });

  describe('Practice Session', () => {
    it('renders the prompt text after starting practice', async () => {
      render(<PracticeArea />);
      await startPracticeSessionWithPrompt();
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(5);
      expect(chars[0]).toHaveTextContent('h');
      expect(chars[1]).toHaveTextContent('e');
      expect(chars[2]).toHaveTextContent('l');
      expect(chars[3]).toHaveTextContent('l');
      expect(chars[4]).toHaveTextContent('o');
    });

    it('marks correct characters in green when typing', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
    });

    it('marks incorrect characters in red when typing', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-red-600');
    });

    it('shows cursor at current typing position', async () => {
      render(<PracticeArea />);
      await startPracticeSessionWithPrompt();
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toBeInTheDocument();
    });

    it('completes practice when all characters are typed correctly', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      // Type all characters of the prompt
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'o', code: 'KeyO' });
      // Check completion message appears
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
    });

    it('shows progress and accuracy information', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      expect(screen.getByText(/Progress: 1\/5/)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy: 100%/)).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('shows completion screen after practice completion', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      
      // Complete the practice
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'o', code: 'KeyO' });
      
      // Verify completion screen with both buttons
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start new practice/i })).toBeInTheDocument();
    });
  });

  describe('Custom Prompts', () => {
    it('works with different prompt lengths', async () => {
      render(<PracticeArea />);
      const longPrompt = 'This is a longer text';
      await startPracticeSessionWithPrompt(longPrompt);
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(longPrompt.length);
    });

    it('works with special characters', async () => {
      render(<PracticeArea />);
      const specialPrompt = 'Hello, World!';
      await startPracticeSessionWithPrompt(specialPrompt);
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(specialPrompt.length);
      expect(chars[5]).toHaveTextContent(',');
      expect(chars[12]).toHaveTextContent('!');
    });
  });

  describe('Initial Prompt Support', () => {
    it('supports initial prompt prop', async () => {
      const initialPrompt = 'initial test';
      render(<PracticeArea initialPrompt={initialPrompt} />);
      
      // Should still show mode selection initially
      expect(screen.getByRole('button', { name: /create your own content/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /browse existing poems/i })).toBeInTheDocument();
    });
  });

  describe('Completion Screen Navigation', () => {
    it('Practice Again button restarts same prompt without going to start screen', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      
      // Complete the practice
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'o', code: 'KeyO' });
      
      // Verify completion screen
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      
      // Click Practice Again button
      const practiceAgainButton = screen.getByRole('button', { name: /practice again/i });
      fireEvent.click(practiceAgainButton);
      
      // Should go directly to practice area with same prompt
      const chars = screen.getAllByTestId('practice-char');
      expect(chars).toHaveLength(5);
      expect(chars[0]).toHaveTextContent('h');
      
      // Should not show start screen elements
      expect(screen.queryByPlaceholderText(/enter the text you want to practice typing/i)).not.toBeInTheDocument();
    });

    it('Start New Practice button goes back to start screen', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      
      // Complete the practice
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'o', code: 'KeyO' });
      
      // Verify completion screen
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      
      // Click Start New Practice button
      const startNewButton = screen.getByRole('button', { name: /start new practice/i });
      fireEvent.click(startNewButton);
      
      // Should be back to start screen
      expect(screen.getByRole('button', { name: /create your own content/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /browse existing poems/i })).toBeInTheDocument();
      
      // Should not show practice characters
      expect(screen.queryAllByTestId('practice-char')).toHaveLength(0);
    });

    it('both buttons are present on completion screen', async () => {
      render(<PracticeArea />);
      const practiceArea = await startPracticeSessionWithPrompt();
      practiceArea.focus();
      
      // Complete the practice
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      fireEvent.keyDown(practiceArea, { key: 'o', code: 'KeyO' });
      
      // Verify completion screen has both buttons
      expect(screen.getByText('Practice Complete!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start new practice/i })).toBeInTheDocument();
    });
  });

  describe('Back to Options', () => {
    it('shows back button during active practice', async () => {
      render(<PracticeArea />);
      await startPracticeSessionWithPrompt();
      
      expect(screen.getByText('← Back to Options')).toBeInTheDocument();
    });

    it('returns to start screen when back button is clicked', async () => {
      render(<PracticeArea />);
      await startPracticeSessionWithPrompt();
      
      fireEvent.click(screen.getByText('← Back to Options'));
      
      // Should return to start screen
      expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
      expect(screen.queryAllByTestId('practice-char')).toHaveLength(0);
    });
  });

  describe('Practice State Communication', () => {
    it('should call onPracticeStateChange when practice state changes', async () => {
      const mockOnPracticeStateChange = vi.fn();
      const user = userEvent.setup();
      
      render(<PracticeArea onPracticeStateChange={mockOnPracticeStateChange} />);
      
      // Should call with 'ready' initially
      expect(mockOnPracticeStateChange).toHaveBeenCalledWith('ready');
      
      // First, click "Create Your Own Content" to enter custom input mode
      const customTextButton = screen.getByRole('button', { name: /create your own content/i });
      await user.click(customTextButton);
      
      // Start practice session
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, testPrompt);
      
      const startButton = screen.getByRole('button', { name: /start practice/i });
      await user.click(startButton);
      
      // Should call with 'active' when starting practice
      expect(mockOnPracticeStateChange).toHaveBeenCalledWith('active');
    });

    it('should not call onPracticeStateChange if not provided', async () => {
      // Should not throw error when onPracticeStateChange is not provided
      expect(() => {
        render(<PracticeArea />);
      }).not.toThrow();
    });
  });
});
