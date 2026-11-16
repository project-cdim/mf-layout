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

import { APPPolicies } from '@/types';

import { PolicyEditModal } from '@/components';

const meta = {
  title: 'Components/PolicyEditModal',
  component: PolicyEditModal,
  parameters: {
    PolicyEditModal: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PolicyEditModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Add/Edit Dialog */
export const Standard: Story = {
  args: {
    modalMode: 'add',
    modalClose: () => {},
    submit: () => {},
    inputStatus: undefined,
    error: undefined,
    data: undefined,
  },
};

/** Title 101 characters */
const inputTitle101: APPPolicies = {
  title: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
  category: 'nodeConfigurationPolicy',
  policies: {
    accelerator: { enabled: true, minNum: 1, maxNum: 1 },
    cpu: { enabled: true, minNum: 1, maxNum: 1 },
    dsp: { enabled: false, minNum: 1, maxNum: 1 },
    fpga: { enabled: false, minNum: 1, maxNum: 1 },
    gpu: { enabled: false, minNum: 1, maxNum: 1 },
    memory: { enabled: false, minNum: 1, maxNum: 1 },
    storage: { enabled: false, minNum: 1, maxNum: 1 },
    virtualMedia: { enabled: false, minNum: 1, maxNum: 1 },
    graphicController: { enabled: false, minNum: 1, maxNum: 1 },
    networkInterface: { enabled: false, minNum: 1, maxNum: 1 },
  },
  _checkboxes: true,
};
export const Title101: Story = {
  args: {
    modalMode: 'add',
    modalClose: () => {},
    submit: () => {},
    inputStatus: inputTitle101,
    error: undefined,
    data: undefined,
  },
};
