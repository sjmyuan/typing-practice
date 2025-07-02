import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string, options?: any) => {
      // Handle interpolation for testing
      // If options is provided as third parameter
      if (typeof options === 'object' && options !== null) {
        if (options.accuracy !== undefined) {
          return `Final Accuracy: ${options.accuracy}%`;
        }
        if (options.author !== undefined) {
          return `Select Title by ${options.author}`;
        }
        if (options.typedCount !== undefined && options.totalCount !== undefined) {
          return `${options.typedCount}/${options.totalCount} characters`;
        }
        if (options.percentage !== undefined) {
          return `Accuracy: ${options.percentage}%`;
        }
      }
      // If defaultValue is provided and is an object (old format compatibility)
      if (typeof defaultValue === 'object' && defaultValue !== null) {
        if ((defaultValue as any).accuracy !== undefined) {
          return `Final Accuracy: ${(defaultValue as any).accuracy}%`;
        }
        if ((defaultValue as any).author !== undefined) {
          return `Select Title by ${(defaultValue as any).author}`;
        }
        if ((defaultValue as any).typedCount !== undefined && (defaultValue as any).totalCount !== undefined) {
          return `${(defaultValue as any).typedCount}/${(defaultValue as any).totalCount} characters`;
        }
        if ((defaultValue as any).percentage !== undefined) {
          return `Accuracy: ${(defaultValue as any).percentage}%`;
        }
      }
      // If no options or fallback needed, return the key
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn()
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn()
  }
}));
