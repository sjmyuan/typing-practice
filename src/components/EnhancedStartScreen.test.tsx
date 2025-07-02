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
    
    expect(screen.getByText(/headings.choosePracticeMode/i)).toBeInTheDocument();
    expect(screen.getByText(/buttons.createYourOwnContent/i)).toBeInTheDocument();
    expect(screen.getByText(/buttons.browseExistingPoems/i)).toBeInTheDocument();
  });

  it('should show custom input form when Create Your Own Content is clicked', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText(/buttons.createYourOwnContent/i));
    
    expect(screen.getByPlaceholderText(/placeholders.enterTextToPractice/i)).toBeInTheDocument();
    expect(screen.getByText(/buttons.startPractice/i)).toBeInTheDocument();
    expect(screen.getByText(/buttons.backToOptions/i)).toBeInTheDocument();
  });

  it('should show poem browser when Browse Existing Poems is clicked', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText(/buttons.browseExistingPoems/i));
    
    // The PoemBrowser will show loading initially
    expect(screen.getByText(/poemBrowser.loadingPoems/i)).toBeInTheDocument();
  });

  it('should navigate back to mode selection from custom input', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText(/buttons.createYourOwnContent/i));
    expect(screen.getByText(/buttons.backToOptions/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/buttons.backToOptions/i));
    expect(screen.getByText(/headings.choosePracticeMode/i)).toBeInTheDocument();
  });

  it('should call onStart when custom input is submitted', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText(/buttons.createYourOwnContent/i));
    
    const textarea = screen.getByPlaceholderText(/placeholders.enterTextToPractice/i);
    fireEvent.change(textarea, { target: { value: 'Test content for typing practice' } });
    
    fireEvent.click(screen.getByText(/buttons.startPractice/i));
    
    expect(mockOnStart).toHaveBeenCalledWith('Test content for typing practice');
  });

  it('should validate custom input', () => {
    render(<EnhancedStartScreen onStart={mockOnStart} />);
    
    fireEvent.click(screen.getByText(/buttons.createYourOwnContent/i));
    
    const textarea = screen.getByPlaceholderText(/placeholders.enterTextToPractice/i);
    fireEvent.change(textarea, { target: { value: 'ab' } }); // Too short
    
    fireEvent.click(screen.getByText(/buttons.startPractice/i));
    
    expect(screen.getByText(/errors.pleaseEnterAtLeast3Characters/i)).toBeInTheDocument();
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
    fireEvent.click(screen.getByText(/buttons.createYourOwnContent/i));
    const textarea = screen.getByPlaceholderText(/placeholders.enterTextToPractice/i);
    fireEvent.change(textarea, { target: { value: 'Some text content' } });
    
    // Go back to mode selection
    fireEvent.click(screen.getByText(/buttons.backToOptions/i));
    expect(screen.getByText(/headings.choosePracticeMode/i)).toBeInTheDocument();
    
    // Go back to custom input - text should be preserved
    fireEvent.click(screen.getByText(/buttons.createYourOwnContent/i));
    expect(textarea).toHaveValue('Some text content');
  });
});
