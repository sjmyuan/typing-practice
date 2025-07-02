import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Handle interpolation for testing
      if (typeof options === 'object' && options !== null) {
        if (options.accuracy !== undefined) {
          return `Final Accuracy: ${options.accuracy}%`;
        }
        if (options.author !== undefined) {
          return `Select Title by ${options.author}`;
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
