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

import { dummyUseLayoutApplyDetail } from '@/utils/dummy-data/layoutApplyDetail/dummyUseLayoutApplyDetail14';
import { useLayoutApplyDetail } from '@/utils/hooks';
import { useFilter } from '@/utils/hooks/procedure/useFilter';

jest.mock('@/utils/hooks', () => ({
  useLayoutApplyDetail: jest.fn(),
}));

describe('useFilter custom hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Returns the correct initial value', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    expect(result.current.filteredRecords).toEqual(dummyUseLayoutApplyDetail.data?.procedures);
    expect(result.current.query).toEqual({
      ID: [undefined, undefined],
      targetCPUID: '',
      targetDeviceID: '',
      operation: [],
      dependencies: [undefined, undefined],
      status: [],
      rollbackOperation: [],
      rollbackDependencies: [undefined, undefined],
      rollbackStatus: [],
    });

    expect(result.current.selectOptions).toEqual({
      status: [
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELED', label: 'Canceled.normal' },
      ],
      operation: [
        { value: 'connect', label: 'Connect' },
        { value: 'disconnect', label: 'Disconnect' },
        { value: 'boot', label: 'Boot' },
        { value: 'shutdown', label: 'Shutdown' },
      ],
      rollbackStatus: [{ value: 'COMPLETED', label: 'Completed' }],
      rollbackOperation: [
        { value: 'disconnect', label: 'Disconnect' },
        { value: 'shutdown', label: 'Shutdown' },
      ],
    });
  });

  test('Returns the empty values when data is undefined', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() => useFilter());
    expect(result.current.filteredRecords).toEqual([]);
    expect(result.current.query).toEqual({
      ID: [undefined, undefined],
      targetCPUID: '',
      targetDeviceID: '',
      operation: [],
      dependencies: [undefined, undefined],
      status: [],
      rollbackOperation: [],
      rollbackDependencies: [undefined, undefined],
      rollbackStatus: [],
    });

    expect(result.current.selectOptions).toEqual({
      status: [],
      operation: [],
      rollbackStatus: [],
      rollbackOperation: [],
    });
  });

  test('Return the empty values when operationID is undefined', () => {
    const dummy = {
      ...dummyUseLayoutApplyDetail,
      data: {
        applyID: dummyUseLayoutApplyDetail.data?.applyID,
        apply: dummyUseLayoutApplyDetail.data?.apply,
        rollback: dummyUseLayoutApplyDetail.data?.rollback,
        procedures: dummyUseLayoutApplyDetail.data?.procedures?.map((p) => ({
          ...p,
          operationID: undefined,
        })),
      },
    };

    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummy.data });
    const { result } = renderHook(() => useFilter());

    jest.useFakeTimers();
    const { ID: setIDQuery } = result.current.setQuery;
    act(() => {
      setIDQuery([1, 2]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredRecords).toEqual([]);
    expect(result.current.query).toEqual({
      ID: [1, 2],
      targetCPUID: '',
      targetDeviceID: '',
      operation: [],
      dependencies: [undefined, undefined],
      status: [],
      rollbackOperation: [],
      rollbackDependencies: [undefined, undefined],
      rollbackStatus: [],
    });
    expect(result.current.selectOptions).toEqual({
      status: [
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELED', label: 'Canceled.normal' },
      ],
      operation: [
        { value: 'connect', label: 'Connect' },
        { value: 'disconnect', label: 'Disconnect' },
        { value: 'boot', label: 'Boot' },
        { value: 'shutdown', label: 'Shutdown' },
      ],
      rollbackStatus: [{ value: 'COMPLETED', label: 'Completed' }],
      rollbackOperation: [
        { value: 'disconnect', label: 'Disconnect' },
        { value: 'shutdown', label: 'Shutdown' },
      ],
    });
  });

  test('setQuery.ID() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { ID: setIDQuery } = result.current.setQuery;
    act(() => {
      setIDQuery([1, 2]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.ID).toEqual([1, 2]);
    expect(result.current.filteredRecords).toHaveLength(2);
    act(() => {
      setIDQuery([1, 3]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.ID).toEqual([1, 3]);
    expect(result.current.filteredRecords).toHaveLength(3);
    jest.useRealTimers();
  });

  test('setQuery.targetCPUID() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { targetCPUID: setTargetCPUID } = result.current.setQuery;
    act(() => {
      setTargetCPUID('b477ea1c-db3d-48b3-9725-b0ce6e25efc2');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.targetCPUID).toBe('b477ea1c-db3d-48b3-9725-b0ce6e25efc2');
    expect(result.current.filteredRecords).toHaveLength(6);
    jest.useRealTimers();
  });

  test('setQuery.targetDeviceID() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { targetDeviceID: setTargetDeviceID } = result.current.setQuery;
    act(() => {
      setTargetDeviceID('8190c071-3f5f-4862-b741-b42591ac51fc');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.targetDeviceID).toBe('8190c071-3f5f-4862-b741-b42591ac51fc');
    expect(result.current.filteredRecords).toHaveLength(2);
    jest.useRealTimers();
  });

  test('setQuery.operation() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { operation: setOperation } = result.current.setQuery;
    act(() => {
      setOperation(['connect']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.operation).toEqual(['connect']);
    expect(result.current.filteredRecords).toHaveLength(3);
    act(() => {
      setOperation(['connect', 'disconnect']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.operation).toEqual(['connect', 'disconnect']);
    expect(result.current.filteredRecords).toHaveLength(6);
    jest.useRealTimers();
  });

  test('setQuery.dependencies() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { dependencies: setDependencies } = result.current.setQuery;
    act(() => {
      setDependencies([1, 2]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.dependencies).toEqual([1, 2]);
    expect(result.current.filteredRecords).toHaveLength(2);
    act(() => {
      setDependencies([1, 3]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.dependencies).toEqual([1, 3]);
    expect(result.current.filteredRecords).toHaveLength(3);
    jest.useRealTimers();
  });

  test('setQuery.status() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { status: setStatusQuery } = result.current.setQuery;
    act(() => {
      setStatusQuery(['COMPLETED']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.status).toEqual(['COMPLETED']);
    expect(result.current.filteredRecords).toHaveLength(4);
    act(() => {
      setStatusQuery(['COMPLETED', 'CANCELED']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.status).toEqual(['COMPLETED', 'CANCELED']);
    expect(result.current.filteredRecords).toHaveLength(8);
    jest.useRealTimers();
  });

  test('setQuery.rollbackOperation() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { rollbackOperation: setRollbackOperation } = result.current.setQuery;
    act(() => {
      setRollbackOperation(['disconnect']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackOperation).toEqual(['disconnect']);
    expect(result.current.filteredRecords).toHaveLength(3);
    act(() => {
      setRollbackOperation(['disconnect', 'shutdown']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackOperation).toEqual(['disconnect', 'shutdown']);
    expect(result.current.filteredRecords).toHaveLength(4);
    jest.useRealTimers();
  });

  test('setQuery.rollbackDependencies() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { rollbackDependencies: setRollbackDependencies } = result.current.setQuery;
    act(() => {
      setRollbackDependencies([1, 2]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackDependencies).toEqual([1, 2]);
    // 1 does not exist
    expect(result.current.filteredRecords).toHaveLength(1);
    act(() => {
      setRollbackDependencies([2, 5]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackDependencies).toEqual([2, 5]);
    // 5 does not exist
    expect(result.current.filteredRecords).toHaveLength(3);
    jest.useRealTimers();
  });

  test('setQuery.rollbackStatus() works correctly', async () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: dummyUseLayoutApplyDetail.data });
    const { result } = renderHook(() => useFilter());
    jest.useFakeTimers();
    const { rollbackStatus: setRollbackStatusQuery } = result.current.setQuery;
    act(() => {
      setRollbackStatusQuery(['COMPLETED']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackStatus).toEqual(['COMPLETED']);
    expect(result.current.filteredRecords).toHaveLength(4);
    act(() => {
      setRollbackStatusQuery(['COMPLETED', 'CANCELED']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.query.rollbackStatus).toEqual(['COMPLETED', 'CANCELED']);
    expect(result.current.filteredRecords).toHaveLength(4);
    jest.useRealTimers();
  });
});
