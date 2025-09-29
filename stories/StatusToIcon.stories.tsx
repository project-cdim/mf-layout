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
import { StatusToIcon } from '@/components/StatusToIcon';
import { Table } from '@mantine/core';
import { Fragment } from 'react';
import { DesignStatus } from '@/types';
import { ApplyProcedureStatus, ApplyStatus, RollbackStatus } from '@/shared-modules/types';

const meta: Meta = {
  title: 'components/StatusToIcon',
  component: StatusToIcon,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['IN_PROGRESS', 'FAILED', 'COMPLETED', 'CANCELING', 'CANCELED', 'SUSPENDED', 'SKIPPED', undefined],
    },
    target: {
      control: 'select',
      options: ['Design', 'Apply', 'Rollback', 'Operation'],
    },
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof StatusToIcon>;

export const Default: Story = {
  args: {
    status: 'IN_PROGRESS',
    target: 'Design',
  },
};

export const List: Story = {
  render: () => {
    const head: ('' | DesignStatus | ApplyStatus | RollbackStatus | ApplyProcedureStatus | undefined)[] = [
      '',
      'IN_PROGRESS',
      'FAILED',
      'COMPLETED',
      'CANCELING',
      'CANCELED',
      'SUSPENDED',
      'SKIPPED',
      undefined,
    ];
    const rows: ('Design' | 'Apply' | 'Rollback' | 'Operation')[] = ['Design', 'Apply', 'Rollback', 'Operation'];
    const body = rows.map((target) =>
      head.map((status) =>
        status === '' ? (
          <Fragment key={`${status}-${target}`}>{target}</Fragment>
        ) : (
          <StatusToIcon status={status} target={target} key={`${status || 'undefined'}-${target}`} />
        )
      )
    );
    return <Table data={{ head: head.map((label) => label ?? 'undefined'), body }} />;
  },
};
