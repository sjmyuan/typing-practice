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

    it('validates pinyin input automatically when correct length is reached', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for 你 (ni) - should automatically advance
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      
      // First character should be marked as correct automatically
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[0]).toHaveClass('text-green-600');
      expect(chars[0]).toHaveClass('bg-green-100');
    });

    it('marks incorrect pinyin as incorrect automatically', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type incorrect pinyin for 你 (wo - wrong length, but let's use 'wa' to match expected length)
      fireEvent.keyDown(container, { key: 'w', code: 'KeyW' });
      fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });
      
      // First character should be marked as incorrect automatically
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[0]).toHaveClass('text-red-600');
      expect(chars[0]).toHaveClass('bg-red-100');
    });

    it('moves cursor to next character after correct pinyin input', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for first character - cursor should move automatically
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      
      // Cursor should automatically move to second character
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[1].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
    });

    it('completes practice when all characters are typed correctly', async () => {
      const onCompleteMock = vi.fn();
      const props = {
        prompt: '你好',
        practiceMode: 'pinyin' as const,
        onComplete: onCompleteMock,
      };
      
      render(<TypingArea {...props} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for both characters - should complete automatically
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(container, { key: 'o', code: 'KeyO' });
      
      // Wait for async completion
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should call onComplete exactly once
      expect(onCompleteMock).toHaveBeenCalledTimes(1);
      expect(onCompleteMock).toHaveBeenCalledWith({
        accuracy: 100,
        totalCharacters: 2,
        correctCharacters: 2,
        incorrectCharacters: 0
      });
    });
  });

  describe('Automatic Cursor Movement', () => {
    it('automatically moves cursor to next character when pinyin length matches expected length', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for 你 (expected: "ni" - 2 characters)
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      
      // Should automatically move cursor to second character without needing Space/Enter
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[1].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
      
      // First character should be marked as correct
      expect(chars[0]).toHaveClass('text-green-600');
    });

    it('automatically moves cursor even with incorrect pinyin when length matches', () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type incorrect pinyin for 你 (expected: "ni", typing: "wo" - both 2 characters)
      fireEvent.keyDown(container, { key: 'w', code: 'KeyW' });
      fireEvent.keyDown(container, { key: 'o', code: 'KeyO' });
      
      // Should automatically move cursor to second character
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[1].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
      
      // First character should be marked as incorrect
      expect(chars[0]).toHaveClass('text-red-600');
    });

    it('does not move cursor automatically for characters with different pinyin lengths', () => {
      const longPinyinProps = {
        prompt: '中国',
        practiceMode: 'pinyin' as const,
        onComplete: vi.fn(),
      };
      
      render(<TypingArea {...longPinyinProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type partial pinyin for 中 (expected: "zhong" - 5 characters, typing only 2)
      fireEvent.keyDown(container, { key: 'z', code: 'KeyZ' });
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      
      // Should NOT automatically move cursor yet
      const chars = screen.getAllByTestId('pinyin-practice-char');
      expect(chars[0].querySelector('[data-testid="cursor"]')).toBeInTheDocument();
      expect(chars[1].querySelector('[data-testid="cursor"]')).not.toBeInTheDocument();
    });

    it('completes practice automatically without requiring Space/Enter', async () => {
      render(<TypingArea {...mockProps} />);
      const container = screen.getByRole('textbox');
      container.focus();
      
      // Type correct pinyin for both characters without Space/Enter
      fireEvent.keyDown(container, { key: 'n', code: 'KeyN' });
      fireEvent.keyDown(container, { key: 'i', code: 'KeyI' });
      
      fireEvent.keyDown(container, { key: 'h', code: 'KeyH' });
      fireEvent.keyDown(container, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(container, { key: 'o', code: 'KeyO' });
      
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
