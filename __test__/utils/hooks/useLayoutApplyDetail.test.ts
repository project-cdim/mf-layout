/*
 * Copyright 2025-2026 NEC Corporation.
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

import { dummyAPIApplyIDGetResponse as dummydata01 } from '@/utils/dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse01';
import { dummyAPIApplyIDGetResponse as dummydata02 } from '@/utils/dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse02';
import { dummyAPIApplyIDGetResponse as dummydata03 } from '@/utils/dummy-data/layoutApplyDetail/dummyAPIApplyIDGetResponse03';
import { useLayoutApplyDetail } from '@/utils/hooks';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn().mockReturnValue({ query: {}, isReady: true }),
}));

jest.mock('swr/immutable', () => ({
  __esModule: true,
  ...jest.requireActual('swr/immutable'),
  default: jest.fn(),
}));
jest.mock('@/shared-modules/utils/', () => ({
  fetcher: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn().mockReturnValue({ status: undefined }),
}));

/**
 * Helper function to create mock implementation for useSWRImmutable
 */
const createMockImplementation = (mockData: any) => (key: string) => {
  if (key.includes('layout-apply')) {
    return {
      data: mockData,
      error: undefined,
      isValidating: false,
      mutate: jest.fn(),
    };
  }
  return {
    data: { resources: [] },
    error: undefined,
    isValidating: false,
    mutate: jest.fn(),
  };
};

const mockDataProvisional = {
  applyID: '123',
  status: 'success',
  startedAt: '2023-01-01T00:00:00Z',
  procedures: [
    {
      operationID: 1,
      targetCPUID: 'cpu1',
      targetDeviceID: 'device1',
      operation: 'operation1',
      dependencies: [],
    },
  ],
};
const mockDataEmptyProcedures = { ...mockDataProvisional, procedures: [] };

