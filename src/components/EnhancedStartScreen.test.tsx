import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EnhancedStartScreen from './EnhancedStartScreen';

describe('EnhancedStartScreen', () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render mode selection options by default', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
    expect(screen.getByText('Create Your Own Content')).toBeInTheDocument();
    expect(screen.getByText('Browse Existing Poems')).toBeInTheDocument();
  });

  it('should show custom input form when Create Your Own Content is clicked', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText('Create Your Own Content'));
    
    expect(screen.getByPlaceholderText('Enter the text you want to practice typing...')).toBeInTheDocument();
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
    expect(screen.getByText('← Back to Options')).toBeInTheDocument();
  });

  it('should show poem browser when Browse Existing Poems is clicked', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText('Browse Existing Poems'));
    
    // The PoemBrowser will show loading initially
    expect(screen.getByText('Loading poems...')).toBeInTheDocument();
  });

  it('should navigate back to mode selection from custom input', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText('Create Your Own Content'));
    expect(screen.getByText('← Back to Options')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('← Back to Options'));
    expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
  });

  it('should call onStart when custom input is submitted', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText('Create Your Own Content'));
    
    const textarea = screen.getByPlaceholderText('Enter the text you want to practice typing...');
    fireEvent.change(textarea, { target: { value: 'Test content for typing practice' } });
    
    fireEvent.click(screen.getByText('Start Practice'));
    
    expect(mockOnStart).toHaveBeenCalledWith('Test content for typing practice');
  });

  it('should validate custom input', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText('Create Your Own Content'));
    
    const textarea = screen.getByPlaceholderText('Enter the text you want to practice typing...');
    fireEvent.change(textarea, { target: { value: 'ab' } }); // Too short
    
    fireEvent.click(screen.getByText('Start Practice'));
    
    expect(screen.getByText('Please enter at least 3 characters.')).toBeInTheDocument();
    expect(mockOnStart).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('should maintain state when switching between modes', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    // Go to custom input and enter text
    fireEvent.click(screen.getByText('Create Your Own Content'));
    const textarea = screen.getByPlaceholderText('Enter the text you want to practice typing...');
    fireEvent.change(textarea, { target: { value: 'Some text content' } });
    
    // Go back to mode selection
    fireEvent.click(screen.getByText('← Back to Options'));
    expect(screen.getByText('Choose Practice Mode')).toBeInTheDocument();
    
    // Go back to custom input - text should be preserved
    fireEvent.click(screen.getByText('Create Your Own Content'));
    expect(textarea).toHaveValue('Some text content');
  });
});
