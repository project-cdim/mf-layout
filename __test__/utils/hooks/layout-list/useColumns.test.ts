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

import React, { ReactElement } from 'react';

import { MultiSelect } from '@mantine/core';

import { cleanup, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { DateRangePicker } from '@/shared-modules/components';

import { APPLayoutList } from '@/types';

import { useColumns } from '@/utils/hooks/design-list/useColumns';
import { APPLayoutListQuery, LayoutFilter } from '@/utils/hooks/useLayoutFilter';

const dummyAPPLayout: APPLayoutList = {
  id: '2131sijf-2122-dfa',
  status: 'COMPLETED',
  startedAt: new Date('2024/03/03 11:23:22'),
  endedAt: new Date('2024/04/02 21:00:01'),
};
const dummyAPPLayout2: APPLayoutList = {
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

describe('useColumns', () => {
  // ANCHOR mockLayoutFilter
  const mockLayoutFilter: LayoutFilter = {
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
    ],
    query: {
      id: '123',
      status: ['COMPLETED'],
      startedAt: [new Date('2024/03/01'), new Date('2024/03/04')],
      endedAt: [new Date('2024/03/01'), new Date('2024/03/05')],
    },
    selectOptions: {
      status: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELING', label: 'Canceling' },
        { value: 'CANCELED', label: 'Canceled' },
      ],
    },
    setQuery: {
      id: jest.fn(),
      status: jest.fn(),
      startedAt: setStartedAt,
      endedAt: setEndedAt,
    },
  };

  const mockLayoutFilter2: LayoutFilter = {
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
    ],
    query: {
      id: '123',
      status: ['COMPLETED'],
      startedAt: [undefined, undefined],
      endedAt: [undefined, undefined],
    },
    selectOptions: {
      status: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELING', label: 'Canceling' },
        { value: 'CANCELED', label: 'Canceled' },
      ],
    },
    setQuery: {
      id: jest.fn(),
      status: jest.fn(),
      startedAt: setStartedAt,
      endedAt: setEndedAt,
    },
  };
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();

    (DateRangePicker as unknown as jest.Mock).mockImplementation(mockDateRangePicker);
  });

  test('Returns column information of type DataTableColumn', () => {
    const columns = useColumns(mockLayoutFilter);

    expect(columns).toHaveLength(4);
    // ID column
    expect(columns[0].accessor).toBe('id');
    expect(columns[0].title).toBe('ID');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();

    // status column
    expect(columns[1].accessor).toBe('status');
    expect(columns[1].title).toBe('Design Status');
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
  });

  test('That the design ID is rendered', async () => {
    const columns = useColumns(mockLayoutFilter);
    const column = columns.find((column) => column.accessor === 'id');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayout, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayout.id)).toBeInTheDocument();
  });

  test('That the design status is rendered', async () => {
    const columns = useColumns(mockLayoutFilter);
    const column = columns.find((column) => column.accessor === 'status');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayout, 0) as ReactElement);
    expect(screen.getByText('Completed')).toBeInTheDocument();
    render(column.render(dummyAPPLayout2, 0) as ReactElement);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('That the query is updated with the MultiSelect input for design status', () => {
    const columns = useColumns(mockLayoutFilter);
    const column = columns.find((column) => column.accessor === 'status');
    if (!column || !column.filter) {
      throw new Error('undefined');
    }
    render(column?.filter as ReactElement);

    (MultiSelect as unknown as jest.Mock).mock.lastCall[0].onChange(['IN_PROGRESS']);
    expect(mockLayoutFilter.setQuery.status).toHaveBeenCalledTimes(1);
  });

  test('That the startedAt is rendered', async () => {
    const columns = useColumns(mockLayoutFilter);
    const column = columns.find((column) => column.accessor === 'startedAt');
    if (!column || !column.render) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayout, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayout.startedAt.toLocaleString())).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPLayout2, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayout2.startedAt.toLocaleString())).toBeInTheDocument();
  });

  test('That the endedAt is rendered', async () => {
    const columns = useColumns(mockLayoutFilter);
    const column = columns.find((column) => column.accessor === 'endedAt');
    if (!column || !column.render || !dummyAPPLayout.endedAt) {
      throw new Error('undefined');
    }
    render(column.render(dummyAPPLayout, 0) as ReactElement);
    expect(screen.getByText(dummyAPPLayout.endedAt.toLocaleString())).toBeInTheDocument();

    cleanup();

    render(column.render(dummyAPPLayout2, 0) as ReactElement);
    expect(screen.queryByText(dummyAPPLayout.endedAt.toLocaleString())).toBeNull();
  });

  test('That the query is updated with the design ID input', async () => {
    const columns = useColumns(mockLayoutFilter);
    const column = columns.find((column) => column.accessor === 'id');
    render(column?.filter as ReactElement);

    const idInput = screen.getByLabelText('ID');
    await userEvent.clear(idInput);
    await userEvent.type(idInput, 'A');
    expect(mockLayoutFilter.setQuery.id).toHaveBeenCalledTimes(2);

    // Since getByRole couldn't retrieve the element, we can use Node properties to get the x button and click it
    const xButton = idInput.nextSibling?.firstChild;
    await userEvent.click(xButton as Element);
    expect(mockLayoutFilter.setQuery.id).toHaveBeenCalledTimes(3);
  });

  test.each([
    ['startedAt', mockLayoutFilter],
    ['startedAt', mockLayoutFilter],
    ['endedAt', mockLayoutFilter],
    ['startedAt', mockLayoutFilter2],
    ['endedAt', mockLayoutFilter2],
  ])('That the date range filter component receives the expected arguments (%s, %o)', async (accessor: string, arg) => {
    const columns = useColumns(arg);
    const column = columns.find((column) => column.accessor === accessor) as {
      filter: (params: { close: () => void }) => React.ReactNode;
    };
    const closeFunc = () => undefined;
    render(column?.filter({ close: closeFunc }) as ReactElement);

    expect(mockDateRangePicker).toHaveBeenCalledTimes(1);

    const { value, close } = mockDateRangePicker.mock.calls[0][0];
    const a: keyof APPLayoutListQuery = accessor as keyof APPLayoutListQuery;
    expect(value).toStrictEqual([arg.query[a][0], arg.query[a][1]]);
    expect(close).toBe(closeFunc);
  });
});