describe('useLayoutApplyDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    (useSWRImmutable as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should return data when fetch is successful and check mutate', () => {
    const mockData = mockDataProvisional;

    const mockMutate01 = jest.fn();
    const mockMutate02 = jest.fn();

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: mockMutate01,
        };
      }
      return {
        data: { resources: [{ device: { deviceID: 'device1', type: 'type1' } }] },
        error: undefined,
        isValidating: false,
        mutate: mockMutate02,
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
        }),
        procedures: expect.arrayContaining([
          expect.objectContaining({
            operationID: mockData.procedures[0].operationID,
            targetCPUID: mockData.procedures[0].targetCPUID,
            targetDevice: 'Type1(' + mockData.procedures[0].targetDeviceID + ')',
          }),
        ]),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });

    // call mutate and check called mutate
    result.current.mutate();
    expect(mockMutate01).toHaveBeenCalledTimes(1);
    expect(mockMutate02).toHaveBeenCalledTimes(1);
  });

  test('should return error when fetch fails', () => {
    const mockError = new Error('Fetch error');

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: undefined,
          error: mockError,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: mockError,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual({ layout: mockError, resource: mockError });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle partial data', () => {
    const mockData = mockDataProvisional;

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
        }),
        procedures: expect.arrayContaining([
          expect.objectContaining({
            operationID: mockData.procedures[0].operationID,
            targetCPUID: mockData.procedures[0].targetCPUID,
            targetDevice: mockData.procedures[0].targetDeviceID,
          }),
        ]),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle empty procedures', () => {
    const mockData = mockDataEmptyProcedures;

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
        }),
        procedures: mockData.procedures,
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle empty procedures and exist resumeAt', () => {
    const mockData = { ...mockDataEmptyProcedures, resumedAt: '2023-01-01T00:00:00Z' };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
          resumedAt: new Date(mockData.resumedAt),
        }),
        procedures: mockData.procedures,
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle empty procedures and exist resumeAt, canceledAt', () => {
    const mockData = {
      ...mockDataEmptyProcedures,
      status: 'CANCELING',
      resumedAt: '2023-01-01T00:00:00Z',
      canceledAt: '2023-01-01T00:00:00Z',
    };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
          resumedAt: new Date(mockData.resumedAt),
          canceledAt: new Date(mockData.canceledAt),
        }),
        procedures: mockData.procedures,
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle exist canceledAt, rollback.startedAt', () => {
    const mockData = {
      ...mockDataEmptyProcedures,
      status: 'CANCELING',
      canceledAt: '2023-01-01T00:00:00Z',
      rollback: { startedAt: '2023-01-02T00:00:00Z' },
    };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
          canceledAt: new Date(mockData.canceledAt),
        }),
        rollback: expect.objectContaining({
          startedAt: new Date(mockData.rollback.startedAt),
        }),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle Canceld, rollbackstatus:FAILD', () => {
    const mockData = dummydata01;

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: 'CANCELED',
          startedAt: new Date(mockData.startedAt),
          canceledAt: new Date(mockData.canceledAt ?? ''),
          endedAt: new Date(mockData.endedAt ?? ''),
        }),
        rollback: expect.objectContaining({
          status: mockData.rollback?.status,
          startedAt: new Date(mockData.rollback?.startedAt ?? ''),
          endedAt: new Date(mockData.rollback?.endedAt ?? ''),
        }),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  // eslint-disable-next-line complexity
  test('should handle COMPLETED, resumed', () => {
    const mockData = dummydata02;

    (useSWRImmutable as jest.Mock).mockImplementation(createMockImplementation(mockData));

    const { result } = renderHook(() => useLayoutApplyDetail());

    const expectedProcedure0 = {
      operationID: mockData.procedures?.[0].operationID,
      targetCPUID: mockData.procedures?.[0].targetCPUID,
      targetDevice: mockData.procedures?.[0].targetDeviceID,
      apply: {
        dependencies: mockData.procedures?.[0].dependencies,
        operation: mockData.procedures?.[0].operation,
        status: mockData.result?.[0].status,
      },
    };

    const expectedProcedure1 = {
      operationID: mockData.procedures?.[1].operationID,
      targetDevice: mockData.resumeProcedures?.[0]?.targetDeviceID ?? '',
      apply: {
        dependencies: mockData.resumeProcedures?.[0].dependencies,
        operation: mockData.resumeProcedures?.[0].operation,
        status: mockData.result?.[2].status,
      },
    };

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
          suspendedAt: new Date(mockData.suspendedAt ?? ''),
          resumedAt: new Date(mockData.resumedAt ?? ''),
          endedAt: new Date(mockData.endedAt ?? ''),
        }),
        procedures: expect.objectContaining([expectedProcedure0, expectedProcedure1]),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  // eslint-disable-next-line complexity
  test('should handle CANCELD, rollback and rollbackResumed', () => {
    const mockData = dummydata03;

    (useSWRImmutable as jest.Mock).mockImplementation(createMockImplementation(mockData));

    const { result } = renderHook(() => useLayoutApplyDetail());

    const expectedProcedure0 = {
      operationID: mockData.procedures?.[0].operationID,
      targetCPUID: mockData.procedures?.[0].targetCPUID,
      targetDevice: mockData.procedures?.[0].targetDeviceID,
      apply: {
        operation: mockData.procedures?.[0].operation,
        dependencies: mockData.procedures?.[0].dependencies,
        status: mockData.result?.[0].status,
        startedAt: new Date(mockData.result?.[0].startedAt ?? ''),
        endedAt: new Date(mockData.result?.[0].endedAt ?? ''),
        error: undefined,
      },
      rollback: {
        operation: mockData.rollback?.procedures?.[0].operation,
        dependencies: mockData.rollback?.procedures?.[0].dependencies,
        status: mockData.rollback?.result?.[1].status,
        startedAt: new Date(mockData.rollback?.result?.[1].startedAt ?? ''),
        endedAt: new Date(mockData.rollback?.result?.[1].endedAt ?? ''),
        error: undefined,
      },
    };

    const expectedProcedure1 = {
      operationID: mockData.procedures?.[1].operationID,
      targetDevice: mockData.procedures?.[1].targetDeviceID,
      apply: expect.objectContaining({
        dependencies: mockData.procedures?.[1].dependencies,
        operation: mockData.procedures?.[1].operation,
        status: mockData.result?.[1].status,
      }),
    };

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          status: mockData.status,
          startedAt: new Date(mockData.startedAt),
          suspendedAt: undefined,
          endedAt: new Date(mockData.endedAt ?? ''),
          canceledAt: undefined,
          resumedAt: undefined,
        }),
        rollback: expect.objectContaining({
          status: mockData.rollback?.status,
          startedAt: new Date(mockData.rollback?.startedAt ?? ''),
          resumedAt: new Date(mockData.rollback?.resumedAt ?? ''),
          endedAt: new Date(mockData.rollback?.endedAt ?? ''),
          suspendedAt: new Date(mockData.rollback?.suspendedAt ?? ''),
        }),
        procedures: expect.objectContaining([expectedProcedure0, expectedProcedure1]),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle error state', () => {
    const mockError = new Error('Failed to fetch');

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: undefined,
          error: mockError,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: mockError,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual({ layout: mockError, resource: mockError });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle no data', () => {
    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: undefined,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: undefined,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle unexpected data structure', () => {
    const mockData = {
      unexpectedKey: 'unexpectedValue',
    };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(JSON.stringify(result.current.data)).toEqual(
      JSON.stringify({
        apply: {
          canceledAt: undefined,
          endedAt: undefined,
          resumedAt: undefined,
          startedAt: new Date(NaN),
          status: undefined,
          suspendedAt: undefined,
        },
        applyID: undefined,
        procedures: undefined,
        rollback: undefined,
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle resumedAt and rollbackStartedAt with valid data', () => {
    const mockData = {
      ...mockDataEmptyProcedures,
      resumedAt: '2023-01-01T00:00:00Z',
      rollback: { startedAt: '2023-01-02T00:00:00Z' },
    };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          resumedAt: new Date(mockData.resumedAt),
        }),
        rollback: expect.objectContaining({
          startedAt: new Date(mockData.rollback.startedAt),
        }),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  test('should handle startedAt and rollbackResumedAt with valid data', () => {
    const mockData = {
      ...mockDataEmptyProcedures,
      rollback: { resumedAt: '2023-01-03T00:00:00Z' },
    };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return {
          data: mockData,
          error: undefined,
          isValidating: false,
          mutate: jest.fn(),
        };
      }
      return {
        data: { resources: [] },
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
      };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data).toEqual(
      expect.objectContaining({
        applyID: mockData.applyID,
        apply: expect.objectContaining({
          startedAt: new Date(mockData.startedAt),
        }),
        rollback: expect.objectContaining({
          resumedAt: new Date(mockData.rollback.resumedAt),
        }),
      })
    );
    expect(result.current.error).toEqual({ layout: undefined, resource: undefined });
    expect(result.current.isValidating).toEqual({ layout: false, resource: false });
  });

  describe('getErrorByResult: responseBody format variations', () => {
    const buildMockWithResult = (responseBody: unknown) => ({
      ...mockDataProvisional,
      result: [
        {
          operationID: 1,
          status: 'FAILED',
          startedAt: '2023-01-01T00:00:00Z',
          endedAt: '2023-01-01T01:00:00Z',
          responseBody,
        },
      ],
    });

    const renderWithData = (mockData: object) => {
      (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
        if (key.includes('layout-apply')) {
          return { data: mockData, error: undefined, isValidating: false, mutate: jest.fn() };
        }
        return { data: { resources: [] }, error: undefined, isValidating: false, mutate: jest.fn() };
      });
      return renderHook(() => useLayoutApplyDetail());
    };

    test('format1: { code, message: string } - should extract code and message as-is', () => {
      const mockData = buildMockWithResult({
        code: 'EF003BAS010',
        message: 'Your request is not supported for the specified target dee.',
      });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'EF003BAS010',
        message: 'Your request is not supported for the specified target dee.',
      });
    });

    test('format2: { errorInfo: [{ errorCode, errorMessage }] } - should extract first element', () => {
      const mockData = buildMockWithResult({
        deviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
        errorInfo: [
          { errorCode: 'EF013BAS005', errorMessage: 'The specified Device ID is not found.' },
          { errorCode: 'EF013BAS006', errorMessage: 'Another error.' },
        ],
        infoTimestamp: '2026-04-07T07:51:02Z',
      });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'EF013BAS005',
        message: 'The specified Device ID is not found.',
      });
    });

    test('format3: { code, message: Array<{ msg, ... }> } - should extract code and first msg', () => {
      const mockData = buildMockWithResult({
        code: 'EF003BAS012',
        message: [
          {
            ctx: { error: 'invalid group length in group 4: expected 12, found 13' },
            loc: ['path', 'sourceDeviceID'],
            msg: 'Input should be a valid UUID, invalid group length in group 4: expected 12, found 13',
            type: 'uuid_parsing',
            input: '38ac1c7f-7abc-469f-a313-7d2851c80d661',
          },
          {
            msg: 'Another validation error.',
            type: 'other_error',
          },
        ],
      });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'EF003BAS012',
        message: 'Input should be a valid UUID, invalid group length in group 4: expected 12, found 13',
      });
    });

    test('unmatched responseBody - should return dummy fallback', () => {
      const mockData = buildMockWithResult({ someOtherField: 'value' });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'Unknown',
        message: 'If the problem persists, please contact your administrator',
      });
    });

    test('null responseBody - should return undefined', () => {
      const mockData = buildMockWithResult(null);
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toBeUndefined();
    });

    test('format2: empty errorInfo array - should return dummy fallback', () => {
      const mockData = buildMockWithResult({ errorInfo: [] });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'Unknown',
        message: 'If the problem persists, please contact your administrator',
      });
    });

    test('format2: errorInfo[0] missing errorCode - should return dummy fallback', () => {
      const mockData = buildMockWithResult({ errorInfo: [{ errorMessage: 'Some error.' }] });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'Unknown',
        message: 'If the problem persists, please contact your administrator',
      });
    });

    test('format2: errorInfo[0] missing errorMessage - should return dummy fallback', () => {
      const mockData = buildMockWithResult({ errorInfo: [{ errorCode: 'EF013BAS005' }] });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'Unknown',
        message: 'If the problem persists, please contact your administrator',
      });
    });

    test('format2: errorInfo[0] is null - should return dummy fallback', () => {
      const mockData = buildMockWithResult({ errorInfo: [null] });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'Unknown',
        message: 'If the problem persists, please contact your administrator',
      });
    });

    test('format3: message array with no msg field - should return dummy fallback', () => {
      const mockData = buildMockWithResult({ code: 'EF003BAS012', message: [{ type: 'other_error' }] });
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toEqual({
        code: 'Unknown',
        message: 'If the problem persists, please contact your administrator',
      });
    });

    test('status is not FAILED - should return undefined', () => {
      const mockData = {
        ...mockDataProvisional,
        result: [
          {
            operationID: 1,
            status: 'COMPLETED',
            startedAt: '2023-01-01T00:00:00Z',
            endedAt: '2023-01-01T01:00:00Z',
            responseBody: { code: 'EF003BAS010', message: 'Error message should be ignored.' },
          },
        ],
      };
      const { result } = renderWithData(mockData);
      expect(result.current.data?.procedures?.[0].apply.error).toBeUndefined();
    });
  });

  test('should handle procedure with undefined targetDeviceID', () => {
    const mockData = {
      ...mockDataProvisional,
      procedures: [
        {
          operationID: 1,
          targetCPUID: 'cpu1',
          targetDeviceID: undefined,
          operation: 'operation1',
          dependencies: [],
        },
      ],
    };

    (useSWRImmutable as jest.Mock).mockImplementation((key: string) => {
      if (key.includes('layout-apply')) {
        return { data: mockData, error: undefined, isValidating: false, mutate: jest.fn() };
      }
      return { data: { resources: [] }, error: undefined, isValidating: false, mutate: jest.fn() };
    });

    const { result } = renderHook(() => useLayoutApplyDetail());

    expect(result.current.data?.procedures?.[0].targetDevice).toBe('');
  });
});
