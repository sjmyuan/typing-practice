import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

    expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
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

    fireEvent.click(screen.getByLabelText('Increase font size'));
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

    fireEvent.click(screen.getByLabelText('Decrease font size'));
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

    const increaseButton = screen.getByLabelText('Increase font size');
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

    const decreaseButton = screen.getByLabelText('Decrease font size');
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

    fireEvent.click(screen.getByLabelText('Increase font size'));
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

    fireEvent.click(screen.getByLabelText('Decrease font size'));
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

    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('A-')).toBeInTheDocument();
  });
});
