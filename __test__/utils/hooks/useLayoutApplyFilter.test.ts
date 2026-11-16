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

import { APPLayoutApplyList, DateRange } from '@/shared-modules/types';
import { useQuery } from '@/shared-modules/utils/hooks';

import { useLayoutApplyFilter } from '@/utils/hooks/useLayoutApplyFilter';
import { useLayoutApplyList } from '@/utils/hooks/useLayoutApplyList';

const dummyLayoutApply: APPLayoutApplyList[] = [
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
  {
    id: 'test-0004',
    status: 'CANCELED',
    startedAt: new Date('2024/4/9 19:01:32'),
    endedAt: undefined,
    rollbackStatus: 'IN_PROGRESS',
  },
];

jest.mock('@/utils/hooks/useLayoutApplyList');

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn().mockReturnValue({ query: {}, isReady: true }),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn().mockReturnValue({ status: undefined }),
}));

describe('useLayoutApplyFilter custom hook', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });
  test('Returns the correct initial value', () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    expect(result.current.filteredRecords).toEqual(dummyLayoutApply);
    expect(result.current.query).toEqual({
      id: '',
      startedAt: [undefined, undefined],
      endedAt: [undefined, undefined],
      status: [],
      rollbackStatus: [],
    });

    // The setQuery function is for operational testing, so no test is needed for the initial value

    expect(result.current.selectOptions).toEqual({
      status: [
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELED', label: 'Canceled.completed' },
      ],
      rollbackStatus: [{ value: 'IN_PROGRESS', label: 'In Progress' }],
    });
  });

  test('setQuery.id() works correctly', async () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    jest.useFakeTimers();
    const { id: setLayoutApplynameQuery } = result.current.setQuery;
    // ANCHOR "test"→4 items
    act(() => {
      setLayoutApplynameQuery('test');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.id).toBe('test');
    expect(result.current.filteredRecords).toHaveLength(4);
    // ANCHOR "0001"→1 item
    act(() => {
      setLayoutApplynameQuery('0001');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.id).toBe('0001');
    expect(result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });
  test('setQuery.status() works correctly', async () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    jest.useFakeTimers();
    const { status: setLastNameQuery } = result.current.setQuery;
    act(() => {
      setLastNameQuery(['IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.status).toHaveLength(1);
    expect(result.current.query.status[0]).toBe('IN_PROGRESS');
    expect(result.current.filteredRecords).toHaveLength(1);

    act(() => {
      setLastNameQuery(['COMPLETED', 'IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.status).toHaveLength(2);
    expect(result.current.query.status).toContain('IN_PROGRESS');
    expect(result.current.query.status).toContain('COMPLETED');
    expect(result.current.filteredRecords).toHaveLength(3);

    act(() => {
      setLastNameQuery(['CANCELED']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.status).toHaveLength(1);
    expect(result.current.query.status).toContain('CANCELED');
    expect(result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });
  test('setQuery.startedAt() works correctly', async () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    jest.useFakeTimers();
    const { startedAt } = result.current.setQuery;

    const query1: DateRange = [new Date('2024/4/9 12:01:09'), undefined];
    act(() => {
      startedAt(query1);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.startedAt).toEqual(query1);
    expect(result.current.filteredRecords).toHaveLength(4);

    const query2: DateRange = [new Date('2024/4/9 12:01:09'), new Date('2024/4/9 19:01:32')];
    act(() => {
      startedAt(query2);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.startedAt).toEqual(query2);
    expect(result.current.filteredRecords).toHaveLength(4);

    const query3: DateRange = [undefined, new Date('2024/4/9 19:01:32')];
    act(() => {
      startedAt(query3);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.startedAt).toEqual(query3);
    expect(result.current.filteredRecords).toHaveLength(4);

    const query4: DateRange = [new Date('2024/4/9 12:01:09'), null];
    act(() => {
      startedAt(query4);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.startedAt).toEqual(query4);
    expect(result.current.filteredRecords).toHaveLength(4);

    jest.useRealTimers();
  });
  test('setQuery.endedAt() works correctly', async () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    jest.useFakeTimers();
    const { endedAt } = result.current.setQuery;

    const query1: DateRange = [new Date('2024/4/10 02:01:09'), undefined];
    act(() => {
      endedAt(query1);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.endedAt).toEqual(query1);
    expect(result.current.filteredRecords).toHaveLength(2);

    const query2: DateRange = [new Date('2024/4/10 02:01:09'), new Date('2024/4/10 02:01:09')];
    act(() => {
      endedAt(query2);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.endedAt).toEqual(query2);
    expect(result.current.filteredRecords).toHaveLength(2);

    const query3: DateRange = [undefined, new Date('2024/4/10 02:01:09')];
    act(() => {
      endedAt(query3);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.endedAt).toEqual(query3);
    expect(result.current.filteredRecords).toHaveLength(2);

    const query4: DateRange = [new Date('2024/4/10 02:01:09'), null];
    act(() => {
      endedAt(query4);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.endedAt).toEqual(query4);
    expect(result.current.filteredRecords).toHaveLength(2);

    jest.useRealTimers();
  });
  test('setQuery.rollbackStatus() works correctly', async () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    jest.useFakeTimers();
    const { rollbackStatus: setRollbackStatusQuery } = result.current.setQuery;
    act(() => {
      setRollbackStatusQuery(['IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackStatus).toHaveLength(1);
    expect(result.current.query.rollbackStatus[0]).toBe('IN_PROGRESS');
    expect(result.current.filteredRecords).toHaveLength(1);

    jest.useRealTimers();
  });

  test('Return correct values from string query', () => {
    // @ts-ignore
    useQuery.mockReturnValue({
      status: 'IN_PROGRESS,FAILED',
      startedAt: '2024/1/1',
      endedAt: '2024-12-31,2025/01/01',
      rollbackStatus: ['COMPLETED', 'SUSPENDED'],
    });
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    expect(result.current.query).toEqual({
      id: '',
      startedAt: [new Date('2024/1/1'), undefined],
      endedAt: [new Date('2024/12/31'), new Date('2025/1/1')],
      status: ['IN_PROGRESS', 'FAILED'],
      rollbackStatus: ['COMPLETED', 'SUSPENDED'],
    });
  });
  test('Return correct values from array-object query', () => {
    // @ts-ignore
    useQuery.mockReturnValue({
      status: '',
      startedAt: ['2024/1/1'],
      endedAt: ['2024/12/31', '2025/1/1'],
      rollbackStatus: [],
    });
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    expect(result.current.query).toEqual({
      id: '',
      startedAt: [new Date('2024/1/1'), undefined],
      endedAt: [new Date('2024/12/31'), new Date('2025/1/1')],
      status: [],
      rollbackStatus: [],
    });
  });
});
