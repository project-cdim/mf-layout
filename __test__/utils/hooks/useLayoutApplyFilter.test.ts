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

import { DateRange, APPLayoutApplyList } from '@/shared-modules/types';
import { useQueryArrayObject } from '@/shared-modules/utils/hooks';
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

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQueryArrayObject: jest.fn().mockReturnValue(
    new Proxy({} as Record<string, string[]>, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop as string];
        }
        return [];
      },
    })
  ),
}));

describe('useLayoutApplyFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns correct initial values and selectOptions', () => {
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
    expect(result.current.selectOptions.status.length).toBeGreaterThan(0);
    expect(result.current.selectOptions.rollbackStatus.length).toBeGreaterThan(0);
  });

  test('setQuery.id filters records by id', () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    jest.useFakeTimers();
    const { result } = renderHook(() => useLayoutApplyFilter());
    act(() => {
      result.current.setQuery.id('test-0001');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.id).toBe('test-0001');
    expect(result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });

  test('setQuery.status filters records by status', () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    jest.useFakeTimers();
    const { result } = renderHook(() => useLayoutApplyFilter());
    act(() => {
      result.current.setQuery.status(['IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.status).toEqual(['IN_PROGRESS']);
    expect(result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });

  test('setQuery.rollbackStatus filters records by rollbackStatus', () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    jest.useFakeTimers();
    const { result } = renderHook(() => useLayoutApplyFilter());
    act(() => {
      result.current.setQuery.rollbackStatus(['IN_PROGRESS']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackStatus).toEqual(['IN_PROGRESS']);
    expect(result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });

  test('setQuery.startedAt filters records by startedAt', () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    jest.useFakeTimers();
    const { result } = renderHook(() => useLayoutApplyFilter());
    const range: DateRange = [new Date('2024/4/9 12:01:09'), new Date('2024/4/9 19:01:32')];
    act(() => {
      result.current.setQuery.startedAt(range);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.startedAt).toEqual(range);
    expect(result.current.filteredRecords.length).toBeGreaterThan(0);
    jest.useRealTimers();
  });

  test('setQuery.endedAt filters records by endedAt', () => {
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    jest.useFakeTimers();
    const { result } = renderHook(() => useLayoutApplyFilter());
    const range: DateRange = [new Date('2024/4/10 02:01:09'), undefined];
    act(() => {
      result.current.setQuery.endedAt(range);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.endedAt).toEqual(range);
    expect(result.current.filteredRecords.length).toBeGreaterThan(0);
    jest.useRealTimers();
  });

  test('reflects query from useQueryArrayObject', () => {
    (useQueryArrayObject as jest.Mock).mockReturnValue({
      status: ['IN_PROGRESS'],
      rollbackStatus: ['IN_PROGRESS'],
      startedAt: ['2024/4/9 12:01:09', '2024/4/9 13:01:09'],
      endedAt: ['2024/4/10 02:01:09'],
    });
    (useLayoutApplyList as jest.Mock).mockReturnValue({ data: dummyLayoutApply });
    const { result } = renderHook(() => useLayoutApplyFilter());
    expect(result.current.query.status).toEqual(['IN_PROGRESS']);
    expect(result.current.query.rollbackStatus).toEqual(['IN_PROGRESS']);
    expect(result.current.query.startedAt[0]).toEqual(new Date('2024/4/9 12:01:09'));
    expect(result.current.query.endedAt[0]).toEqual(new Date('2024/4/10 02:01:09'));
  });
});
