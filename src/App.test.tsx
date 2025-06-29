import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Layout', () => {
  it('should render without height constraints that prevent content expansion', () => {
    render(<App />);
    
    // The root container should not have h-screen class that constrains height
    const rootContainer = document.querySelector('.h-screen');
    expect(rootContainer).toBeNull();
  });

  it('should have minimum height to maintain appearance for short content', () => {
    render(<App />);
    
    // The container should have min-h-screen for minimum height
    const container = screen.getByRole('main').closest('.container');
    expect(container?.parentElement).toHaveClass('min-h-screen');
  });

  it('should render header and main content areas', () => {
    render(<App />);
    
    // Header should be present
    expect(screen.getByText('Typing Adventure')).toBeInTheDocument();
    
    // Main content area should be present
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
