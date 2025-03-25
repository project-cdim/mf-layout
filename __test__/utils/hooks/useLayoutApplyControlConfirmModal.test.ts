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

import { useLayoutApplyControlConfirmModal, useLayoutApplyDetail } from '@/utils/hooks';

jest.mock('@/utils/hooks/useLayoutApplyDetail', () => ({
  useLayoutApplyDetail: jest.fn(),
}));

describe('useLayoutApplyControlConfirmModal', () => {
  const mockUseLayoutApplyDetail = {
    data: {
      rollback: {
        status: undefined,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLayoutApplyDetail as jest.Mock).mockReturnValue(mockUseLayoutApplyDetail);
  });

  test('Initialize with default values', () => {
    const { result } = renderHook(() => useLayoutApplyControlConfirmModal({ id: 'test-id' }));

    expect(result.current.open).toBeDefined();
    expect(result.current.setAction).toBeDefined();
    expect(result.current.setSubmitFunction).toBeDefined();
    expect(result.current.setError).toBeDefined();
    expect(result.current.setResponse).toBeDefined();
    expect(result.current.response).toBeUndefined();
    expect(result.current.successMessage).toBe('Requested "{action}" the layout apply');
    expect(result.current.modalProps).toEqual({
      close: expect.any(Function),
      submitFunction: undefined,
      id: 'test-id',
      isOpen: false,
      confirmTitle: '',
      confirmMessage: 'Do you want to "{action}" the layout apply?',
      submitButtonLabel: 'Yes',
      cancelButtonLabel: 'No',
      errorTitle: 'Failed to "{action}" the layout apply',
      error: undefined,
    });
  });

  test('When isRollback is true', () => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({ data: { rollback: { status: 'IN_PROGRESS' } } });

    const { result } = renderHook(() => useLayoutApplyControlConfirmModal({ id: 'test-id2' }));

    expect(result.current.open).toBeDefined();
    expect(result.current.setAction).toBeDefined();
    expect(result.current.setSubmitFunction).toBeDefined();
    expect(result.current.setError).toBeDefined();
    expect(result.current.setResponse).toBeDefined();
    expect(result.current.response).toBeUndefined();
    expect(result.current.successMessage).toBe('Requested "{action}" the rollback');
    expect(result.current.modalProps).toEqual({
      close: expect.any(Function),
      submitFunction: undefined,
      id: 'test-id2',
      isOpen: false,
      confirmTitle: '',
      confirmMessage: 'Do you want to "{action}" the rollback?',
      submitButtonLabel: 'Yes',
      cancelButtonLabel: 'No',
      errorTitle: 'Failed to "{action}" the rollback',
      error: undefined,
    });
  });

  test('Set action and update displayAction', () => {
    const { result } = renderHook(() => useLayoutApplyControlConfirmModal({ id: 'test-id' }));

    act(() => {
      result.current.setAction('Cancel');
    });

    expect(result.current.modalProps.confirmTitle).toBe('Cancel');
    expect(result.current.modalProps.confirmMessage).toBe('Do you want to "{action}" the layout apply?');
    expect(result.current.modalProps.errorTitle).toBe('Failed to "{action}" the layout apply');
  });
});
