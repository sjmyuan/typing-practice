import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TypingArea from './TypingArea';

describe('TypingArea - Fullscreen', () => {
  const mockOnComplete = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fullscreen control button', () => {
    render(
      <TypingArea
        prompt="Hello world"
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    );
    
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen.enterFullscreen/i });
    expect(fullscreenButton).toBeInTheDocument();
  });

  it('toggles fullscreen mode when fullscreen button is clicked', () => {
    render(
      <TypingArea
        prompt="Hello world"
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    );
    
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen.enterFullscreen/i });
    fireEvent.click(fullscreenButton);
    
    const exitFullscreenButton = screen.getByRole('button', { name: /fullscreen.exitFullscreen/i });
    expect(exitFullscreenButton).toBeInTheDocument();
  });

  it('applies fullscreen styles when in fullscreen mode', () => {
    render(
      <TypingArea
        prompt="Hello world"
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    );
    
    const container = screen.getByRole('textbox');
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen.enterFullscreen/i });
    
    // Should not have fullscreen styles initially
    expect(container).not.toHaveClass('fixed', 'inset-0', 'z-50');
    
    fireEvent.click(fullscreenButton);
    
    // Should have fullscreen styles after clicking
    expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('exits fullscreen mode when escape key is pressed', () => {
    render(
      <TypingArea
        prompt="Hello world"
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    );
    
    const container = screen.getByRole('textbox');
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen.enterFullscreen/i });
    
    // Enter fullscreen mode
    fireEvent.click(fullscreenButton);
    expect(screen.getByRole('button', { name: /fullscreen.exitFullscreen/i })).toBeInTheDocument();
    
    // Press escape key
    fireEvent.keyDown(container, { key: 'Escape' });
    
    // Should exit fullscreen mode
    expect(screen.getByRole('button', { name: /fullscreen.enterFullscreen/i })).toBeInTheDocument();
    expect(container).not.toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('maintains typing functionality in fullscreen mode', () => {
    render(
      <TypingArea
        prompt="Hello"
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    );
    
    const container = screen.getByRole('textbox');
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen.enterFullscreen/i });
    
    // Enter fullscreen mode
    fireEvent.click(fullscreenButton);
    
    // Should still be able to type
    fireEvent.keyDown(container, { key: 'H' });
    
    // Check that progress display shows typed characters
    const progressText = screen.getByText(/progress\.progressLabel/i);
    expect(progressText).toBeInTheDocument();
  });

  it('preserves back button functionality in fullscreen mode', () => {
    render(
      <TypingArea
        prompt="Hello world"
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    );
    
    const fullscreenButton = screen.getByRole('button', { name: /fullscreen.enterFullscreen/i });
    fireEvent.click(fullscreenButton);
    
    const backButton = screen.getByRole('button', { name: /buttons.backToOptions/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
