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

import { ReactElement } from 'react';

import { MultiSelect } from '@mantine/core';

import { cleanup, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { DateRangePicker } from '@/shared-modules/components';
import { APPLayoutApplyList } from '@/shared-modules/types';

import { useLayoutApplyColumns } from '@/utils/hooks/';
import { APPLayoutApplyListQuery, LayoutApplyFilter } from '@/utils/hooks/useLayoutApplyFilter';

const dummyAPPLayoutApply: APPLayoutApplyList = {
  id: '2131sijf-2122-dfa',
  status: 'CANCELED',
  startedAt: new Date('2024/03/03 11:23:22'),
  endedAt: new Date('2024/04/02 21:00:01'),
  rollbackStatus: 'COMPLETED',
};
const dummyAPPLayoutApply2: APPLayoutApplyList = {
  id: 'jfoi8ds0-sfa1-rskg',
  status: 'IN_PROGRESS',
  startedAt: new Date('2024/04/04 14:30:23'),
  endedAt: undefined,
};

const setStartedAt = jest.fn();
const setEndedAt = jest.fn();
const mockDateRangePicker = jest.fn();

jest.mock('@/shared-modules/components', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/components'),
  DateRangePicker: jest.fn(),
}));
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  MultiSelect: jest.fn(),
}));

