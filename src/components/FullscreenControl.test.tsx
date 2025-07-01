import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FullscreenControl from './FullscreenControl';

describe('FullscreenControl', () => {
  it('renders enter fullscreen button by default', () => {
    const onToggle = vi.fn();
    render(<FullscreenControl isFullscreen={false} onToggle={onToggle} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toBeInTheDocument();
  });

  it('renders exit fullscreen button when in fullscreen mode', () => {
    const onToggle = vi.fn();
    render(<FullscreenControl isFullscreen={true} onToggle={onToggle} />);
    
    const button = screen.getByRole('button', { name: /exit fullscreen/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onToggle when button is clicked', () => {
    const onToggle = vi.fn();
    render(<FullscreenControl isFullscreen={false} onToggle={onToggle} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    fireEvent.click(button);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    const onToggle = vi.fn();
    render(<FullscreenControl isFullscreen={false} onToggle={onToggle} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Enter fullscreen mode');
  });

  it('shows correct accessibility label for exit fullscreen', () => {
    const onToggle = vi.fn();
    render(<FullscreenControl isFullscreen={true} onToggle={onToggle} />);
    
    const button = screen.getByRole('button', { name: /exit fullscreen/i });
    expect(button).toHaveAttribute('aria-label', 'Exit fullscreen mode');
  });

  it('has proper focus styling', () => {
    const onToggle = vi.fn();
    render(<FullscreenControl isFullscreen={false} onToggle={onToggle} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });
});
