import type { Meta, StoryObj } from '@storybook/react-vite';
import ContentPreview from './ContentPreview';

const meta: Meta<typeof ContentPreview> = {
  title: 'Components/ContentPreview',
  component: ContentPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    poem: {
      num: 1,
      author: '李白',
      title: '月下独酌',
      text: '花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。\n月既不解饮，影徒随我身。\n暂伴月将影，行乐须及春。\n我歌月徘徊，我舞影零乱。\n醒时同交欢，醉后各分散。\n永结无情游，相期邈云汉。'
    },
    onStart: (text: string) => console.log('Start practice with:', text),
    onBack: () => console.log('Back clicked'),
  },
};

export const ShortPoem: Story = {
  args: {
    poem: {
      num: 2,
      author: '王维',
      title: '鹿柴',
      text: '空山不见人，但闻人语响。\n返景入深林，复照青苔上。'
    },
    onStart: (text: string) => console.log('Start practice with:', text),
    onBack: () => console.log('Back clicked'),
  },
};

export const LongTitle: Story = {
  args: {
    poem: {
      num: 3,
      author: '李白',
      title: '下终南山过斛斯山人宿置酒',
      text: '暮从碧山下，山月随人归，\n却顾所来径，苍苍横翠微。\n相携及田家，童稚开荆扉。\n绿竹入幽径，青萝拂行衣。\n欢言得所憩，美酒聊共挥。\n长歌吟松风，曲尽河星稀。\n我醉君复乐，陶然共忘机。'
    },
    onStart: (text: string) => console.log('Start practice with:', text),
    onBack: () => console.log('Back clicked'),
  },
};
