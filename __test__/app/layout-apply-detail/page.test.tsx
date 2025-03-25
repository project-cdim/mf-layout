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

import React, { act } from 'react';

import { LoadingOverlay } from '@mantine/core';
import { screen, waitFor, within } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { CustomDataTable, MessageBox, PageHeader } from '@/shared-modules/components';
import { useQuery } from '@/shared-modules/utils/hooks';

import { LayoutApplyControlConfirmModal } from '@/components';

import LayoutApplyDetail from '@/app/[lng]/layout-apply-detail/page';
import { dummyUseLayoutApplyDetail as dummyData1 } from '@/utils/dummy-data/layoutApplyDetail/dummyUseLayoutApplyDetail01';
import { dummyUseLayoutApplyDetail as dummyData6 } from '@/utils/dummy-data/layoutApplyDetail/dummyUseLayoutApplyDetail06';
import { useLayoutApplyControlButtons, useLayoutApplyDetail } from '@/utils/hooks';
import { useLayoutApplyControlConfirmModal } from '@/utils/hooks/useLayoutApplyControlConfirmModal';

jest.mock('axios');
jest.mock('next/link');
jest.mock('swr');

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  LoadingOverlay: jest.fn(),
}));

jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useLayoutApplyDetail: jest.fn(),
  useLayoutApplyControlButtons: jest.fn(),
}));

jest.mock('@/utils/hooks/useLayoutApplyControlConfirmModal', () => ({
  useLayoutApplyControlConfirmModal: jest.fn(),
}));

jest.mock('@/components/LayoutApplyControlConfirmModal');
const mockApplyCtrlConfirmModal = jest.fn().mockReturnValue(null);

jest.mock('@/shared-modules/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn(),
  useMSW: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
  CustomDataTable: jest.fn(),
}));

const setResponse = jest.fn();

