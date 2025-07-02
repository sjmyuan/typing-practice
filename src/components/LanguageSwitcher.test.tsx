import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn()
}));

const mockUseTranslation = vi.mocked(useTranslation);

describe('LanguageSwitcher', () => {
  const mockChangeLanguage = vi.fn();
  const mockT = vi.fn((key: string) => key) as any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage
      } as any,
      t: mockT,
      ready: true
    } as any);
  });

  it('renders language selector with correct options', () => {
    render(<LanguageSwitcher />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('aria-label', 'common.language');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue('en');
    expect(options[0]).toHaveTextContent('English');
    expect(options[1]).toHaveValue('zh');
    expect(options[1]).toHaveTextContent('中文');
  });

  it('displays current language as selected', () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: 'zh',
        changeLanguage: mockChangeLanguage
      } as any,
      t: mockT,
      ready: true
    } as any);

    render(<LanguageSwitcher />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('zh');
  });

  it('calls changeLanguage when option is selected', () => {
    render(<LanguageSwitcher />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'zh' } });
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('zh');
  });

  it('renders globe icon', () => {
    render(<LanguageSwitcher />);
    
    const globeIcon = screen.getByRole('combobox').parentElement?.querySelector('svg');
    expect(globeIcon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<LanguageSwitcher className="custom-class" />);
    
    const container = screen.getByRole('combobox').closest('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LanguageSwitcher />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-label', 'common.language');
    
    const globeIcon = select.parentElement?.querySelector('svg');
    expect(globeIcon).toHaveAttribute('aria-hidden', 'true');
  });
});
