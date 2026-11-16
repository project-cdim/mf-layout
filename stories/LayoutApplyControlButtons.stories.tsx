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

import { LayoutApplyControlButtons } from '@/components';

const meta = {
  title: 'Components/LayoutApplyControlButtons',
  component: LayoutApplyControlButtons,
  argTypes: {
    phaseText: {
      control: 'select',
      options: ['Apply', 'Rollback', ''],
    },
    statusText: {
      control: 'select',
      options: ['In Progress', 'Completed', 'Failed', 'Suspended.status', 'Canceling', 'Canceled.completed', ''],
    },
    activeButtons: {
      control: 'check',
      options: ['Cancel', 'Rollback', 'Forced Termination', 'Resume'],
    },
  },
  args: {
    handleCancel: () => alert('handleCancel'),
    handleFailed: () => alert('handleFailed'),
    handleResume: () => alert('handleResume'),
    handleRollback: () => alert('handleRollback'),
    phaseText: '',
    statusText: '',
    activeButtons: [],
  },
} satisfies Meta<typeof LayoutApplyControlButtons>;

export default meta;
type Story = StoryObj<typeof LayoutApplyControlButtons>;

/** Display on the loading */
export const Loading: Story = {
  args: {
    phaseText: '',
    statusText: '',
    // activeButtons: ['Cancel', 'Rollback', 'Forced Termination', 'Resume'],
  },
};

export const Apply_InProgress: Story = {
  args: {
    phaseText: 'Apply',
    statusText: 'In Progress',
    activeButtons: ['Cancel'],
  },
};

export const Apply_Completed: Story = {
  args: {
    phaseText: 'Apply',
    statusText: 'Completed',
  },
};

export const Apply_Failed: Story = {
  args: {
    phaseText: 'Apply',
    statusText: 'Failed',
  },
};

export const Apply_Suspended: Story = {
  args: {
    phaseText: 'Apply',
    statusText: 'Suspended.status',
    activeButtons: ['Forced Termination', 'Resume'],
  },
};

export const Apply_Canceling: Story = {
  args: {
    phaseText: 'Apply',
    statusText: 'Canceling',
  },
};

export const Apply_Canceled: Story = {
  args: {
    phaseText: 'Apply',
    statusText: 'Canceled.completed',
  },
};

export const Rollback_InProgress: Story = {
  args: {
    phaseText: 'Rollback',
    statusText: 'In Progress',
    activeButtons: ['Forced Termination'],
  },
};

export const Rollback_Completed: Story = {
  args: {
    phaseText: 'Rollback',
    statusText: 'Completed',
  },
};

export const Rollback_Failed: Story = {
  args: {
    phaseText: 'Rollback',
    statusText: 'Failed',
  },
};

export const Rollback_Suspended: Story = {
  args: {
    phaseText: 'Rollback',
    statusText: 'Suspended.status',
    activeButtons: ['Forced Termination', 'Resume'],
  },
};

export const Rollback_Canceling: Story = {
  args: {
    phaseText: 'Rollback',
    statusText: 'Canceling',
  },
};

export const Rollback_Canceled: Story = {
  args: {
    phaseText: 'Rollback',
    statusText: 'Canceled.completed',
  },
};
