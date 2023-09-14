import type { Meta, StoryObj } from '@storybook/vue3';
import { vueRouter } from 'storybook-vue3-router';

import Discussion from '../modules/timeline/Discussion.vue';
import router from '@/app/router';

const DiscussionComp = Discussion;

const meta = {
  title: 'Example/Discussion',
  component: DiscussionComp,
  tags: ['autodocs'],
  argTypes: {
    discussion: {
      control: 'object',
    },
  },
  args: {
    productId: 1,
  },
  decorators: [vueRouter([...router.getRoutes()])],
} satisfies Meta<typeof Discussion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    discussion: {
      id: 1,
      type: 'feedback',
      text: "Hi, everyone! Today we have sprint retrospective, so please don't forget to put all of your wonderful insights in the retro board.",
      authorId: 1,
      author: {
        id: 1,
        name: 'Mateus Sarmento',
      },
    },
    productId: 1,
  },
  decorators: [vueRouter([...router.getRoutes()])],
};
