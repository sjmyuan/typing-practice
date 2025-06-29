import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypingArea from './TypingArea';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('TypingArea Character Alignment Integration', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockOnComplete.mockClear();
  });

  it('renders character alignment control', () => {
    render(<TypingArea prompt="hello" onComplete={mockOnComplete} />);
    
    expect(screen.getByRole('radiogroup', { name: /character alignment options/i })).toBeInTheDocument();
  });

  it('applies left alignment by default', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(<TypingArea prompt="hello world" onComplete={mockOnComplete} />);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-start');
  });

  it('applies center alignment when selected', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<TypingArea prompt="hello world" onComplete={mockOnComplete} />);
    
    const centerButton = screen.getByRole('radio', { name: /center characters/i });
    await user.click(centerButton);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-center');
  });

  it('applies right alignment when selected', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<TypingArea prompt="hello world" onComplete={mockOnComplete} />);
    
    const rightButton = screen.getByRole('radio', { name: /right align characters/i });
    await user.click(rightButton);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-end');
  });

  it('applies justify alignment when selected', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<TypingArea prompt="hello world" onComplete={mockOnComplete} />);
    
    const justifyButton = screen.getByRole('radio', { name: /justify characters/i });
    await user.click(justifyButton);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-between');
  });

  it('persists alignment preference to localStorage', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<TypingArea prompt="hello" onComplete={mockOnComplete} />);
    
    const centerButton = screen.getByRole('radio', { name: /center characters/i });
    await user.click(centerButton);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('typingPracticeCharacterAlignment', 'center');
  });

  it('loads alignment preference from localStorage', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'typingPracticeCharacterAlignment') return 'right';
      if (key === 'typingPracticeFontSize') return 'medium';
      return null;
    });
    
    render(<TypingArea prompt="hello" onComplete={mockOnComplete} />);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-end');
    
    const rightButton = screen.getByRole('radio', { name: /right align characters/i });
    expect(rightButton).toHaveAttribute('aria-checked', 'true');
  });

  it('ignores invalid alignment values from localStorage', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'typingPracticeCharacterAlignment') return 'invalid-alignment';
      if (key === 'typingPracticeFontSize') return 'medium';
      return null;
    });
    
    render(<TypingArea prompt="hello" onComplete={mockOnComplete} />);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-start'); // Should default to left
  });

  it('applies alignment to both English and Pinyin modes', () => {
    mockLocalStorage.getItem.mockReturnValue('center');
    
    // Test English mode
    const { rerender } = render(<TypingArea prompt="hello" practiceMode="english" onComplete={mockOnComplete} />);
    let practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-center');
    
    // Test Pinyin mode
    rerender(<TypingArea prompt="你好" practiceMode="pinyin" onComplete={mockOnComplete} />);
    practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-center');
  });

  it('maintains proper line breaks with flexbox layout', () => {
    mockLocalStorage.getItem.mockReturnValue('center');
    
    render(<TypingArea prompt="hello\nworld" onComplete={mockOnComplete} />);
    
    const practiceContainer = screen.getByLabelText('practice prompt');
    expect(practiceContainer).toHaveClass('flex', 'flex-wrap', 'justify-center');
    
    // The container should support line breaks via flex-wrap
    expect(practiceContainer).toHaveClass('flex-wrap');
  });
});
