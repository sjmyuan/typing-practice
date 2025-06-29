import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TitleSelection from './TitleSelection';

const mockTitles = ['感遇四首之一', '感遇四首之二', '感遇四首之三'];
const mockAuthor = '张九龄';

describe('TitleSelection', () => {
  it('should render title selection with author name', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={mockTitles} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText(`Select Title by ${mockAuthor}`)).toBeInTheDocument();
  });

  it('should render all titles as buttons', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={mockTitles} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    mockTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('should call onSelect when title is clicked', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={mockTitles} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('感遇四首之二'));
    
    expect(mockOnSelect).toHaveBeenCalledWith('感遇四首之二');
  });

  it('should render back button', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={mockTitles} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('← Back to Authors')).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={mockTitles} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('← Back to Authors'));
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should render loading state when titles array is empty', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={[]} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Loading titles...')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const mockOnSelect = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <TitleSelection 
        author={mockAuthor}
        titles={mockTitles} 
        onSelect={mockOnSelect}
        onBack={mockOnBack}
      />
    );
    
    const titleButtons = screen.getAllByRole('button');
    titleButtons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
