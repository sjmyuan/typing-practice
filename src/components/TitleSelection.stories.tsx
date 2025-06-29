import type { Meta, StoryObj } from '@storybook/react-vite';
import TitleSelection from './TitleSelection';

const meta: Meta<typeof TitleSelection> = {
  title: 'Components/TitleSelection',
  component: TitleSelection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    author: '李白',
    titles: ['月下独酌', '春思', '下终南山过斛斯山人宿置酒', '静夜思', '将进酒'],
    onSelect: (title: string) => console.log('Selected title:', title),
    onBack: () => console.log('Back clicked'),
  },
};

export const Loading: Story = {
  args: {
    author: '张九龄',
    titles: [],
    onSelect: (title: string) => console.log('Selected title:', title),
    onBack: () => console.log('Back clicked'),
  },
};

export const FewTitles: Story = {
  args: {
    author: '杜甫',
    titles: ['望岳', '春望'],
    onSelect: (title: string) => console.log('Selected title:', title),
    onBack: () => console.log('Back clicked'),
  },
};
