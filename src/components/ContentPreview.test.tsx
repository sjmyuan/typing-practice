import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContentPreview from './ContentPreview';
import type { TangPoem } from '../utils/tangPoemsUtils';

const mockPoem: TangPoem = {
  num: 1,
  author: '李白',
  title: '月下独酌',
  text: '花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。\n月既不解饮，影徒随我身。'
};

describe('ContentPreview', () => {
  it('should render poem title and author', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText(mockPoem.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockPoem.author}`)).toBeInTheDocument();
  });

  it('should render poem content with line breaks', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    // Check that each line is rendered
    expect(screen.getByText('花间一壶酒，独酌无相亲。')).toBeInTheDocument();
    expect(screen.getByText('举杯邀明月，对影成三人。')).toBeInTheDocument();
    expect(screen.getByText('月既不解饮，影徒随我身。')).toBeInTheDocument();
  });

  it('should render start practice button', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
  });

  it('should call onStart with poem text when start button is clicked', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('Start Practice'));
    
    expect(mockOnStart).toHaveBeenCalledWith(mockPoem.text);
  });

  it('should render back button', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('← Back to Titles')).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('← Back to Titles'));
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={mockPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('should handle empty poem text gracefully', () => {
    const emptyPoem = { ...mockPoem, text: '' };
    const mockOnStart = vi.fn();
    const mockOnBack = vi.fn();
    
    render(
      <ContentPreview 
        poem={emptyPoem}
        onStart={mockOnStart}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText(emptyPoem.title)).toBeInTheDocument();
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
  });
});
