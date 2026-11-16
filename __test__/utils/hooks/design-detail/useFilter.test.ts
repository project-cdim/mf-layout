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

import { renderHook, act } from '@testing-library/react';

import { ProcedureOperation } from '@/shared-modules/types';

import { APPLayoutDesignDetail, APPProcedure } from '@/types';
import { useLayoutDesignDetail } from '@/utils/hooks';
import { useFilter } from '@/utils/hooks/design-detail/useFilter';

// Mock the hooks and modules used by useFilter
jest.mock('@/utils/hooks', () => ({
  __esModule: true,
  useLayoutDesignDetail: jest.fn(),
}));

jest.mock('@mantine/hooks', () => ({
  __esModule: true,
  useDebouncedValue: jest.fn().mockImplementation((value) => [value]),
}));

// Mock shared-modules/types to provide the PROCEDURE_OPERATION constant
jest.mock('@/shared-modules/types', () => ({
  PROCEDURE_OPERATION: ['connect', 'disconnect', 'boot', 'shutdown'],
  ProcedureOperation: jest.requireActual('@/shared-modules/types').ProcedureOperation,
}));

describe('useFilter', () => {
  // Sample procedure data for testing
  const dummyProcedures: APPProcedure[] = [
    {
      operationID: 1,
      targetCPUID: 'CPU-001',
      targetDevice: 'Device-001',
      operation: 'connect' as ProcedureOperation,
      dependencies: [2, 3],
    },
    {
      operationID: 2,
      targetCPUID: 'CPU-002',
      targetDevice: 'Device-002',
      operation: 'disconnect' as ProcedureOperation,
      dependencies: [],
    },
    {
      operationID: 3,
      targetCPUID: 'CPU-003',
      targetDevice: 'Device-003',
      operation: 'boot' as ProcedureOperation,
      dependencies: [1],
    },
    {
      operationID: 0,
      targetCPUID: '',
      targetDevice: '',
      operation: 'shutdown' as ProcedureOperation,
      dependencies: [],
    },
  ];

  // Mock layout design detail data
  const mockLayoutDesignDetail: APPLayoutDesignDetail = {
    designID: 'design-123',
    status: 'COMPLETED',
    startedAt: new Date('2025-01-01'),
    nodes: [],
    procedures: dummyProcedures,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: mockLayoutDesignDetail,
      error: null,
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
    });
  });

  test('Returns expected filter structure', () => {
    const { result } = renderHook(() => useFilter());

    expect(result.current).toHaveProperty('filteredRecords');
    expect(result.current).toHaveProperty('query');
    expect(result.current).toHaveProperty('setQuery');
    expect(result.current).toHaveProperty('selectOptions');

    // Check query structure
    expect(result.current.query).toEqual({
      ID: [undefined, undefined],
      targetCPUID: '',
      targetDeviceID: '',
      operation: [],
      dependencies: [undefined, undefined],
    });

    // Check setQuery structure
    expect(typeof result.current.setQuery.ID).toBe('function');
    expect(typeof result.current.setQuery.targetCPUID).toBe('function');
    expect(typeof result.current.setQuery.targetDeviceID).toBe('function');
    expect(typeof result.current.setQuery.operation).toBe('function');
    expect(typeof result.current.setQuery.dependencies).toBe('function');

    // Check selectOptions - all 4 operations should be present because our dummy data includes all of them
    expect(result.current.selectOptions.operation).toHaveLength(4);
    const operationValues = result.current.selectOptions.operation.map((opt) => opt.value);
    expect(operationValues).toContain('connect');
    expect(operationValues).toContain('disconnect');
    expect(operationValues).toContain('boot');
    expect(operationValues).toContain('shutdown');
  });

  test('Returns all records when no filters are applied', () => {
    const { result } = renderHook(() => useFilter());
    expect(result.current.filteredRecords).toEqual(dummyProcedures);
  });

  test('Filters records by ID range', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.ID([1, 2]);
    });

    expect(result.current.filteredRecords).toHaveLength(2);
    expect(result.current.filteredRecords[0].operationID).toBe(1);
    expect(result.current.filteredRecords[1].operationID).toBe(2);
  });

  test('Filters records by targetCPUID', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.targetCPUID('CPU-001');
    });

    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].targetCPUID).toBe('CPU-001');
  });

  test('Filters records by partial targetCPUID match', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.targetCPUID('CPU');
    });

    expect(result.current.filteredRecords).toHaveLength(3);
  });

  test('Filters records by targetDeviceID', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.targetDeviceID('Device-002');
    });

    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].targetDevice).toBe('Device-002');
  });

  test('Filters records by operation', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.operation(['boot']);
    });

    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].operation).toBe('boot');
  });

  test('Filters records by multiple operations', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.operation(['connect', 'disconnect']);
    });

    expect(result.current.filteredRecords).toHaveLength(2);
    expect(result.current.filteredRecords[0].operation).toBe('connect');
    expect(result.current.filteredRecords[1].operation).toBe('disconnect');
  });

  test('Filters records by dependencies', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.dependencies([1, 1]);
    });

    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].dependencies).toContain(1);
  });

  test('Combined filters work correctly', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.ID([1, 3]);
      result.current.setQuery.targetCPUID('CPU');
      result.current.setQuery.operation(['connect', 'boot']);
    });

    expect(result.current.filteredRecords).toHaveLength(2);
    expect(result.current.filteredRecords.map((r) => r.operationID)).toEqual([1, 3]);
  });

  test('Handles undefined data from useLayoutDesignDetail', () => {
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: null,
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useFilter());
    expect(result.current.filteredRecords).toEqual([]);
  });

  test('Handles empty procedures array', () => {
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: {
        ...mockLayoutDesignDetail,
        procedures: [],
      },
      error: null,
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useFilter());
    expect(result.current.filteredRecords).toEqual([]);
    expect(result.current.selectOptions.operation).toEqual([]);
  });

  test('useSelectOption only includes operations present in records', () => {
    // Mock with only add and delete operations
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: {
        ...mockLayoutDesignDetail,
        procedures: [
          {
            operationID: 1,
            targetCPUID: 'CPU-001',
            targetDevice: 'Device-001',
            operation: 'connect' as ProcedureOperation,
            dependencies: [2],
          },
          {
            operationID: 2,
            targetCPUID: 'CPU-002',
            targetDevice: 'Device-002',
            operation: 'disconnect' as ProcedureOperation,
            dependencies: [],
          },
        ],
      },
      error: null,
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useFilter());

    expect(result.current.selectOptions.operation).toHaveLength(2);
    const operationValues = result.current.selectOptions.operation.map((opt) => opt.value);
    expect(operationValues).toContain('connect');
    expect(operationValues).toContain('disconnect');
    expect(operationValues).not.toContain('boot');
  });

  test('Handles boundary values properly', () => {
    const { result } = renderHook(() => useFilter());

    // Test with operationID = 0
    act(() => {
      result.current.setQuery.ID([0, 0]);
    });

    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].operationID).toBe(0);

    // Test with empty strings
    act(() => {
      result.current.setQuery.ID([undefined, undefined]);
      result.current.setQuery.targetCPUID('');
    });

    expect(result.current.filteredRecords).toHaveLength(4);

    act(() => {
      result.current.setQuery.targetDeviceID('');
    });

    expect(result.current.filteredRecords).toHaveLength(4);
  });

  test('Empty array for operation filter returns all records', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.operation([]);
    });

    expect(result.current.filteredRecords).toHaveLength(4);
  });

  test('Undefined range limits match all values', () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setQuery.ID([undefined, undefined]);
      result.current.setQuery.dependencies([undefined, undefined]);
    });

    expect(result.current.filteredRecords).toHaveLength(4);
  });
});
