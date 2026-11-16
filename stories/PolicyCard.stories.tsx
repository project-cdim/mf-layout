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
