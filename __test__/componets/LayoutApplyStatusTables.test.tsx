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

import { screen, within } from '@testing-library/react';
import { useLocale } from 'next-intl';

import { render } from '@/shared-modules/__test__/test-utils';

import { StatusTables } from '@/components';

import { useLayoutApplyDetail } from '@/utils/hooks';

jest.mock('@/utils/hooks/useLayoutApplyDetail', () => ({
  __esModule: true,
  useLayoutApplyDetail: jest.fn(),
}));

jest.mock('@tabler/icons-react', () => ({
  ...jest.requireActual('@tabler/icons-react'),
  IconAlertCircleFilled: () => <div data-testid='mockIconForFailed'></div>,
  IconCheck: () => <div data-testid='mockIconForCompleted'></div>,
  IconX: () => <div data-testid='mockIconForCanceled'></div>,
  IconPlayerPause: () => <div data-testid='mockIconForSuspended'></div>,
}));

describe('LayoutApplyStatusTables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocale as jest.Mock).mockReturnValue('ja');
  });

  test('apply was completed without rollback', () => {
    const started = '2024/11/12 11:04:50';
    const suspended = '2024/11/12 11:05:37';
    const resumed = '2024/11/12 11:06:28';
    const ended = '2024/11/12 11:08:17';
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: 'xxxxxxxxxx',
        apply: {
          status: 'COMPLETED',
          startedAt: new Date(started),
          suspendedAt: new Date(suspended),
          resumedAt: new Date(resumed),
          endedAt: new Date(ended),
        },
      },
      isValidating: false,
    });

    render(<StatusTables />);
    expect(screen.getByText('Apply Status')).toBeInTheDocument();
    // Get Apply Status table
    const applyTable = screen.getAllByRole('table')[0];
    expect(applyTable).toBeInTheDocument();
    // Get elements in the Apply Status table
    const withinApplyTable = within(applyTable);
    expect(withinApplyTable.getByTestId('mockIconForCompleted')).toBeVisible();
    expect(withinApplyTable.getByText('Completed')).toBeInTheDocument();
    expect(withinApplyTable.getByText('Started')).toBeInTheDocument();
    expect(withinApplyTable.getByText(started)).toBeInTheDocument();
    expect(withinApplyTable.getByText('Suspended.at')).toBeInTheDocument();
    expect(withinApplyTable.getByText(suspended)).toBeInTheDocument();
    expect(withinApplyTable.getByText('Resume Requested')).toBeInTheDocument();
    expect(withinApplyTable.getByText(resumed)).toBeInTheDocument();
    // Canceled is not displayed in the row
    expect(withinApplyTable.queryByText('Cancel Requested')).not.toBeInTheDocument();
    expect(withinApplyTable.getByText('Ended')).toBeInTheDocument();
    expect(withinApplyTable.getByText(ended)).toBeInTheDocument();

    // Rollback
    const rollbackTitle = screen.getByText('Rollback Status');
    expect(rollbackTitle).toBeInTheDocument();
    // Background is gray
    expect(rollbackTitle.nextSibling).toHaveStyle({ backgroundColor: 'f0f0f0' });
    // Get Rollback Status Table
    const rollbackTable = screen.getAllByRole('table')[1];
    expect(rollbackTable).toBeInTheDocument();
    const withinRollbackTable = within(rollbackTable);
    // Status, Started, Ended are displayed
    expect(withinRollbackTable.getByText('Status')).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Started')).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Ended')).toBeInTheDocument();
    // Canceled, Suspended, Resumed are not displayed
    expect(withinRollbackTable.queryByText('Cancel Requested')).not.toBeInTheDocument();
    expect(withinRollbackTable.queryByText('Suspended.at')).not.toBeInTheDocument();
    expect(withinRollbackTable.queryByText('Resume Requested')).not.toBeInTheDocument();
  });

  test('apply was canceled with rollback', () => {
    const applyStarted = '2024/11/12 11:04:50';
    const applyCanceled = '2024/11/12 11:06:28';

    const rollbackStarted = '2024/11/12 11:06:50';
    const rollbackSuspended = '2024/11/12 11:07:37';
    const rollbackResumed = '2024/11/12 11:09:28';
    const rollbackEnded = '2024/11/12 11:12:17';

    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: 'xxxxxxxxxx',
        apply: {
          status: 'CANCELED',
          startedAt: new Date(applyStarted),
          canceledAt: new Date(applyCanceled),
        },
        rollback: {
          status: 'COMPLETED',
          startedAt: new Date(rollbackStarted),
          suspendedAt: new Date(rollbackSuspended),
          resumedAt: new Date(rollbackResumed),
          endedAt: new Date(rollbackEnded),
        },
      },
      isValidating: false,
    });

    render(<StatusTables />);
    const applyTitle = screen.getByText('Apply Status');
    expect(applyTitle).toBeInTheDocument();
    // Get Apply Status table
    const applyTable = screen.getAllByRole('table')[0];
    expect(applyTable).toBeInTheDocument();

    // Get elements in the Apply Status table
    const withinApplyTable = within(applyTable);
    expect(withinApplyTable.getByTestId('mockIconForCanceled')).toBeVisible();
    expect(withinApplyTable.getByText('Started')).toBeInTheDocument();
    expect(withinApplyTable.getByText(applyStarted)).toBeInTheDocument();
    expect(withinApplyTable.getByText('Cancel Requested')).toBeInTheDocument();
    expect(withinApplyTable.getByText(applyCanceled)).toBeInTheDocument();
    // Suspended, Resumed are not displayed
    expect(withinApplyTable.queryByText('Suspended.at')).not.toBeInTheDocument();
    expect(withinApplyTable.queryByText('Resume Requested')).not.toBeInTheDocument();
    // Ended is displayed
    expect(withinApplyTable.getByText('Ended')).toBeInTheDocument();

    // Rollback
    const rollbackTitle = screen.getByText('Rollback Status');
    expect(rollbackTitle).toBeInTheDocument();
    // Background is not gray
    expect(rollbackTitle.nextSibling).not.toHaveStyle({ backgroundColor: '#f0f0f0' });

    // Get Rollback Status Table
    const rollbackTable = screen.getAllByRole('table')[1];
    expect(rollbackTable).toBeInTheDocument();
    const withinRollbackTable = within(rollbackTable);
    expect(withinRollbackTable.getByText('Completed')).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Started')).toBeInTheDocument();
    expect(withinRollbackTable.getByText(rollbackStarted)).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Suspended.at')).toBeInTheDocument();
    expect(withinRollbackTable.getByText(rollbackSuspended)).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Resume Requested')).toBeInTheDocument();
    expect(withinRollbackTable.getByText(rollbackResumed)).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Ended')).toBeInTheDocument();
    expect(withinRollbackTable.getByText(rollbackEnded)).toBeInTheDocument();
  });

  test('apply was canceled with rollback, apply had been suspended and resumed', () => {
    const applyStarted = '2024/11/12 11:04:50';
    // Apply was suspended
    const applySuspended = '2024/11/12 11:05:20';
    const applyResumed = '2024/11/12 11:07:20';
    const applyCanceled = '2024/11/12 11:08:28';

    const rollbackStarted = '2024/11/12 11:10:50';
    const rollbackEnded = '2024/11/12 11:12:17';

    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: 'xxxxxxxxxx',
        apply: {
          status: 'CANCELED',
          startedAt: new Date(applyStarted),
          suspendedAt: new Date(applySuspended),
          resumedAt: new Date(applyResumed),
          canceledAt: new Date(applyCanceled),
        },
        rollback: {
          status: 'COMPLETED',
          startedAt: new Date(rollbackStarted),
          endedAt: new Date(rollbackEnded),
        },
      },
      isValidating: false,
    });

    render(<StatusTables />);
    const applyTitle = screen.getByText('Apply Status');
    expect(applyTitle).toBeInTheDocument();
    // Get Apply Status table
    const applyTable = screen.getAllByRole('table')[0];
    expect(applyTable).toBeInTheDocument();

    // Get elements in the Apply Status table
    const withinApplyTable = within(applyTable);
    expect(withinApplyTable.getByTestId('mockIconForCanceled')).toBeVisible();
    expect(withinApplyTable.getByText('Started')).toBeInTheDocument();
    // Display Suspended Row
    expect(withinApplyTable.getByText('Suspended.at')).toBeInTheDocument();
    expect(withinApplyTable.getByText(applyStarted)).toBeInTheDocument();
    // Display Suspended time
    expect(withinApplyTable.getByText('Suspended.at')).toBeInTheDocument();
    expect(withinApplyTable.getByText(applySuspended)).toBeInTheDocument();
    // Display Resumed time
    expect(withinApplyTable.getByText('Resume Requested')).toBeInTheDocument();
    expect(withinApplyTable.getByText(applyResumed)).toBeInTheDocument();
    // Display Canceled time
    expect(withinApplyTable.getByText('Cancel Requested')).toBeInTheDocument();
    expect(withinApplyTable.getByText(applyCanceled)).toBeInTheDocument();
    // Ended is displayed
    expect(withinApplyTable.getByText('Ended')).toBeInTheDocument();

    // Rollback
    const rollbackTitle = screen.getByText('Rollback Status');
    expect(rollbackTitle).toBeInTheDocument();
    // Background is not gray
    expect(rollbackTitle.nextSibling).not.toHaveStyle({ backgroundColor: '#f0f0f0' });

    // Get Rollback Status Table
    const rollbackTable = screen.getAllByRole('table')[1];
    expect(rollbackTable).toBeInTheDocument();
    const withinRollbackTable = within(rollbackTable);
    expect(withinRollbackTable.getByText('Completed')).toBeInTheDocument();
    expect(withinRollbackTable.getByText('Started')).toBeInTheDocument();
    expect(withinRollbackTable.getByText(rollbackStarted)).toBeInTheDocument();
    // Suspended row is not displayed
    expect(withinRollbackTable.queryByText('Suspended.at')).not.toBeInTheDocument();

    // Resumed row is not displayed
    expect(withinRollbackTable.queryByText('Resume Requested')).not.toBeInTheDocument();

    expect(withinRollbackTable.getByText('Ended')).toBeInTheDocument();
    expect(withinRollbackTable.getByText(rollbackEnded)).toBeInTheDocument();
  });
});
