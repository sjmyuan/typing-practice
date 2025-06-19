import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PracticeArea from './PracticeArea';

describe('PracticeArea', () => {
  const testPrompt = 'hello';

  // Helper function to start practice session with custom prompt
  const startPracticeSessionWithPrompt = async (prompt: string = testPrompt) => {
    const user = userEvent.setup();
    
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
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start practice/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter the text you want to practice typing/i)).toBeInTheDocument();
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
    it('allows restarting practice after completion', async () => {
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
      
      // Click restart button
      const restartButton = screen.getByRole('button', { name: /practice again/i });
      fireEvent.click(restartButton);
      
      // Should be back to start screen
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter the text you want to practice typing/i)).toBeInTheDocument();
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
      
      // Should still show start screen initially
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter the text you want to practice typing/i)).toBeInTheDocument();
    });
  });
});
