import type { Meta, StoryObj } from '@storybook/react-vite';
import CharacterAlignmentControl from './CharacterAlignmentControl';

const meta: Meta<typeof CharacterAlignmentControl> = {
  title: 'Components/CharacterAlignmentControl',
  component: CharacterAlignmentControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentAlignment: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Current character alignment setting',
    },
  },
  args: {
    onAlignmentChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentAlignment: 'left',
  },
};

export const LeftAligned: Story = {
  args: {
    currentAlignment: 'left',
  },
};

export const CenterAligned: Story = {
  args: {
    currentAlignment: 'center',
  },
};

export const RightAligned: Story = {
  args: {
    currentAlignment: 'right',
  },
};

export const JustifyAligned: Story = {
  args: {
    currentAlignment: 'justify',
  },
};

export const Interactive: Story = {
  args: {
    currentAlignment: 'left',
  },
};