describe('LayoutApplyDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({ id: '41eb9ce148' });
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: dummyData1.data,
      isValidating: dummyData1.isValidating,
      error: dummyData1.error,
      mutate: jest.fn(),
    });
    (useLayoutApplyControlButtons as jest.Mock).mockReturnValue({
      phaseText: 'Apply',
      statusText: 'In Progress',
      activeButtons: ['Cancel', 'Rollback'],
      handleCancel: jest.fn(),
      handleFailed: jest.fn(),
      handleResume: jest.fn(),
      handleRollback: jest.fn(),
    });
    (LayoutApplyControlConfirmModal as jest.Mock).mockImplementation(mockApplyCtrlConfirmModal);
    (useLayoutApplyControlConfirmModal as jest.Mock).mockReturnValue({
      open: jest.fn(),
      setAction: jest.fn(),
      setSubmitFunction: jest.fn(),
      setError: jest.fn(),
      response: true,
      setResponse: setResponse,
      successMessage: 'Requested "Cancel" the layout apply',
      modalProps: {
        close: jest.fn(),
        submitFunction: jest.fn(),
        id: '41eb9ce148',
        isOpen: true,
        confirmTitle: 'Apply Cancel',
        confirmMessage: 'Do you want to "Cancel" the layout apply?',
        submitButtonLabel: 'Yes',
        cancelButtonLabel: 'No',
        errorTitle: undefined,
        error: undefined,
      },
    });
  });

  test('Ensure the PageHeader receives the correct title and breadcrumb list', () => {
    render(<LayoutApplyDetail />);

    const givenProps = (PageHeader as jest.Mock).mock.lastCall[0];
    const mutate = givenProps.mutate;
    mutate();
    expect(givenProps.pageTitle).toBe('Layout Apply Details');
    expect(givenProps.items).toEqual([
      { title: 'Layout Management' },
      { title: 'LayoutApplies.list', href: '/cdim/lay-layout-apply-list' },
      { title: 'Layout Apply Details <41eb9ce148>' },
    ]);
  });

  test('Loading is displayed', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      ...dummyData1,
      mutate: jest.fn(),
      isValidating: { layout: true, resource: true },
    });
    render(<LayoutApplyDetail />);
    expect((LoadingOverlay as unknown as jest.Mock).mock.lastCall[0].visible).toBe(true);
  });

  test('Loading is not displayed', () => {
    render(<LayoutApplyDetail />);
    expect((LoadingOverlay as unknown as jest.Mock).mock.lastCall[0].visible).toBe(false);
  });

  test('LayoutApplyControlButtons is rendered', () => {
    render(<LayoutApplyDetail />);
    expect(useLayoutApplyControlButtons).toHaveBeenCalled();

    const applyCancelButton = screen.getByRole('button', { name: 'Apply Cancel' });
    const rollbackButton = screen.getByRole('button', { name: 'Rollback' });
    expect(applyCancelButton).toBeEnabled();
    expect(rollbackButton).toBeEnabled();
    const forcedTerminationButton = screen.queryByRole('button', { name: 'Forced Termination' });
    const resumeButton = screen.queryByRole('button', { name: 'Resume' });
    expect(forcedTerminationButton).toBeDisabled();
    expect(resumeButton).toBeDisabled();
  });

  test('Action is succeeded then rendered success message', async () => {
    render(<LayoutApplyDetail />);

    await waitFor(() => {
      const closeFunc = (MessageBox as jest.Mock).mock.lastCall[0].close;
      expect(closeFunc).toBeDefined();
      act(() => {
        closeFunc();
      });
    });

    (MessageBox as jest.Mock).mock.calls.forEach((call) => {
      expect(call[0].type).toBe('success');
      expect(call[0].title).toBe('Requested "Cancel" the layout apply');
      expect(call[0].message).toBe('');
    });
    expect(setResponse).toHaveBeenCalled();
  });

  test('StatusTables are rendered', () => {
    render(<LayoutApplyDetail />);

    expect(screen.getByText('Apply Status')).toBeInTheDocument();
    // Get Apply Status table
    const applyTable = screen.getAllByRole('table')[0];
    expect(applyTable).toBeInTheDocument();
    // Get elements in the Apply Status table
    const withinApplyTable = within(applyTable);
    expect(withinApplyTable.getByText('In Progress')).toBeInTheDocument();
    expect(withinApplyTable.getByText('Started')).toBeInTheDocument();
    expect(withinApplyTable.getByText('8/1/2024, 1:43:43 AM')).toBeInTheDocument();
    expect(withinApplyTable.queryByText('Suspended.at')).not.toBeInTheDocument();
    expect(withinApplyTable.queryByText('Resume Requested')).not.toBeInTheDocument();
    expect(withinApplyTable.queryByText('Cancel Requested')).not.toBeInTheDocument();
    expect(withinApplyTable.getByText('Ended')).toBeInTheDocument();
    expect(withinApplyTable.getByText('Ended').nextSibling).toBeEmptyDOMElement();

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

  test('The data is correctly passed to CustomDataTable', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue(dummyData6);
    render(<LayoutApplyDetail />);
    const givenProps = (CustomDataTable as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.records).toEqual(dummyData6.data?.procedures);
  });

  test('Apply Procedure Table renders loader', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      ...dummyData6,
      isValidating: { layout: true, resource: true },
      mutate: jest.fn(),
    });

    render(<LayoutApplyDetail />);

    const props = (CustomDataTable as jest.Mock).mock.lastCall[0];
    expect(props.loading).toBeTruthy();
  });

  test('When the migration steps are an empty array, the table is empty', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: undefined,
      mutate: jest.fn(),
      isValidating: dummyData1.isValidating,
      error: dummyData1.error,
    });
    render(<LayoutApplyDetail />);
    const lastCall = (CustomDataTable as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(lastCall.records).toHaveLength(0);
  });

  test('When the server returns an error, a message is displayed', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      ...dummyData1,
      mutate: jest.fn(),
      error: {
        layout: { message: 'An error occurred', response: { data: { message: 'Error Message' } } },
        resource: { message: 'An error occurred', response: { data: { message: 'Error Message' } } },
      },
    });
    (useLayoutApplyControlConfirmModal as jest.Mock).mockReturnValue({
      open: jest.fn(),
      setAction: jest.fn(),
      setSubmitFunction: jest.fn(),
      setError: jest.fn(),
      response: false,
      setResponse: jest.fn(),
      successMessage: 'Requested "Cancel" the layout apply',
      modalProps: {
        close: jest.fn(),
        submitFunction: jest.fn(),
        id: '41eb9ce148',
        isOpen: true,
        confirmTitle: 'Apply Cancel',
        confirmMessage: 'Do you want to "Cancel" the layout apply?',
        submitButtonLabel: 'Yes',
        cancelButtonLabel: 'No',
        errorTitle: undefined,
        error: undefined,
      },
    });
    render(<LayoutApplyDetail />);

    (MessageBox as jest.Mock).mock.calls.forEach((call) => {
      expect(call[0].type).toBe('error');
      expect(call[0].title).toBe('An error occurred');
      expect(call[0].message).toBe('Error Message');
    });
  });

  test('When unable to connect to the server, a message is displayed', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      ...dummyData1,
      mutate: jest.fn(),
      error: {
        layout: { message: 'An error occurred', response: null },
        resource: { message: 'An error occurred', response: null },
      },
    });
    (useLayoutApplyControlConfirmModal as jest.Mock).mockReturnValue({
      open: jest.fn(),
      setAction: jest.fn(),
      setSubmitFunction: jest.fn(),
      setError: jest.fn(),
      response: false,
      setResponse: jest.fn(),
      successMessage: 'Requested "Cancel" the layout apply',
      modalProps: {
        close: jest.fn(),
        submitFunction: jest.fn(),
        id: '41eb9ce148',
        isOpen: true,
        confirmTitle: 'Apply Cancel',
        confirmMessage: 'Do you want to "Cancel" the layout apply?',
        submitButtonLabel: 'Yes',
        cancelButtonLabel: 'No',
        errorTitle: undefined,
        error: undefined,
      },
    });
    render(<LayoutApplyDetail />);

    (MessageBox as jest.Mock).mock.calls.forEach((call) => {
      expect(call[0].type).toBe('error');
      expect(call[0].title).toBe('An error occurred');
      expect(call[0].message).toBe('');
    });
  });

  test('While the applyid is not retrieved, the id is set to an empty string', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        ...dummyData1.data,
        applyID: undefined,
      },
      mutate: jest.fn(),
      isValidating: dummyData1.isValidating,
      error: dummyData1.error,
    });
    render(<LayoutApplyDetail />);
    const id = screen.getByText('Layout Apply ID').nextSibling;
    expect(id).toHaveTextContent('');
  });

  test('When the data is empty, the id is set to an empty string', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: undefined,
      mutate: jest.fn(),
      isValidating: dummyData1.isValidating,
      error: dummyData1.error,
    });
    render(<LayoutApplyDetail />);
    const layoutID = screen.getByText('Layout Apply ID').nextSibling;
    expect(layoutID).toHaveTextContent('');
  });
});
