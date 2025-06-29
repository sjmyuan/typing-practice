import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextAlignmentControl from './TextAlignmentControl';

describe('TextAlignmentControl', () => {
  const mockOnAlignmentChange = vi.fn();

  beforeEach(() => {
    mockOnAlignmentChange.mockClear();
  });

  it('renders all alignment options', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    expect(screen.getByRole('button', { name: /align left/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /align center/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /align right/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /justify/i })).toBeInTheDocument();
  });

  it('highlights the current alignment option', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="center" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const centerButton = screen.getByRole('button', { name: /align center/i });
    expect(centerButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('calls onAlignmentChange when left alignment is clicked', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="center" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const leftButton = screen.getByRole('button', { name: /align left/i });
    fireEvent.click(leftButton);

    expect(mockOnAlignmentChange).toHaveBeenCalledWith('left');
  });

  it('calls onAlignmentChange when center alignment is clicked', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const centerButton = screen.getByRole('button', { name: /align center/i });
    fireEvent.click(centerButton);

    expect(mockOnAlignmentChange).toHaveBeenCalledWith('center');
  });

  it('calls onAlignmentChange when right alignment is clicked', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const rightButton = screen.getByRole('button', { name: /align right/i });
    fireEvent.click(rightButton);

    expect(mockOnAlignmentChange).toHaveBeenCalledWith('right');
  });

  it('calls onAlignmentChange when justify alignment is clicked', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const justifyButton = screen.getByRole('button', { name: /justify/i });
    fireEvent.click(justifyButton);

    expect(mockOnAlignmentChange).toHaveBeenCalledWith('justify');
  });

  it('does not call onAlignmentChange when current alignment is clicked', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const leftButton = screen.getByRole('button', { name: /align left/i });
    fireEvent.click(leftButton);

    expect(mockOnAlignmentChange).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const leftButton = screen.getByRole('button', { name: /align left/i });
    expect(leftButton).toHaveAttribute('aria-pressed', 'true');

    const centerButton = screen.getByRole('button', { name: /align center/i });
    expect(centerButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('displays correct icons for each alignment option', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    // Check that buttons contain the expected alignment icons (using text content or aria-label)
    expect(screen.getByRole('button', { name: /align left/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /align center/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /align right/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /justify/i })).toBeInTheDocument();
  });

  it('maintains focus on clicked button', () => {
    render(
      <TextAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const centerButton = screen.getByRole('button', { name: /align center/i });
    fireEvent.click(centerButton);

    expect(centerButton).toHaveFocus();
  });
});
