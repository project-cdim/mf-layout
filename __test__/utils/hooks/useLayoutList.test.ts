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

import { dummyAPILayoutDesignList } from '@/utils/dummy-data/layoutList/dummyAPILayoutDesignList';
import { dummyAPPLayoutList } from '@/utils/dummy-data/layoutList/dummyAPPLayoutList';
import { useLayoutList } from '@/utils/hooks';

const mockMutate = jest.fn();

jest.mock('swr/immutable', () => ({
  __esModule: true,
  ...jest.requireActual('swr/immutable'),
  default: jest.fn(),
}));

describe('useLayoutList', () => {
  beforeEach(() => {
    // Execute before each test
    mockMutate.mockReset();

    (useSWRImmutable as unknown as jest.Mock).mockReset();

    (useSWRImmutable as unknown as jest.Mock).mockReturnValue({
      data: dummyAPILayoutDesignList,
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
  });

  test('Can retrieve the list of parsed layout designs', () => {
    const { result } = renderHook(() => useLayoutList());

    expect(result.current.data[0].id).toEqual(dummyAPPLayoutList[0].id);
    expect(result.current.error).toBeNull();
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('Can retrieve the list of parsed layout designs (when SWR returns the default value)', () => {
    (useSWRImmutable as unknown as jest.Mock).mockReturnValue({
      data: undefined,
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
    const { result } = renderHook(() => useLayoutList());

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('That SWR returns error information', () => {
    (useSWRImmutable as unknown as jest.Mock).mockReturnValue({
      data: dummyAPILayoutDesignList,
      isValidating: false,
      error: { message: 'error1' },
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useLayoutList());

    expect(result.current.data[0].id).toEqual(dummyAPPLayoutList[0].id);
    expect(result.current.error).toEqual({ message: 'error1' });
    expect(result.current.isValidating).toBeFalsy();
  });

  test('If null is passed to endedAt, after parsing, endedAt will be set to undefined', () => {
    (useSWRImmutable as unknown as jest.Mock).mockReturnValue({
      data: { count: 1, designs: [{ ...dummyAPILayoutDesignList.designs[0], endedAt: null }] },
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
    const { result } = renderHook(() => useLayoutList());

    expect(result.current.data[0].endedAt).toBeUndefined();
    expect(result.current.error).toBeNull();
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
