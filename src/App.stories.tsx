import type { Meta, StoryObj } from '@storybook/react-vite';
import App from './App';

const meta: Meta<typeof App> = {
  title: 'App',
  component: App,
  parameters: {
    layout: 'fullscreen', // Use full screen to see the layout behavior
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLongContent: Story = {
  render: () => (
    <div>
      <App />
      <div className="text-center p-4 text-gray-600">
        👆 The app container now expands to fit content instead of being constrained to screen height
      </div>
    </div>
  ),
};
