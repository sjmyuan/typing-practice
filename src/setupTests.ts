import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Define interface for interpolation options
interface InterpolationOptions {
  accuracy?: number;
  author?: string;
  typedCount?: number;
  totalCount?: number;
  percentage?: number;
}

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string, options?: InterpolationOptions) => {
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
        const objValue = defaultValue as InterpolationOptions;
        if (objValue.accuracy !== undefined) {
          return `Final Accuracy: ${objValue.accuracy}%`;
        }
        if (objValue.author !== undefined) {
          return `Select Title by ${objValue.author}`;
        }
        if (objValue.typedCount !== undefined && objValue.totalCount !== undefined) {
          return `${objValue.typedCount}/${objValue.totalCount} characters`;
        }
        if (objValue.percentage !== undefined) {
          return `Accuracy: ${objValue.percentage}%`;
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
