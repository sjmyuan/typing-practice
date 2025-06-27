import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import TypingArea from './TypingArea';

describe('TypingArea Pinyin Mode', () => {
  const mockProps = {
    prompt: '你好',
    practiceMode: 'pinyin' as const,
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    mockProps.onComplete.mockClear();
  });

  describe('Pinyin Practice Mode', () => {
    it('renders pinyin instructions for pinyin mode', () => {
      render(<TypingArea {...mockProps} />);
      
      expect(screen.getByText(/Pinyin Practice Mode/)).toBeInTheDocument();
      expect(screen.getByText(/Type the pinyin for each Chinese character/)).toBeInTheDocument();
    });

    it('uses PinyinCharacterDisplay for Chinese characters', () => {
      render(<TypingArea {...mockProps} />);
      
      // Should use pinyin character display
      expect(screen.getAllByTestId('pinyin-practice-char')).toHaveLength(2);
      expect(screen.getByText('你')).toBeInTheDocument();
      expect(screen.getByText('好')).toBeInTheDocument();
    });

    it('shows pinyin above Chinese characters', () => {
      render(<TypingArea {...mockProps} />);
      
      // Should show pinyin displays
      const pinyinDisplays = screen.getAllByTestId('pinyin-display');
      expect(pinyinDisplays.length).toBeGreaterThan(0);
    });

    it('validates pinyin input on space key', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for 你 (ni)
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      fireEvent.keyDown(container, { key: ' ', code: 'Space' });
      
      // First character should be marked as correct
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
      expect(chars[0]).toHaveClass('bg-green-100');
    });

    it('marks incorrect pinyin as incorrect', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type incorrect pinyin for 你
      fireEvent.keyDown(container, { key: 'w', code: 'KeyW' });
      fireEvent.keyDown(container, { key: 'o', code: 'KeyO' });
      fireEvent.keyDown(container, { key: ' ', code: 'Space' });
      
      // First character should be marked as incorrect
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[0]).toHaveClass('text-red-600');
      expect(chars[0]).toHaveClass('bg-red-100');
    });

    it('validates pinyin input on enter key', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for 你 (ni)
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      fireEvent.keyDown(container, { key: 'Enter', code: 'Enter' });
      
      // First character should be marked as correct
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
    });

    it('moves cursor to next character after correct pinyin input', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for first character
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      fireEvent.keyDown(container, { key: ' ', code: 'Space' });
      
      // Cursor should move to second character
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[1].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });

    it('completes practice when all characters are typed correctly', async () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for both characters
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      fireEvent.keyDown(container, { key: ' ', code: 'Space' });
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(container, { key: 'o', code: 'KeyO' });
      fireEvent.keyDown(container, { key: ' ', code: 'Space' });
      
      // Wait for async completion
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should call onComplete
      expect(mockProps.onComplete).toHaveBeenCalledTimes(1);
      expect(mockProps.onComplete).toHaveBeenCalledWith({
        accuracy: 100,
        totalCharacters: 2,
        correctCharacters: 2,
        incorrectCharacters: 0
      });
    });
  });

  describe('Mixed English-Pinyin Mode', () => {
    it('handles mixed English and Chinese text', () => {
      const mixedProps = {
        prompt: 'Hello 你好',
        practiceMode: 'pinyin' as const,
        onComplete: vi.fn(),
      };

      render(<TypingArea {...mixedProps} />);
      
      // Should render mixed content
      expect(screen.getByText('H')).toBeInTheDocument();
      expect(screen.getByText('你')).toBeInTheDocument();
      expect(screen.getByText('好')).toBeInTheDocument();
    });
  });
});
