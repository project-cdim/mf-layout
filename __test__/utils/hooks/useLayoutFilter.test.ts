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

import { act, renderHook } from '@testing-library/react';

import { APPLayoutList } from '@/types';

import { useLayoutFilter } from '@/utils/hooks/useLayoutFilter';

const dummyLayout: APPLayoutList[] = [
  {
    id: 'test-0001',
    status: 'COMPLETED',
    startedAt: new Date('2024/4/9 12:01:09'),
    endedAt: new Date('2024/4/10 02:01:09'),
  },
  {
    id: 'test-0002',
    status: 'COMPLETED',
    startedAt: new Date('2024/4/9 12:01:09'),
    endedAt: new Date('2024/4/10 02:01:09'),
  },
  {
    id: 'test-0003',
    status: 'IN_PROGRESS',
    startedAt: new Date('2024/4/9 19:01:32'),
    endedAt: undefined,
  },
];

describe('useLayoutFilter custom hook', () => {
  test('Returns the correct initial value', () => {
    const view = renderHook(() => useLayoutFilter(dummyLayout));
    expect(view.result.current.filteredRecords).toEqual(dummyLayout);
    expect(view.result.current.query).toEqual({
      id: '',
      startedAt: [undefined, undefined],
      endedAt: [undefined, undefined],
      status: [],
    });
  });

  test('setQuery.id() works correctly', async () => {
    const view = renderHook(() => useLayoutFilter(dummyLayout));
    jest.useFakeTimers();
    const { id: setLayoutnameQuery } = view.result.current.setQuery;
    // ANCHOR "test"→3 items
    act(() => {
      setLayoutnameQuery('test');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.id).toBe('test');
    expect(view.result.current.filteredRecords).toHaveLength(3);
    // ANCHOR "0001"→1 item
    act(() => {
      setLayoutnameQuery('0001');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.id).toBe('0001');
    expect(view.result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });
  test('setQuery.status() works correctly', async () => {
    const view = renderHook(() => useLayoutFilter(dummyLayout));
    jest.useFakeTimers();
    const { status: setLastNameQuery } = view.result.current.setQuery;
    act(() => {
      setLastNameQuery(['IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.status).toHaveLength(1);
    expect(view.result.current.query.status[0]).toBe('IN_PROGRESS');
    expect(view.result.current.filteredRecords).toHaveLength(1);

    act(() => {
      setLastNameQuery(['COMPLETED', 'IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.status).toHaveLength(2);
    expect(view.result.current.query.status).toContain('IN_PROGRESS');
    expect(view.result.current.query.status).toContain('COMPLETED');
    expect(view.result.current.filteredRecords).toHaveLength(3);

    act(() => {
      setLastNameQuery(['CANCELED']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.status).toHaveLength(1);
    expect(view.result.current.query.status).toContain('CANCELED');
    expect(view.result.current.filteredRecords).toHaveLength(0);
    jest.useRealTimers();
  });
  test('setQuery.startedAt() works correctly', async () => {
    const view = renderHook(() => useLayoutFilter(dummyLayout));
    jest.useFakeTimers();
    const { startedAt } = view.result.current.setQuery;

    const query1 = [new Date('2024/4/9 12:01:09'), undefined] as [Date, undefined];
    act(() => {
      startedAt(query1);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.startedAt).toEqual(query1);
    expect(view.result.current.filteredRecords).toHaveLength(3);

    const query2 = [new Date('2024/4/9 12:01:09'), new Date('2024/4/9 19:01:32')] as [Date, Date];
    act(() => {
      startedAt(query2);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.startedAt).toEqual(query2);
    expect(view.result.current.filteredRecords).toHaveLength(3);

    const query3 = [undefined, new Date('2024/4/9 19:01:32')] as [undefined, Date];
    act(() => {
      startedAt(query3);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.startedAt).toEqual(query3);
    expect(view.result.current.filteredRecords).toHaveLength(3);

    const query4 = [new Date('2024/4/9 12:01:09'), null] as [Date, null];
    act(() => {
      startedAt(query4);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.startedAt).toEqual(query4);
    expect(view.result.current.filteredRecords).toHaveLength(3);

    jest.useRealTimers();
  });
  test('setQuery.endedAt() works correctly', async () => {
    const view = renderHook(() => useLayoutFilter(dummyLayout));
    jest.useFakeTimers();
    const { endedAt } = view.result.current.setQuery;

    const query1 = [new Date('2024/4/10 02:01:09'), undefined] as [Date, undefined];
    act(() => {
      endedAt(query1);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.endedAt).toEqual(query1);
    expect(view.result.current.filteredRecords).toHaveLength(2);

    const query2 = [new Date('2024/4/10 02:01:09'), new Date('2024/4/10 02:01:09')] as [Date, Date];
    act(() => {
      endedAt(query2);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.endedAt).toEqual(query2);
    expect(view.result.current.filteredRecords).toHaveLength(2);

    const query3 = [undefined, new Date('2024/4/10 02:01:09')] as [undefined, Date];
    act(() => {
      endedAt(query3);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.endedAt).toEqual(query3);
    expect(view.result.current.filteredRecords).toHaveLength(2);

    const query4 = [new Date('2024/4/10 02:01:09'), null] as [Date, null];
    act(() => {
      endedAt(query4);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.endedAt).toEqual(query4);
    expect(view.result.current.filteredRecords).toHaveLength(2);

    jest.useRealTimers();
  });
});
