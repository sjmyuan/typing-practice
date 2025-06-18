import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypingCursor from './TypingCursor';

describe('TypingCursor', () => {
  describe('Visibility', () => {
    it('renders cursor when visible is true', () => {
      render(<TypingCursor visible={true} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toBeInTheDocument();
    });

    it('does not render cursor when visible is false', () => {
      render(<TypingCursor visible={false} />);
      const cursor = screen.queryByTestId('cursor');
      expect(cursor).not.toBeInTheDocument();
    });

    it('does not render cursor when visible is undefined', () => {
      render(<TypingCursor visible={undefined as any} />);
      const cursor = screen.queryByTestId('cursor');
      expect(cursor).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes for cursor appearance', () => {
      render(<TypingCursor visible={true} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toHaveClass('absolute');
      expect(cursor).toHaveClass('top-0');
      expect(cursor).toHaveClass('left-0');
      expect(cursor).toHaveClass('animate-pulse');
      expect(cursor).toHaveClass('bg-blue-500');
      expect(cursor).toHaveClass('w-0.5');
      expect(cursor).toHaveClass('h-full');
      expect(cursor).toHaveClass('shadow-lg');
    });

    it('has correct animation style', () => {
      render(<TypingCursor visible={true} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toHaveStyle({
        animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      });
    });

    it('has aria-hidden attribute for accessibility', () => {
      render(<TypingCursor visible={true} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles null visible prop gracefully', () => {
      render(<TypingCursor visible={null as any} />);
      const cursor = screen.queryByTestId('cursor');
      expect(cursor).not.toBeInTheDocument();
    });

    it('handles string visible prop gracefully', () => {
      render(<TypingCursor visible={'true' as any} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toBeInTheDocument();
    });

    it('handles number visible prop gracefully', () => {
      render(<TypingCursor visible={1 as any} />);
      const cursor = screen.getByTestId('cursor');
      expect(cursor).toBeInTheDocument();
    });

    it('handles zero visible prop gracefully', () => {
      render(<TypingCursor visible={0 as any} />);
      const cursor = screen.queryByTestId('cursor');
      expect(cursor).not.toBeInTheDocument();
    });
  });
});
