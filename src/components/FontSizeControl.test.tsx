import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FontSizeControl from './FontSizeControl';

describe('FontSizeControl', () => {
  const mockOnIncrease = vi.fn();
  const mockOnDecrease = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders increase and decrease buttons', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={true}
        canDecrease={true}
      />
    );

    expect(screen.getByLabelText('labels.increaseFontSize')).toBeInTheDocument();
    expect(screen.getByLabelText('labels.decreaseFontSize')).toBeInTheDocument();
  });

  it('calls onIncrease when increase button is clicked', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={true}
        canDecrease={true}
      />
    );

    fireEvent.click(screen.getByLabelText('labels.increaseFontSize'));
    expect(mockOnIncrease).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrease when decrease button is clicked', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={true}
        canDecrease={true}
      />
    );

    fireEvent.click(screen.getByLabelText('labels.decreaseFontSize'));
    expect(mockOnDecrease).toHaveBeenCalledTimes(1);
  });

  it('disables increase button when canIncrease is false', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={false}
        canDecrease={true}
      />
    );

    const increaseButton = screen.getByLabelText('labels.increaseFontSize');
    expect(increaseButton).toBeDisabled();
  });

  it('disables decrease button when canDecrease is false', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={true}
        canDecrease={false}
      />
    );

    const decreaseButton = screen.getByLabelText('labels.decreaseFontSize');
    expect(decreaseButton).toBeDisabled();
  });

  it('does not call onIncrease when button is disabled', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={false}
        canDecrease={true}
      />
    );

    fireEvent.click(screen.getByLabelText('labels.increaseFontSize'));
    expect(mockOnIncrease).not.toHaveBeenCalled();
  });

  it('does not call onDecrease when button is disabled', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={true}
        canDecrease={false}
      />
    );

    fireEvent.click(screen.getByLabelText('labels.decreaseFontSize'));
    expect(mockOnDecrease).not.toHaveBeenCalled();
  });

  it('displays clear labels for accessibility', () => {
    render(
      <FontSizeControl
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        canIncrease={true}
        canDecrease={true}
      />
    );

    expect(screen.getByLabelText('labels.increaseFontSize')).toBeInTheDocument();
    expect(screen.getByLabelText('labels.decreaseFontSize')).toBeInTheDocument();
  });
});
