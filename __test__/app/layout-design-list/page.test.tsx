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

import { DataTable } from 'mantine-datatable';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';

import LayoutList from '@/app/[lng]/layout-design-list/page';
import { dummyAPPLayoutList } from '@/utils/dummy-data/layoutList/dummyAPPLayoutList';
import { useLayoutList } from '@/utils/hooks';

jest.mock('mantine-datatable');
jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useLayoutTable: jest.fn(),
  useLayoutList: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useLoading: jest.fn(),
}));

describe('LayoutList', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();

    (useLayoutList as unknown as jest.Mock).mockImplementation(() => ({
      data: dummyAPPLayoutList,
      error: undefined,
      isValidating: false,
      mutate: jest.fn(),
    }));
  });

  test('The title and breadcrumb list are correctly passed to PageHeader', () => {
    render(<LayoutList />);

    const givenProps = (PageHeader as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Layout Designs');
    expect(givenProps.items).toEqual([{ title: 'Layout Management' }, { title: 'Layout Designs' }]);
  });

  test('The data is correctly passed to DataTable', () => {
    render(<LayoutList />);
    const records = (DataTable as jest.Mock).mock.lastCall[0].records;
    // table displays up to 10 records at first. Now dummy data has 6 records.
    expect(records).toHaveLength(dummyAPPLayoutList.length);
    expect(records).toEqual(expect.arrayContaining(dummyAPPLayoutList));
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

    (useLayoutList as unknown as jest.Mock).mockImplementation(() => ({
      data: dummyAPPLayoutList,
      error: dummyError,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<LayoutList />);

    // MessageBox is called once
    expect(MessageBox).toHaveBeenCalledTimes(1);

    const lastcall = (MessageBox as unknown as jest.Mock).mock.lastCall[0];
    expect(lastcall.type).toBe('error');
    expect(lastcall.title).toBe(dummyError.message);
    expect(lastcall.message).toBe(dummyError.response.data.message);
  });

  test('Only the title is displayed when there is no response data for the error', async () => {
    const dummyError = {
      message: 'The first error occurred',
    };

    (useLayoutList as unknown as jest.Mock).mockImplementation(() => ({
      data: dummyAPPLayoutList,
      error: dummyError,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<LayoutList />);

    // MessageBox is called once
    expect(MessageBox).toHaveBeenCalledTimes(1);
    // Each error content is passed to MessageBox

    const lastcall = (MessageBox as unknown as jest.Mock).mock.lastCall[0];
    expect(lastcall.type).toBe('error');
    expect(lastcall.title).toBe(dummyError.message);
    expect(lastcall.message).toBe('');
  });

  test('When the number of records is zero, the height of the DataTable is fixed', () => {
    (useLayoutList as unknown as jest.Mock).mockImplementation(() => ({
      data: [],
      error: undefined,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<LayoutList />);

    expect((DataTable as unknown as jest.Mock).mock.lastCall[0].minHeight).toBe(230);
  });
});
