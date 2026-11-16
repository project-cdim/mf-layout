/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

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
