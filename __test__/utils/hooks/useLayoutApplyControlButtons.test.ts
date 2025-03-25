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
import axios from 'axios';

import { ApplyStatus, RollbackStatus } from '@/shared-modules/types';
import { usePermission } from '@/shared-modules/utils/hooks';

import { useLayoutApplyControlButtons } from '@/utils/hooks';

jest.mock('@/shared-modules/utils/hooks', () => ({
  usePermission: jest.fn().mockReturnValue(true),
}));
const mockedUsePermission = usePermission as jest.MockedFunction<typeof usePermission>;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useLayoutApplyControlButtons', () => {
  const defaultProps = {
    status: undefined as ApplyStatus | undefined,
    rollbackStatus: undefined as RollbackStatus | undefined,
    applyID: 'test-apply-id',
    pageReload: jest.fn(),
    setFunction: jest.fn(),
    setAction: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    setError: jest.fn(),
    setResponse: jest.fn(),
  };

  test('return correct display parts for undefined status', () => {
    const { result } = renderHook(() => useLayoutApplyControlButtons(defaultProps));
    expect(result.current.phaseText).toBe('');
    expect(result.current.statusText).toBe('');
    expect(result.current.activeButtons).toEqual([]);
  });

  test('return correct display parts for apply status', () => {
    const props = { ...defaultProps, status: 'IN_PROGRESS' as ApplyStatus };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    expect(result.current.phaseText).toBe('Apply');
    expect(result.current.statusText).toBe('In Progress');
    expect(result.current.activeButtons).toEqual(['Cancel', 'Rollback']);
  });

  test('return correct display parts for rollback status(SUSPENDED)', () => {
    const props = { ...defaultProps, status: 'CANCELED' as ApplyStatus, rollbackStatus: 'SUSPENDED' as RollbackStatus };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    expect(result.current.phaseText).toBe('Rollback');
    expect(result.current.statusText).toBe('Suspended.status');
    expect(result.current.activeButtons).toEqual(['Forced Termination', 'Resume']);
  });

  test('return correct display parts for rollback status(IN_PROGRESS)', () => {
    const props = {
      ...defaultProps,
      status: 'CANCELED' as ApplyStatus,
      rollbackStatus: 'IN_PROGRESS' as RollbackStatus,
    };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    expect(result.current.phaseText).toBe('Rollback');
    expect(result.current.statusText).toBe('In Progress');
    expect(result.current.activeButtons).toEqual(['Forced Termination']);
  });

  test('return correct display parts for apply status(COMPLETED)', () => {
    const props = { ...defaultProps, status: 'COMPLETED' as ApplyStatus };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    expect(result.current.phaseText).toBe('Apply');
    expect(result.current.statusText).toBe('Completed');
    expect(result.current.activeButtons).toEqual([]);
  });

  test('handle cancel action correctly', async () => {
    const props = { ...defaultProps, status: 'IN_PROGRESS' as ApplyStatus };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    const handleCancel = result.current.handleCancel;

    (axios.put as jest.Mock).mockReset().mockResolvedValue({});

    act(() => {
      handleCancel();
    });

    expect(props.setError).toHaveBeenCalledWith(undefined);
    expect(props.setResponse).toHaveBeenCalledWith(undefined);
    expect(props.openModal).toHaveBeenCalled();
    expect(props.setAction).toHaveBeenCalledWith('Cancel');
    expect(props.setFunction).toHaveBeenCalled();

    const setFunctionCallback = props.setFunction.mock.calls[0][0];
    await act(async () => {
      setFunctionCallback()();
    });

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply/test-apply-id?action=cancel`
    );
    expect(props.closeModal).toHaveBeenCalled();
    expect(props.pageReload).toHaveBeenCalled();
  });

  test('handle cancel action correctly with error', async () => {
    const props = { ...defaultProps, status: 'IN_PROGRESS' as ApplyStatus };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    const handleCancel = result.current.handleCancel;

    (axios.put as jest.Mock).mockReset().mockRejectedValue({});

    act(() => {
      handleCancel();
    });

    expect(props.setError).toHaveBeenCalledWith(undefined);
    expect(props.setResponse).toHaveBeenCalledWith(undefined);
    expect(props.openModal).toHaveBeenCalled();
    expect(props.setAction).toHaveBeenCalledWith('Cancel');
    expect(props.setFunction).toHaveBeenCalled();

    const setFunctionCallback = props.setFunction.mock.calls[0][0];
    await act(async () => {
      setFunctionCallback()();
    });

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply/test-apply-id?action=cancel`
    );
    expect(props.setError).toHaveBeenCalled();
  });

  test('no permissions, return an empty activeButtons array', () => {
    mockedUsePermission.mockReturnValue(false);
    const props = { ...defaultProps, status: 'SUSPENDED' as ApplyStatus };
    const { result } = renderHook(() => useLayoutApplyControlButtons(props));
    expect(result.current.activeButtons).toEqual([]);
  });
});
