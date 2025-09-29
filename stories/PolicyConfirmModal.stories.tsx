import type { Meta, StoryObj } from '@storybook/react';
import { PolicyConfirmModal } from '@/components';
import { Card } from '@mantine/core';

const meta = {
  title: 'Components/PolicyConfirmModal',
  component: PolicyConfirmModal,
  tags: ['autodocs'],
  argTypes: {
    modalMode: {
      options: ['delete', 'enable', 'disable', 'edit', 'add', undefined],
      control: 'select',
      description: 'The only patterns that exist are `delete` `enable` and `disable`.',
    },
    selectedPolicyId: { type: 'string' },
    policyTitle: { type: 'string' },
    modalClose: () => null,
    submit: () => null,
    // error: AxiosError<APIPolicyError> | undefined;
    // data?: APIPolicies;
  },
  args: {},
  decorators: [
    (Story) => (
      <Card withBorder>
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof PolicyConfirmModal>;

export default meta;

type Story = StoryObj<typeof PolicyConfirmModal>;

export const Delete: Story = {
  args: {
    modalMode: 'delete',
  },
};
export const Enable: Story = {
  args: {
    modalMode: 'enable',
  },
};
export const Disable: Story = {
  args: {
    modalMode: 'disable',
  },
};
