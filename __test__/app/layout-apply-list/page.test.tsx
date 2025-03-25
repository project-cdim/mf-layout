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

import React from 'react';

import { render } from '@/shared-modules/__test__/test-utils';
import { CustomDataTable, MessageBox, PageHeader } from '@/shared-modules/components';
import { APPLayoutApplyList } from '@/shared-modules/types';

import LayoutApplyList from '@/app/[lng]/layout-apply-list/page';
import { dummyAPPLayoutApplyList } from '@/utils/dummy-data/layoutApplyList/dummyAPPLayoutApplyList';
import { useLayoutApplyColumns, useLayoutApplyFilter, useLayoutApplyList } from '@/utils/hooks';

jest.mock('mantine-datatable');
jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useLayoutApplyColumns: jest.fn(),
  useLayoutApplyFilter: jest.fn(),
  useLayoutApplyList: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
  CustomDataTable: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useLoading: jest.fn(),
}));

describe('LayoutApplyList', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useLayoutApplyList.mockImplementation(() => ({
      data: dummyAPPLayoutApplyList,
      error: undefined,
      isValidating: false,
      mutate: jest.fn(),
    }));
    // @ts-ignore
    useLayoutApplyFilter.mockImplementation(() => ({
      filteredRecords: dummyAPPLayoutApplyList,
      query: {},
      setQuery: {},
      selectOptions: {},
    }));
    // @ts-ignore
    useLayoutApplyColumns.mockImplementation((data: APPLayoutApplyList[]) => ({
      columns: undefined,
      records: data,
    }));
  });

  test('The title and breadcrumb list are correctly passed to PageHeader', () => {
    render(<LayoutApplyList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('LayoutApplies.list');
    expect(givenProps.items).toEqual([{ title: 'Layout Management' }, { title: 'LayoutApplies.list' }]);
  });

  test('The data is correctly passed to CustomDataTable', () => {
    render(<LayoutApplyList />);
    // @ts-ignore
    const givenProps = CustomDataTable.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.records).toEqual(dummyAPPLayoutApplyList);
  });

  test('When an error is returned, two messages are displayed', async () => {
    const dummyError = {
      message: 'The first error occurred',
      response: {
        data: {
          message: 'First error message',
        },
      },
    };
    // @ts-ignore
    useLayoutApplyList.mockImplementation(() => ({
      data: dummyAPPLayoutApplyList,
      error: dummyError,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<LayoutApplyList />);

    // MessageBox is called once
    expect(MessageBox).toHaveBeenCalledTimes(1);
    // @ts-ignore
    const lastcall = MessageBox.mock.lastCall[0];
    expect(lastcall.type).toBe('error');
    expect(lastcall.title).toBe(dummyError.message);
    expect(lastcall.message).toBe(dummyError.response.data.message);
  });

  test('Only the title is displayed when there is no response data for the error', async () => {
    const dummyError = {
      message: 'The first error occurred',
    };
    // @ts-ignore
    useLayoutApplyList.mockImplementation(() => ({
      data: dummyAPPLayoutApplyList,
      error: dummyError,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<LayoutApplyList />);

    // MessageBox is called once
    expect(MessageBox).toHaveBeenCalledTimes(1);
    // Each error content is passed to MessageBox
    // @ts-ignore
    const lastcall = MessageBox.mock.lastCall[0];
    expect(lastcall.type).toBe('error');
    expect(lastcall.title).toBe(dummyError.message);
    expect(lastcall.message).toBe('');
  });
});
