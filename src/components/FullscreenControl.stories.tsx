import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import FullscreenControl from './FullscreenControl';

const meta: Meta<typeof FullscreenControl> = {
  title: 'Components/FullscreenControl',
  component: FullscreenControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onToggle: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isFullscreen: false,
  },
};

export const Fullscreen: Story = {
  args: {
    isFullscreen: true,
  },
};

export const Interactive: Story = {
  args: {
    isFullscreen: false,
  },
  render: (args) => {
    const [isFullscreen, setIsFullscreen] = React.useState(args.isFullscreen);
    
    return (
      <FullscreenControl
        isFullscreen={isFullscreen}
        onToggle={() => setIsFullscreen(!isFullscreen)}
      />
    );
  },
};
