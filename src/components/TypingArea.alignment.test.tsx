import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TypingArea from './TypingArea';

describe('TypingArea Text Alignment Integration', () => {
  const mockOnComplete = vi.fn();
  const testPrompt = "Hello world!";

  beforeEach(() => {
    mockOnComplete.mockClear();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders text alignment control alongside font size control', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    // Check that both controls are present
    expect(screen.getByRole('button', { name: /align left/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increase font size/i })).toBeInTheDocument();
  });

  it('defaults to left alignment', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const leftButton = screen.getByRole('button', { name: /align left/i });
    expect(leftButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies left alignment class to practice content by default', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-left');
  });

  it('changes to center alignment when center button is clicked', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const centerButton = screen.getByRole('button', { name: /align center/i });
    fireEvent.click(centerButton);
    
    expect(centerButton).toHaveAttribute('aria-pressed', 'true');
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-center');
  });

  it('changes to right alignment when right button is clicked', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const rightButton = screen.getByRole('button', { name: /align right/i });
    fireEvent.click(rightButton);
    
    expect(rightButton).toHaveAttribute('aria-pressed', 'true');
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-right');
  });

  it('changes to justify alignment when justify button is clicked', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const justifyButton = screen.getByRole('button', { name: /justify/i });
    fireEvent.click(justifyButton);
    
    expect(justifyButton).toHaveAttribute('aria-pressed', 'true');
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-justify');
  });

  it('persists alignment preference in localStorage', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const centerButton = screen.getByRole('button', { name: /align center/i });
    fireEvent.click(centerButton);
    
    expect(localStorage.getItem('typingPracticeTextAlignment')).toBe('center');
  });

  it('loads alignment preference from localStorage', () => {
    localStorage.setItem('typingPracticeTextAlignment', 'right');
    
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    const rightButton = screen.getByRole('button', { name: /align right/i });
    expect(rightButton).toHaveAttribute('aria-pressed', 'true');
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-right');
  });

  it('ignores invalid alignment values from localStorage', () => {
    localStorage.setItem('typingPracticeTextAlignment', 'invalid');
    
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    // Should default to left alignment
    const leftButton = screen.getByRole('button', { name: /align left/i });
    expect(leftButton).toHaveAttribute('aria-pressed', 'true');
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-left');
  });

  it('maintains text alignment while typing', () => {
    render(<TypingArea prompt={testPrompt} onComplete={mockOnComplete} />);
    
    // Set center alignment
    const centerButton = screen.getByRole('button', { name: /align center/i });
    fireEvent.click(centerButton);
    
    // Start typing
    const practiceArea = screen.getByRole('textbox', { name: /practice area/i });
    fireEvent.keyDown(practiceArea, { key: 'H' });
    
    // Check that alignment is maintained
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-center');
  });

  it('works correctly in pinyin mode', () => {
    const pinyinPrompt = "你好";
    render(<TypingArea prompt={pinyinPrompt} practiceMode="pinyin" onComplete={mockOnComplete} />);
    
    // Set right alignment
    const rightButton = screen.getByRole('button', { name: /align right/i });
    fireEvent.click(rightButton);
    
    expect(rightButton).toHaveAttribute('aria-pressed', 'true');
    
    const practiceContent = screen.getByRole('presentation', { name: /practice prompt/i });
    expect(practiceContent).toHaveClass('text-right');
  });
});
