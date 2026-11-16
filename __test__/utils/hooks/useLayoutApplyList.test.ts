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

import { renderHook } from '@testing-library/react';
import useSWRImmutable from 'swr/immutable';

import { useMSW } from '@/shared-modules/utils/hooks';

import { dummyAPILayoutApplyList } from '@/utils/dummy-data/layoutApplyList/dummyAPILayoutApplyList';
import { dummyAPPLayoutApplyList } from '@/utils/dummy-data/layoutApplyList/dummyAPPLayoutApplyList';
import { useLayoutApplyList } from '@/utils/hooks';

const mockMutate = jest.fn();

jest.mock('swr/immutable', () => ({
  __esModule: true,
  ...jest.requireActual('swr/immutable'),
  default: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useMSW: jest.fn(),
}));

describe('useLayoutApplyList', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    mockMutate.mockReset();
    // @ts-ignore
    useSWRImmutable.mockReset();
    // @ts-ignore
    useSWRImmutable.mockReturnValue({
      data: dummyAPILayoutApplyList,
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
    // @ts-ignore
    useMSW.mockReset();
    // @ts-ignore
    useMSW.mockReturnValue(false);
  });

  test('Can retrieve the list of parsed layout applies', () => {
    // @ts-ignore
    useMSW.mockReturnValue(true);
    const { result } = renderHook(() => useLayoutApplyList());

    expect(result.current.data).toEqual(dummyAPPLayoutApplyList);
    expect(result.current.error).toBeNull();
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('Can retrieve the list of parsed layout applies (when SWR returns the default value)', () => {
    // @ts-ignore
    useMSW.mockReturnValue(true);
    // @ts-ignore
    useSWRImmutable.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
    const { result } = renderHook(() => useLayoutApplyList());

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('That SWR returns error information', () => {
    // @ts-ignore
    useSWRImmutable.mockReturnValue({
      data: dummyAPILayoutApplyList,
      isValidating: false,
      error: { message: 'error1' },
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useLayoutApplyList());

    expect(result.current.data).toEqual(dummyAPPLayoutApplyList);
    expect(result.current.error).toEqual({ message: 'error1' });
    expect(result.current.isValidating).toBeFalsy();
  });
});
