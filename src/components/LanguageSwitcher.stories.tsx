import type { Meta, StoryObj } from '@storybook/react';
import LanguageSwitcher from './LanguageSwitcher';
import '../i18n/config';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A language switcher component that allows users to switch between English and Chinese languages. The selected language is automatically saved to localStorage.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default language switcher with English selected.'
      }
    }
  }
};

export const WithCustomStyling: Story = {
  args: {
    className: 'border rounded-lg p-2 bg-gray-50'
  },
  parameters: {
    docs: {
      description: {
        story: 'Language switcher with custom styling applied.'
      }
    }
  }
};

export const InHeader: Story = {
  args: {
    className: 'text-white'
  },
  decorators: [
    (Story) => (
      <div className="bg-blue-600 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Typing Practice</h1>
          <Story />
        </div>
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Language switcher integrated into a header layout.'
      }
    }
  }
};

export const Compact: Story = {
  args: {
    className: 'text-sm'
  },
  parameters: {
    docs: {
      description: {
        story: 'A more compact version of the language switcher.'
      }
    }
  }
};
