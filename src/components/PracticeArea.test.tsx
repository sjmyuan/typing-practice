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
});
