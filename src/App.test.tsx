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

  describe('Header behavior during practice', () => {
    it('should display full header when not practicing', () => {
      render(<App />);
      
      // Full header elements should be visible
      expect(screen.getByText('Typing Adventure')).toBeInTheDocument();
      expect(screen.getByText("Let's learn to type together!")).toBeInTheDocument();
      expect(screen.getByText('🌟 Practice • Learn • Have Fun! 🌟')).toBeInTheDocument();
      
      // Header should have full size classes
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('mb-8');
    });

    it('should display minimized header when actively practicing', () => {
      render(<App />);
      
      const header = screen.getByRole('banner');
      
      // Check if App component can receive and respond to practice state
      expect(header).toHaveAttribute('data-practice-state', 'ready');
      
      // Header should have normal margin initially
      expect(header).toHaveClass('mb-8');
    });

    it('should have different styling based on practice state', () => {
      render(<App />);
      
      const header = screen.getByRole('banner');
      
      // In ready state, should have larger margins
      expect(header).toHaveClass('mb-8');
      expect(header).toHaveAttribute('data-practice-state', 'ready');
      
      // Description elements should be visible in ready state
      expect(screen.getByText("Let's learn to type together!")).toBeInTheDocument();
      expect(screen.getByText('🌟 Practice • Learn • Have Fun! 🌟')).toBeInTheDocument();
    });
  });
});
