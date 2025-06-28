import type { Meta, StoryObj } from '@storybook/react-vite';
import FontSizeControl from './FontSizeControl';

const meta: Meta<typeof FontSizeControl> = {
  title: 'Components/FontSizeControl',
  component: FontSizeControl,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onIncrease: { action: 'increase' },
    onDecrease: { action: 'decrease' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canIncrease: true,
    canDecrease: true,
  },
};

export const CannotIncrease: Story = {
  args: {
    canIncrease: false,
    canDecrease: true,
  },
};

export const CannotDecrease: Story = {
  args: {
    canIncrease: true,
    canDecrease: false,
  },
};

export const AllDisabled: Story = {
  args: {
    canIncrease: false,
    canDecrease: false,
  },
};
