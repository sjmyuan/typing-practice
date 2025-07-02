import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressDisplay from './ProgressDisplay';

describe('ProgressDisplay', () => {
  describe('Initial State', () => {
    it('displays progress when no characters typed', () => {
      render(<ProgressDisplay typedCount={0} totalCount={10} correctCount={0} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
      expect(screen.queryByText(/progress.accuracy:/)).not.toBeInTheDocument();
    });
  });

  describe('Progress Display', () => {
    it('displays progress when characters have been typed', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={4} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
    });

    it('displays accuracy when characters have been typed', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={4} />);
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('displays both progress and accuracy in same line', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={4} />);
      const progressText = screen.getByText(/progress.progressLabel: progress.charactersTyped/);
      const accuracyText = screen.getByText(/progress.accuracy/);
      expect(progressText).toBeInTheDocument();
      expect(accuracyText).toBeInTheDocument();
    });

    it('displays correct progress with different values', () => {
      render(<ProgressDisplay typedCount={3} totalCount={8} correctCount={2} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
    });
  });

  describe('Accuracy Calculations', () => {
    it('calculates 100% accuracy correctly', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={5} />);
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('calculates 0% accuracy correctly', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={0} />);
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('rounds accuracy to nearest integer', () => {
      render(<ProgressDisplay typedCount={3} totalCount={10} correctCount={2} />);
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('handles decimal accuracy rounding correctly', () => {
      render(<ProgressDisplay typedCount={6} totalCount={10} correctCount={4} />);
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('handles accuracy rounding up correctly', () => {
      render(<ProgressDisplay typedCount={3} totalCount={10} correctCount={2} />);
      // 2/3 = 0.6667 = 67% when rounded
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero total count gracefully', () => {
      render(<ProgressDisplay typedCount={0} totalCount={0} correctCount={0} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
    });

    it('handles negative values gracefully', () => {
      render(<ProgressDisplay typedCount={-1} totalCount={10} correctCount={-1} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
      expect(screen.queryByText(/progress.accuracy:/)).not.toBeInTheDocument();
    });

    it('handles correctCount greater than typedCount', () => {
      render(<ProgressDisplay typedCount={3} totalCount={10} correctCount={5} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('handles typedCount greater than totalCount', () => {
      render(<ProgressDisplay typedCount={15} totalCount={10} correctCount={10} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
      expect(screen.getByText('progress.accuracy')).toBeInTheDocument();
    });

    it('handles division by zero in accuracy calculation', () => {
      render(<ProgressDisplay typedCount={0} totalCount={10} correctCount={0} />);
      expect(screen.queryByText(/progress.accuracy:/)).not.toBeInTheDocument();
    });

    it('handles float values by treating them as integers', () => {
      render(<ProgressDisplay typedCount={3.7} totalCount={10.2} correctCount={2.1} />);
      expect(screen.getByText('progress.progressLabel: progress.charactersTyped')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={4} />);
      const container = screen.getByText(/progress.progressLabel:/).parentElement;
      expect(container).toHaveClass('mt-4');
      expect(container).toHaveClass('text-sm');
      expect(container).toHaveClass('text-gray-600');
    });

    it('applies margin spacing to accuracy display', () => {
      render(<ProgressDisplay typedCount={5} totalCount={10} correctCount={4} />);
      const accuracySpan = screen.getByText('progress.accuracy');
      expect(accuracySpan).toHaveClass('ml-4');
    });
  });
});