describe('useLayoutApplyColumns', () => {
  // ANCHOR mockLayoutFilter
  const mockLayoutApplyFilter: LayoutApplyFilter = {
    filteredRecords: [
      {
        id: '2131sijf-2122-dfa',
        status: 'COMPLETED',
        startedAt: new Date('2024/03/03 11:23:22'),
        endedAt: new Date('2024/04/02'),
      },
      {
        id: 'jifo123s-sfja-2131',
        status: 'FAILED',
        startedAt: new Date('2024/03/03 12:00:01'),
        endedAt: new Date('2024/03/23'),
      },
      {
        id: 'jfoi8ds0-sfa1-rskg',
        status: 'IN_PROGRESS',
        startedAt: new Date('2024/03/03 17:02:22'),
        endedAt: undefined,
      },
      {
        id: 'kgoi8ds0-sfa1-stlh',
        status: 'CANCELED',
        startedAt: new Date('2024/03/03 17:02:22'),
        endedAt: new Date('2024/03/04'),
        rollbackStatus: 'COMPLETED',
      },
    ],
    query: {
      id: '123',
      status: ['COMPLETED'],
      startedAt: [new Date('2024/03/01'), new Date('2024/03/04')],
      endedAt: [new Date('2024/03/01'), new Date('2024/03/05')],
      rollbackStatus: ['COMPLETED'],
    },
    selectOptions: {
      status: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELING', label: 'Canceling' },
        { value: 'CANCELED', label: 'Canceled.completed' },
        { value: 'SUSPENDED', label: 'Suspended.status' },
      ],
      rollbackStatus: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'SUSPENDED', label: 'Suspended.status' },
      ],
    },
    setQuery: {
      id: jest.fn(),
      status: jest.fn(),
      startedAt: setStartedAt,
      endedAt: setEndedAt,
      rollbackStatus: jest.fn(),
    },
  };

  const mockLayoutApplyFilter2: LayoutApplyFilter = {
    filteredRecords: [
      {
        id: '2131sijf-2122-dfa',
        status: 'COMPLETED',
        startedAt: new Date('2024/03/03 11:23:22'),
        endedAt: new Date('2024/04/02'),
      },
      {
        id: 'jifo123s-sfja-2131',
        status: 'FAILED',
        startedAt: new Date('2024/03/03 12:00:01'),
        endedAt: new Date('2024/03/23'),
      },
      {
        id: 'jfoi8ds0-sfa1-rskg',
        status: 'IN_PROGRESS',
        startedAt: new Date('2024/03/03 17:02:22'),
        endedAt: undefined,
      },
      {
        id: 'kgoi8ds0-sfa1-stlh',
        status: 'CANCELED',
        startedAt: new Date('2024/03/03 17:02:22'),
        endedAt: new Date('2024/03/04'),
        rollbackStatus: 'IN_PROGRESS',
      },
    ],
    query: {
      id: '123',
      status: ['COMPLETED'],
      startedAt: [undefined, undefined],
      endedAt: [undefined, undefined],
      rollbackStatus: ['IN_PROGRESS'],
    },
    selectOptions: {
      status: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELING', label: 'Canceling' },
        { value: 'CANCELED', label: 'Canceled.completed' },
        { value: 'SUSPENDED', label: 'Suspended.status' },
      ],
      rollbackStatus: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'SUSPENDED', label: 'Suspended.status' },
      ],
    },
    setQuery: {
      id: jest.fn(),
      status: jest.fn(),
      startedAt: setStartedAt,
      endedAt: setEndedAt,
      rollbackStatus: jest.fn(),
    },
  };
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    DateRangePicker.mockImplementation(mockDateRangePicker);
  });

  test('Returns column information of type DataTableColumn', () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);

    expect(columns).toHaveLength(5);
    // ID column
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].title).toBe('ID');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();

    // status column
    expect(columns[1].accessor).toBe('status');
    expect(columns[1].title).toBe('Apply Status');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].filtering).toBeTruthy();

    // firstName column
    expect(columns[2].accessor).toBe('startedAt');
    expect(columns[2].title).toBe('Started');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].filtering).toBeTruthy();

    // endedAt column
    expect(columns[3].accessor).toBe('endedAt');
    expect(columns[3].title).toBe('Ended');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].filtering).toBeTruthy();

    // rollbackStatus column
    expect(columns[4].accessor).toBe('rollbackStatus');
    expect(columns[4].title).toBe('Rollback Status');
    expect(columns[4].sortable).toBeTruthy();
    expect(columns[4].filtering).toBeTruthy();
  });

  test('That the apply ID is rendered', async () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'id');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayoutApply, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayoutApply.id)).toBeInTheDocument();
  });

  test('That the apply status is rendered', async () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'status');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayoutApply, 0) as ReactElement);
    expect(screen.getByText('Canceled.completed')).toBeInTheDocument();
    render(column.render(dummyAPPLayoutApply2, 0) as ReactElement);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('That the query is updated with the MultiSelect input for apply status', () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'status');
    if (!column || !column.filter) {
      throw new Error('undefined');
    }
    render(column?.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['IN_PROGRESS']);
    expect(mockLayoutApplyFilter.setQuery.status).toHaveBeenCalledTimes(1);
  });

  test('That the startedAt is rendered', async () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'startedAt');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayoutApply, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayoutApply.startedAt.toLocaleString())).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPLayoutApply2, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayoutApply2.startedAt.toLocaleString())).toBeInTheDocument();
  });

  test('That the endedAt is rendered', async () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'endedAt');
    if (!column || !column.render || !dummyAPPLayoutApply.endedAt) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayoutApply, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayoutApply.endedAt.toLocaleString())).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPLayoutApply2, 0) as ReactElement);
    expect(screen.queryByText(dummyAPPLayoutApply.endedAt.toLocaleString())).toBeNull();
  });

  test('That the rollbackStatus is rendered', async () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'rollbackStatus');
    if (!column || !column.render || !dummyAPPLayoutApply.rollbackStatus) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayoutApply, 0) as ReactElement);
    expect(screen.getByText('Completed')).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPLayoutApply2, 0) as ReactElement);
    expect(screen.queryByText('Completed')).toBeNull();
  });

  test('That the query is updated with the MultiSelect input for rollback status', () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'rollbackStatus');
    if (!column || !column.filter) {
      throw new Error('undefined');
    }
    render(column?.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['IN_PROGRESS']);
    expect(mockLayoutApplyFilter.setQuery.rollbackStatus).toHaveBeenCalledTimes(1);
  });

  test('That the query is updated with the apply ID input', async () => {
    const columns = useLayoutApplyColumns(mockLayoutApplyFilter);
    const column = columns.find((column: { accessor: string }) => column.accessor === 'id');
    render(column?.filter as ReactElement);

    const idInput = screen.getByLabelText('ID');
    await UserEvent.clear(idInput);
    await UserEvent.type(idInput, 'A');
    expect(mockLayoutApplyFilter.setQuery.id).toHaveBeenCalledTimes(2);

    // Since getByRole couldn't retrieve the element, we can use Node properties to get the x button and click it
    const xButton = idInput.nextSibling?.firstChild;
    await UserEvent.click(xButton as Element);
    expect(mockLayoutApplyFilter.setQuery.id).toHaveBeenCalledTimes(3);
  });

  test.each([
    ['startedAt', mockLayoutApplyFilter],
    ['startedAt', mockLayoutApplyFilter],
    ['endedAt', mockLayoutApplyFilter],
    ['startedAt', mockLayoutApplyFilter2],
    ['endedAt', mockLayoutApplyFilter2],
  ])('That the date range filter component receives the expected arguments (%s, %o)', async (accessor: string, arg) => {
    const columns = useLayoutApplyColumns(arg);
    const column = columns.find((column: { accessor: string }) => column.accessor === accessor) as {
      filter: (params: { close: () => void }) => React.ReactNode;
    };
    const closeFunc = () => undefined;
    render(column?.filter({ close: closeFunc }) as ReactElement);

    expect(mockDateRangePicker).toHaveBeenCalledTimes(1);

    const { value, close } = mockDateRangePicker.mock.calls[0][0];
    const a: keyof APPLayoutApplyListQuery = accessor as keyof APPLayoutApplyListQuery;
    expect(value).toStrictEqual([arg.query[a][0], arg.query[a][1]]);
    expect(close).toBe(closeFunc);
  });
});
