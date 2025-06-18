import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PracticeArea from './PracticeArea';

describe('PracticeArea', () => {
  const prompt = 'hello';

  it('renders the prompt text', () => {
    render(<PracticeArea prompt={prompt} />);
    const chars = screen.getAllByTestId('practice-char');
    expect(chars).toHaveLength(5);
    expect(chars[0]).toHaveTextContent('h');
    expect(chars[1]).toHaveTextContent('e');
    expect(chars[2]).toHaveTextContent('l');
    expect(chars[3]).toHaveTextContent('l');
    expect(chars[4]).toHaveTextContent('o');
  });

  it('marks correct characters in green when typing', () => {
    render(<PracticeArea prompt={prompt} />);
    const practiceArea = screen.getByRole('textbox');
    practiceArea.focus();
    fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
    const chars = screen.getAllByTestId('practice-char');
    expect(chars[0]).toHaveClass('text-green-600');
  });

  it('marks incorrect characters in red when typing', () => {
    render(<PracticeArea prompt={prompt} />);
    const practiceArea = screen.getByRole('textbox');
    practiceArea.focus();
    fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
    const chars = screen.getAllByTestId('practice-char');
    expect(chars[0]).toHaveClass('text-red-600');
  });

  it('updates marking in real-time when using backspace', () => {
    render(<PracticeArea prompt={prompt} />);
    const practiceArea = screen.getByRole('textbox');
    practiceArea.focus();
    fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
    fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
    let chars = screen.getAllByTestId('practice-char');
    expect(chars[1]).toHaveClass('text-red-600');
    // Simulate backspace
    fireEvent.keyDown(practiceArea, { key: 'Backspace', code: 'Backspace' });
    chars = screen.getAllByTestId('practice-char');
    expect(chars[1]).not.toHaveClass('text-red-600');
    expect(chars[1]).not.toHaveClass('text-green-600');
  });

  it('shows cursor at current typing position', () => {
    render(<PracticeArea prompt={prompt} />);
    const cursor = screen.getByTestId('cursor');
    expect(cursor).toBeInTheDocument();
  });

  it('prevents typing beyond prompt length', () => {
    render(<PracticeArea prompt={prompt} />);
    const practiceArea = screen.getByRole('textbox');
    practiceArea.focus();
    // Type all characters of the prompt
    fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
    fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
    fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
    fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
    fireEvent.keyDown(practiceArea, { key: 'o', code: 'KeyO' });
    // Check completion message appears
    expect(screen.getByText('✓ Complete!')).toBeInTheDocument();
    // Try to type beyond prompt length - should be ignored
    fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
    const chars = screen.getAllByTestId('practice-char');
    expect(chars).toHaveLength(5); // Should still be 5 characters
  });

  it('shows progress and accuracy information', () => {
    render(<PracticeArea prompt={prompt} />);
    const practiceArea = screen.getByRole('textbox');
    practiceArea.focus();
    fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
    expect(screen.getByText(/Progress: 1\/5/)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy: 100%/)).toBeInTheDocument();
  });

  it('focuses when clicked', () => {
    render(<PracticeArea prompt={prompt} />);
    const practiceArea = screen.getByRole('textbox');
    fireEvent.click(practiceArea);
    expect(practiceArea).toHaveFocus();
  });

  // Enhanced cursor state management tests
  describe('Cursor State Management', () => {
    it('initializes cursor at position 0', () => {
      render(<PracticeArea prompt={prompt} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toBeInTheDocument();
      // Cursor should be positioned at the first character
      const chars = screen.getAllByTestId('practice-char');
      const firstChar = chars[0];
      expect(firstChar).toContainElement(cursor);
    });

    it('moves cursor forward when typing correct characters', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      practiceArea.focus();
      
      // Type first character correctly
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      
      const chars = screen.getAllByTestId('practice-char');
      const cursor = screen.getByTestId('cursor');
      // Cursor should now be at second character
      expect(chars[1]).toContainElement(cursor);
    });

    it('moves cursor backward when using backspace', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      practiceArea.focus();
      
      // Type two characters
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      
      // Use backspace
      fireEvent.keyDown(practiceArea, { key: 'Backspace', code: 'Backspace' });
      
      const chars = screen.getAllByTestId('practice-char');
      const cursor = screen.getByTestId('cursor');
      // Cursor should be back at second character
      expect(chars[1]).toContainElement(cursor);
    });

    it('moves cursor forward when typing incorrect character', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      practiceArea.focus();
      
      // Type incorrect first character
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      
      const chars = screen.getAllByTestId('practice-char');
      const cursor = screen.getByTestId('cursor');
      // Cursor should now be at second character
      expect(chars[1]).toContainElement(cursor);
    });

    it('does not move cursor beyond prompt length', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      practiceArea.focus();
      
      // Type all characters correctly
      'hello'.split('').forEach(char => {
        fireEvent.keyDown(practiceArea, { key: char, code: `Key${char.toUpperCase()}` });
      });
      
      // Try to type beyond prompt
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      
      const cursor = screen.queryByTestId('cursor');
      // Cursor should not be visible when at end
      expect(cursor).not.toBeInTheDocument();
    });
  });

  // Character State Classification tests
  describe('Character State Classification', () => {
    it('displays untyped characters in gray', () => {
      render(<PracticeArea prompt={prompt} />);
      const chars = screen.getAllByTestId('practice-char');
      // All characters should start as untyped (gray)
      chars.forEach(char => {
        expect(char).toHaveClass('text-gray-400');
      });
    });

    it('displays correct characters with green background', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      practiceArea.focus();
      
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
      expect(chars[0]).toHaveClass('bg-green-100');
    });

    it('displays incorrect characters with red background', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      practiceArea.focus();
      
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toHaveClass('text-red-600');
      expect(chars[0]).toHaveClass('bg-red-100');
    });

    it('displays skipped characters with distinctive styling', () => {
      render(<PracticeArea prompt="hello" />);
      const chars = screen.getAllByTestId('practice-char');
      
      // Click on third character to skip first two
      fireEvent.click(chars[2]);
      
      // First two characters should be marked as skipped
      expect(chars[0]).toHaveClass('text-yellow-700');
      expect(chars[0]).toHaveClass('bg-yellow-100');
      expect(chars[0]).toHaveClass('line-through');
      
      expect(chars[1]).toHaveClass('text-yellow-700');
      expect(chars[1]).toHaveClass('bg-yellow-100');
      expect(chars[1]).toHaveClass('line-through');
      
      // Third character should still be untyped
      expect(chars[2]).toHaveClass('text-gray-400');
    });

    it('handles mixed character states correctly', () => {
      render(<PracticeArea prompt="hello" />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      practiceArea.focus();
      
      // Type correct first character
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      // Type incorrect second character
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      // Skip to fourth character
      fireEvent.click(chars[3]);
      
      // Check states
      expect(chars[0]).toHaveClass('text-green-600'); // correct
      expect(chars[1]).toHaveClass('text-red-600');   // incorrect
      expect(chars[2]).toHaveClass('text-yellow-700'); // skipped
      expect(chars[3]).toHaveClass('text-gray-400');   // untyped (cursor position)
      expect(chars[4]).toHaveClass('text-gray-400');   // untyped
    });

    it('updates character states correctly when click a typed character', () => {
      render(<PracticeArea prompt="hello" />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      practiceArea.focus();

      
      // Type first character correctly
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      // Type second character incorrectly
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });

      expect(chars[0]).toHaveClass('text-green-600'); // correct
      expect(chars[1]).toHaveClass('text-red-600');   // incorrect
      expect(chars[2]).toHaveClass('text-gray-400');   // untyped (cursor position)
      expect(chars[3]).toHaveClass('text-gray-400');   // untyped

      // Skip to fourth character
      fireEvent.click(chars[3]);

      expect(chars[0]).toHaveClass('text-green-600'); // correct
      expect(chars[1]).toHaveClass('text-red-600');   // incorrect
      expect(chars[2]).toHaveClass('text-yellow-700');   // skipped
      expect(chars[3]).toHaveClass('text-gray-400');   // untyped (cursor position)

      // Type fourth character incorrectly
      fireEvent.keyDown(practiceArea, { key: 'b', code: 'KeyB' });

      expect(chars[0]).toHaveClass('text-green-600'); // correct
      expect(chars[1]).toHaveClass('text-red-600');   // incorrect
      expect(chars[2]).toHaveClass('text-yellow-700');   // skipped
      expect(chars[3]).toHaveClass('text-red-600');   // incorrect

      // Jump back to second character
      fireEvent.click(chars[1]);
      
      expect(chars[0]).toHaveClass('text-green-600'); // correct
      expect(chars[1]).toHaveClass('text-gray-400');   // untyped (cursor position)
      expect(chars[2]).toHaveClass('text-gray-400');   // untyped
      expect(chars[3]).toHaveClass('text-gray-400');   // untyped
    });
  });

  // Manual cursor positioning tests
  describe('Manual Cursor Positioning', () => {
    it('moves cursor when clicking on a character', () => {
      render(<PracticeArea prompt={prompt} />);
      const chars = screen.getAllByTestId('practice-char');
      
      // Click on the third character (index 2)
      fireEvent.click(chars[2]);
      
      const cursor = screen.getByTestId('cursor');
      expect(chars[2]).toContainElement(cursor);
    });

    it('marks characters as skipped when clicking ahead', () => {
      render(<PracticeArea prompt={prompt} />);
      const chars = screen.getAllByTestId('practice-char');
      
      // Click on the fourth character (index 3) 
      fireEvent.click(chars[3]);
      
      // Characters 0, 1, 2 should be marked as skipped
      expect(chars[0]).toHaveAttribute('aria-label', 'skipped');
      expect(chars[1]).toHaveAttribute('aria-label', 'skipped');
      expect(chars[2]).toHaveAttribute('aria-label', 'skipped');
      expect(chars[3]).toHaveAttribute('aria-label', 'untyped');
    });

    it('does not mark characters as skipped when clicking backward', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Type first two characters
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      
      // Click back to first character
      fireEvent.click(chars[0]);
      
      // First character should still be reset to untyped
      expect(chars[0]).toHaveAttribute('aria-label', 'untyped');
      // Second character should be reset to untyped (since we clicked backward)
      expect(chars[1]).toHaveAttribute('aria-label', 'untyped');
    });

    it('allows typing after clicking to position cursor', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Click on third character
      fireEvent.click(chars[2]);
      
      // Type the correct character for position 2
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      
      // Character at position 2 should be marked as correct
      expect(chars[2]).toHaveAttribute('aria-label', 'correct');
      
      // Cursor should move to next position
      const cursor = screen.getByTestId('cursor');
      expect(chars[3]).toContainElement(cursor);
    });

    it('handles clicking on already typed characters', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Type first three characters
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(practiceArea, { key: 'e', code: 'KeyE' });
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      
      // Click back to second character
      fireEvent.click(chars[1]);
      
      // Cursor should be positioned at second character
      const cursor = screen.getByTestId('cursor');
      expect(chars[1]).toContainElement(cursor);
      
      // Characters should be reset from clicked position onward
      expect(chars[0]).toHaveAttribute('aria-label', 'correct');
      expect(chars[1]).toHaveAttribute('aria-label', 'untyped'); // reset
      expect(chars[2]).toHaveAttribute('aria-label', 'untyped'); // reset
    });
  });

  // Visual indication tests
  describe('Visual Indications', () => {
    it('applies correct styling for skipped characters', () => {
      render(<PracticeArea prompt={prompt} />);
      const chars = screen.getAllByTestId('practice-char');
      
      // Click on third character to skip first two
      fireEvent.click(chars[2]);
      
      // Skipped characters should have specific styling
      expect(chars[0]).toHaveClass('bg-yellow-100');
      expect(chars[1]).toHaveClass('bg-yellow-100');
    });

    it('applies correct styling for different character states', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Create a mixed scenario
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' }); // correct
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' }); // incorrect
      fireEvent.click(chars[3]); // skip character at index 2
      
      expect(chars[0]).toHaveClass('bg-green-100'); // correct
      expect(chars[1]).toHaveClass('bg-red-100'); // incorrect
      expect(chars[2]).toHaveClass('bg-yellow-100'); // skipped
      expect(chars[3]).toHaveClass('text-gray-400'); // untyped
    });
  });

  // Enhanced input handling tests
  describe('Enhanced Input Handling', () => {
    it('types at cursor position after manual positioning', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Click on third character
      fireEvent.click(chars[2]);
      
      // Type the character for that position
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      
      // Should mark as correct and advance cursor
      expect(chars[2]).toHaveAttribute('aria-label', 'correct');
      
      const cursor = screen.getByTestId('cursor');
      expect(chars[3]).toContainElement(cursor);
    });

    it('handles backspace from manual cursor position', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Type first character
      practiceArea.focus();
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      
      // Click on third position
      fireEvent.click(chars[2]);
      
      // Type third character
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' });
      
      // Use backspace
      fireEvent.keyDown(practiceArea, { key: 'Backspace', code: 'Backspace' });
      
      // Should clear the character and move cursor back
      expect(chars[2]).toHaveAttribute('aria-label', 'untyped');
      
      const cursor = screen.getByTestId('cursor');
      expect(chars[2]).toContainElement(cursor);
    });

    it('maintains typing accuracy with mixed correct/incorrect/skipped characters', () => {
      render(<PracticeArea prompt="hello" />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      practiceArea.focus();
      
      // Create a complex scenario
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' }); // correct
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' }); // incorrect
      fireEvent.click(chars[3]); // skip position 2, cursor at 3
      fireEvent.keyDown(practiceArea, { key: 'l', code: 'KeyL' }); // correct at position 3
      
      // Check accuracy calculation includes all states
      expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
    });

    it('prevents invalid cursor movements', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      
      practiceArea.focus();
      
      // Try to use backspace at beginning
      fireEvent.keyDown(practiceArea, { key: 'Backspace', code: 'Backspace' });
      
      // Cursor should remain at position 0
      const cursor = screen.getByTestId('cursor');
      const chars = screen.getAllByTestId('practice-char');
      expect(chars[0]).toContainElement(cursor);
    });
  });

  // Visual design and accessibility tests
  describe('Visual Design and Accessibility', () => {
    it('cursor has distinct visual styling', () => {
      render(<PracticeArea prompt={prompt} />);
      const cursor = screen.getByTestId('cursor');
      
      // Check cursor has animation and proper colors
      expect(cursor).toHaveClass('animate-pulse');
      expect(cursor).toHaveClass('bg-blue-500');
      expect(cursor).toHaveClass('w-0.5');
    });

    it('cursor remains visible across different character states', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      practiceArea.focus();
      
      // Type incorrect character
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      
      // Cursor should still be visible and positioned correctly
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toBeInTheDocument();
      expect(chars[1]).toContainElement(cursor);
    });

    it('characters have proper accessibility labels', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      const chars = screen.getAllByTestId('practice-char');
      
      // Initial state
      expect(chars[0]).toHaveAttribute('aria-label', 'untyped');
      
      practiceArea.focus();
      
      // After typing correct
      fireEvent.keyDown(practiceArea, { key: 'h', code: 'KeyH' });
      expect(chars[0]).toHaveAttribute('aria-label', 'correct');
      
      // After typing incorrect
      fireEvent.keyDown(practiceArea, { key: 'x', code: 'KeyX' });
      expect(chars[1]).toHaveAttribute('aria-label', 'incorrect');
      
      // After skipping
      fireEvent.click(chars[3]);
      expect(chars[2]).toHaveAttribute('aria-label', 'skipped');
    });

    it('maintains responsive design', () => {
      render(<PracticeArea prompt={prompt} />);
      const container = screen.getByRole('textbox');
      
      // Check responsive classes are applied
      expect(container.parentElement).toHaveClass('w-full');
      expect(container.parentElement).toHaveClass('max-w-xl');
      expect(container.parentElement).toHaveClass('mx-auto');
    });

    it('cursor is not visible when typing is complete', () => {
      render(<PracticeArea prompt={prompt} />);
      const practiceArea = screen.getByRole('textbox');
      
      practiceArea.focus();
      
      // Type all characters correctly
      'hello'.split('').forEach(char => {
        fireEvent.keyDown(practiceArea, { key: char, code: `Key${char.toUpperCase()}` });
      });
      
      // Cursor should not be visible
      const cursor = screen.queryByTestId('cursor');
      expect(cursor).not.toBeInTheDocument();
      
      // Completion message should be visible
      expect(screen.getByText('✓ Complete!')).toBeInTheDocument();
    });
  });
});
