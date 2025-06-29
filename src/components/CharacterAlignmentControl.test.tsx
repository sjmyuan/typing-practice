import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterAlignmentControl, { type CharacterAlignment } from './CharacterAlignmentControl';

describe('CharacterAlignmentControl', () => {
  const mockOnAlignmentChange = vi.fn();

  beforeEach(() => {
    mockOnAlignmentChange.mockClear();
  });

  it('renders all alignment options', () => {
    render(
      <CharacterAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    expect(screen.getByRole('radiogroup', { name: /character alignment options/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /left align characters/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /center characters/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /right align characters/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /justify characters/i })).toBeInTheDocument();
  });

  it('shows the current alignment as selected', () => {
    render(
      <CharacterAlignmentControl 
        currentAlignment="center" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const centerButton = screen.getByRole('radio', { name: /center characters/i });
    expect(centerButton).toHaveAttribute('aria-checked', 'true');
    expect(centerButton).toHaveAttribute('aria-pressed', 'true');
    expect(centerButton).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('calls onAlignmentChange when a different alignment is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CharacterAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const rightButton = screen.getByRole('radio', { name: /right align characters/i });
    await user.click(rightButton);

    expect(mockOnAlignmentChange).toHaveBeenCalledWith('right');
  });

  it('handles all alignment options correctly', async () => {
    const user = userEvent.setup();
    const alignmentOptions: { alignment: CharacterAlignment; pattern: RegExp }[] = [
      { alignment: 'left', pattern: /left align characters/i },
      { alignment: 'center', pattern: /center characters/i },
      { alignment: 'right', pattern: /right align characters/i },
      { alignment: 'justify', pattern: /justify characters/i }
    ];

    for (const { alignment, pattern } of alignmentOptions) {
      mockOnAlignmentChange.mockClear();
      
      const { unmount } = render(
        <CharacterAlignmentControl 
          currentAlignment="left" 
          onAlignmentChange={mockOnAlignmentChange} 
        />
      );

      const button = screen.getByRole('radio', { name: pattern });
      await user.click(button);

      expect(mockOnAlignmentChange).toHaveBeenCalledWith(alignment);
      
      unmount();
    }
  });

  it('has proper keyboard accessibility', async () => {
    const user = userEvent.setup();
    render(
      <CharacterAlignmentControl 
        currentAlignment="left" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const centerButton = screen.getByRole('radio', { name: /center characters/i });
    
    // Focus the button directly
    centerButton.focus();
    expect(centerButton).toHaveFocus();

    // Press Enter/Space to activate
    await user.keyboard('{Enter}');
    expect(mockOnAlignmentChange).toHaveBeenCalledWith('center');
  });

  it('has proper ARIA attributes', () => {
    render(
      <CharacterAlignmentControl 
        currentAlignment="justify" 
        onAlignmentChange={mockOnAlignmentChange} 
      />
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'Character alignment options');

    const justifyButton = screen.getByRole('radio', { name: /justify characters/i });
    expect(justifyButton).toHaveAttribute('aria-checked', 'true');
    expect(justifyButton).toHaveAttribute('aria-pressed', 'true');
    expect(justifyButton).toHaveAttribute('role', 'radio');
  });
});
