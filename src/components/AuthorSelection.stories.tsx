import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthorSelection from './AuthorSelection';

const meta: Meta<typeof AuthorSelection> = {
  title: 'Components/AuthorSelection',
  component: AuthorSelection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authors: ['张九龄', '李白', '杜甫', '王维', '孟浩然', '白居易'],
    onSelect: (author: string) => console.log('Selected author:', author),
    onBack: () => console.log('Back clicked'),
  },
};

export const Loading: Story = {
  args: {
    authors: [],
    onSelect: (author: string) => console.log('Selected author:', author),
    onBack: () => console.log('Back clicked'),
  },
};

export const FewAuthors: Story = {
  args: {
    authors: ['李白', '杜甫'],
    onSelect: (author: string) => console.log('Selected author:', author),
    onBack: () => console.log('Back clicked'),
  },
};
