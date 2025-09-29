import type { Meta, StoryObj } from '@storybook/react';
import { PolicyCard } from '@/components';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';

/** FIXME : How can i change permission of luigi. */
const meta = {
  title: 'Components/PolicyCard',
  component: PolicyCard,
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
  args: {
    loading: false,
    policy: dummyPolicy.policies[0],
    functions: {
      deletePolicy: () => alert('deletePolicy'),
      enablePolicy: () => alert('enablePolicy'),
      disablePolicy: () => alert('disablePolicy'),
      editPolicy: () => alert('editPolicy'),
    },
  },
} satisfies Meta<typeof PolicyCard>;

export default meta;

type Story = StoryObj<typeof PolicyCard>;

export const demo0: Story = {
  args: {
    policy: dummyPolicy.policies[0],
  },
};

export const demo1: Story = {
  args: {
    policy: dummyPolicy.policies[1],
  },
};
export const demo2: Story = {
  args: {
    policy: dummyPolicy.policies[2],
  },
};
export const demo3: Story = {
  args: {
    policy: dummyPolicy.policies[3],
  },
};
export const demo4: Story = {
  args: {
    policy: dummyPolicy.policies[4],
  },
};
