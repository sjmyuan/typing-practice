import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthorSelection from './AuthorSelection';

const mockAuthors = ['张九龄', '李白', '杜甫'];

describe('AuthorSelection', () => {
  it('should render author selection title', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={mockAuthors} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Select Author')).toBeInTheDocument();
  });

  it('should render all authors as buttons', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={mockAuthors} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    mockAuthors.forEach(author => {
      expect(screen.getByText(author)).toBeInTheDocument();
    });
  });

  it('should call onSelect when author is clicked', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={mockAuthors} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('李白'));
    
    expect(mockOnSelect).toHaveBeenCalledWith('李白');
  });

  it('should render back button', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={mockAuthors} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('← Back to Options')).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={mockAuthors} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('← Back to Options'));
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should render loading state when authors array is empty', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={[]} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Loading authors...')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <AuthorSelection 
        authors={mockAuthors} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    const authorButtons = screen.getAllByRole('button');
    authorButtons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
