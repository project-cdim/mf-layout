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

import React, { ReactElement } from 'react';

import { cleanup, screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import {
  MultiSelectForTableFilter,
  NumberRangeForTableFilter,
  TextInputForTableFilter,
} from '@/shared-modules/components';

import { APPProcedure } from '@/types';
import { ResourceIdWithPageLink } from '@/components';
import { useColumns } from '@/utils/hooks/design-detail/useColumns';
import { DesignProcedureFilter } from '@/utils/hooks/design-detail/useFilter';
import { ProcedureOperation } from '@/shared-modules/types';

// Mock components used in useColumns
jest.mock('@/shared-modules/components', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/components'),
  MultiSelectForTableFilter: jest.fn().mockImplementation((props) => props.label),
  NumberRangeForTableFilter: jest.fn().mockImplementation((props) => JSON.stringify(props.values)),
  TextInputForTableFilter: jest.fn().mockImplementation((props) => props.label),
}));

// Mock ResourceIdWithPageLink component
jest.mock('@/components', () => ({
  __esModule: true,
  ResourceIdWithPageLink: jest.fn().mockImplementation(({ id }) => <span data-testid='resource-id'>{id}</span>),
}));

describe('useColumns', () => {
  const mockSetIdQuery = jest.fn();
  const mockSetTargetCPUIDQuery = jest.fn();
  const mockSetTargetDeviceIDQuery = jest.fn();
  const mockSetOperationQuery = jest.fn();
  const mockSetDependenciesQuery = jest.fn();

  // Sample procedure data for testing
  const dummyProcedure1: APPProcedure = {
    operationID: 1,
    targetCPUID: 'CPU-001',
    targetDevice: 'Device-001',
    operation: 'connect',
    dependencies: [2, 3],
  };

  const dummyProcedure2: APPProcedure = {
    operationID: 2,
    targetCPUID: 'CPU-002',
    targetDevice: 'Device-002',
    operation: 'disconnect',
    dependencies: [],
  };

  const dummyProcedure3: APPProcedure = {
    operationID: 0,
    targetCPUID: '',
    targetDevice: '',
    operation: 'boot',
    dependencies: [1],
  };

  // Mock filter object
  const mockFilter: DesignProcedureFilter = {
    filteredRecords: [dummyProcedure1, dummyProcedure2, dummyProcedure3],
    query: {
      ID: [1, 10],
      targetCPUID: 'CPU',
      targetDeviceID: 'Device',
      operation: ['connect', 'disconnect'] as ProcedureOperation[],
      dependencies: [1, undefined],
    },
    setQuery: {
      ID: mockSetIdQuery,
      targetCPUID: mockSetTargetCPUIDQuery,
      targetDeviceID: mockSetTargetDeviceIDQuery,
      operation: mockSetOperationQuery,
      dependencies: mockSetDependenciesQuery,
    },
    selectOptions: {
      operation: [
        { value: 'connect', label: 'Connect' },
        { value: 'disconnect', label: 'Disconnect' },
        { value: 'boot', label: 'Boot' },
      ],
    },
  };

  // Mock filter with empty values
  const mockEmptyFilter: DesignProcedureFilter = {
    filteredRecords: [dummyProcedure1, dummyProcedure2, dummyProcedure3],
    query: {
      ID: [undefined, undefined],
      targetCPUID: '',
      targetDeviceID: '',
      operation: [] as ProcedureOperation[],
      dependencies: [undefined, undefined],
    },
    setQuery: {
      ID: mockSetIdQuery,
      targetCPUID: mockSetTargetCPUIDQuery,
      targetDeviceID: mockSetTargetDeviceIDQuery,
      operation: mockSetOperationQuery,
      dependencies: mockSetDependenciesQuery,
    },
    selectOptions: {
      operation: [
        { value: 'connect', label: 'Connect' },
        { value: 'disconnect', label: 'Disconnect' },
        { value: 'boot', label: 'Boot' },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up ResourceIdWithPageLink mock implementation
    (ResourceIdWithPageLink as jest.Mock).mockImplementation(({ id }) => <span data-testid='resource-id'>{id}</span>);
  });

  afterEach(() => {
    cleanup();
  });

  test('Returns columns of type DataTableColumn with correct structure', () => {
    const columns = useColumns(mockFilter);

    expect(columns).toHaveLength(5);

    // operationID column
    expect(columns[0].accessor).toBe('operationID');
    expect(columns[0].title).toBe('ID');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();

    // targetCPUID column
    expect(columns[1].accessor).toBe('targetCPUID');
    expect(columns[1].title).toBe('Host CPU ID');
    expect(columns[1].filtering).toBeTruthy();

    // targetDevice column
    expect(columns[2].accessor).toBe('targetDevice');
    expect(columns[2].title).toBe('Target Device');
    expect(columns[2].filtering).toBeTruthy();

    // operation column
    expect(columns[3].accessor).toBe('operation');
    expect(columns[3].title).toBe('Operation Type');
    expect(columns[3].filtering).toBeTruthy();

    // dependencies column
    expect(columns[4].accessor).toBe('dependencies');
    expect(columns[4].title).toBe('Dependency ID');
    expect(columns[4].filtering).toBeTruthy();
  });

  test('Filtering flag is correctly set based on query values', () => {
    const columns = useColumns(mockFilter);

    // All filters should be active
    expect(columns[0].filtering).toBeTruthy(); // ID has values
    expect(columns[1].filtering).toBeTruthy(); // targetCPUID has value
    expect(columns[2].filtering).toBeTruthy(); // targetDeviceID has value
    expect(columns[3].filtering).toBeTruthy(); // operation has values
    expect(columns[4].filtering).toBeTruthy(); // dependencies has value

    // With empty filter
    const emptyColumns = useColumns(mockEmptyFilter);

    expect(emptyColumns[0].filtering).toBeFalsy(); // ID has no values
    expect(emptyColumns[1].filtering).toBeFalsy(); // targetCPUID is empty
    expect(emptyColumns[2].filtering).toBeFalsy(); // targetDeviceID is empty
    expect(emptyColumns[3].filtering).toBeFalsy(); // operation is empty
    expect(emptyColumns[4].filtering).toBeFalsy(); // dependencies has no values
  });

  //   test('operationID column renders the correct value', () => {
  //     const columns = useColumns(mockFilter);
  //     const column = columns.find((col) => col.accessor === 'operationID');

  //     if (!column || !column.render) {
  //       throw new Error('operationID column or render function not found');
  //     }

  //     render(column.render(dummyProcedure1, 0) as ReactElement);
  //     expect(screen.getByText('1')).toBeInTheDocument();

  //     cleanup();

  //     render(column.render(dummyProcedure2, 0) as ReactElement);
  //     expect(screen.getByText('2')).toBeInTheDocument();

  //     cleanup();

  //     // Test boundary value (0)
  //     render(column.render(dummyProcedure3, 0) as ReactElement);
  //     expect(screen.getByText('0')).toBeInTheDocument();
  //   });

  test('targetCPUID column renders using ResourceIdWithPageLink', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'targetCPUID');

    if (!column || !column.render) {
      throw new Error('targetCPUID column or render function not found');
    }

    (ResourceIdWithPageLink as jest.Mock).mockClear();

    const renderedComponent = column.render(dummyProcedure1, 0) as ReactElement;
    render(renderedComponent);

    // Check that ResourceIdWithPageLink was called correctly
    expect((ResourceIdWithPageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((ResourceIdWithPageLink as jest.Mock).mock.calls[0][0]).toEqual({ id: dummyProcedure1.targetCPUID });

    // Test with empty string
    cleanup();
    (ResourceIdWithPageLink as jest.Mock).mockClear();

    render(column.render(dummyProcedure3, 0) as ReactElement);

    expect((ResourceIdWithPageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((ResourceIdWithPageLink as jest.Mock).mock.calls[0][0]).toEqual({ id: '' });
  });

  test('targetDevice column renders using ResourceIdWithPageLink', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'targetDevice');

    if (!column || !column.render) {
      throw new Error('targetDevice column or render function not found');
    }

    (ResourceIdWithPageLink as jest.Mock).mockClear();

    render(column.render(dummyProcedure1, 0) as ReactElement);

    expect((ResourceIdWithPageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((ResourceIdWithPageLink as jest.Mock).mock.calls[0][0]).toEqual({ id: dummyProcedure1.targetDevice });

    // Test with empty string
    cleanup();
    (ResourceIdWithPageLink as jest.Mock).mockClear();

    render(column.render(dummyProcedure3, 0) as ReactElement);

    expect((ResourceIdWithPageLink as jest.Mock).mock.calls.length).toBe(1);
    expect((ResourceIdWithPageLink as jest.Mock).mock.calls[0][0]).toEqual({ id: '' });
  });

  test('operation column renders the capitalized operation value', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'operation');

    if (!column || !column.render) {
      throw new Error('operation column or render function not found');
    }

    render(column.render(dummyProcedure1, 0) as ReactElement);
    expect(screen.getByText('Connect')).toBeInTheDocument();

    cleanup();

    render(column.render(dummyProcedure2, 0) as ReactElement);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  test('dependencies column renders dependencies as a comma-separated string', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'dependencies');

    if (!column || !column.render) {
      throw new Error('dependencies column or render function not found');
    }

    render(column.render(dummyProcedure1, 0) as ReactElement);
    expect(screen.getByText('2, 3')).toBeInTheDocument();

    cleanup();

    // 空の配列の場合、JSXの返り値を直接検証する
    const emptyResult = column.render(dummyProcedure2, 0) as ReactElement;
    expect(emptyResult.props.children).toBe('');

    cleanup();

    // Test with single value array
    render(column.render(dummyProcedure3, 0) as ReactElement);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('ID column filter uses NumberRangeForTableFilter with correct props', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'operationID');

    render(column?.filter as ReactElement);

    expect((NumberRangeForTableFilter as jest.Mock).mock.calls.length).toBe(1);
    expect((NumberRangeForTableFilter as jest.Mock).mock.calls[0][0]).toEqual({
      values: mockFilter.query.ID,
      setValues: mockFilter.setQuery.ID,
    });
  });

  test('targetCPUID column filter uses TextInputForTableFilter with correct props', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'targetCPUID');

    render(column?.filter as ReactElement);

    expect((TextInputForTableFilter as jest.Mock).mock.calls.length).toBe(1);
    expect((TextInputForTableFilter as jest.Mock).mock.calls[0][0]).toEqual({
      label: 'Host CPU ID',
      value: mockFilter.query.targetCPUID,
      setValue: mockFilter.setQuery.targetCPUID,
    });
  });

  test('targetDevice column filter uses TextInputForTableFilter with correct props', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'targetDevice');

    render(column?.filter as ReactElement);

    expect((TextInputForTableFilter as jest.Mock).mock.calls.length).toBe(1);
    expect((TextInputForTableFilter as jest.Mock).mock.calls[0][0]).toEqual({
      label: 'Target Device',
      value: mockFilter.query.targetDeviceID,
      setValue: mockFilter.setQuery.targetDeviceID,
    });
  });

  test('operation column filter uses MultiSelectForTableFilter with correct props', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'operation');

    render(column?.filter as ReactElement);

    expect((MultiSelectForTableFilter as jest.Mock).mock.calls.length).toBe(1);
    expect((MultiSelectForTableFilter as jest.Mock).mock.calls[0][0]).toEqual({
      label: 'Operation Type',
      options: mockFilter.selectOptions.operation,
      value: mockFilter.query.operation,
      setValue: mockFilter.setQuery.operation,
    });
  });

  test('dependencies column filter uses NumberRangeForTableFilter with correct props', () => {
    const columns = useColumns(mockFilter);
    const column = columns.find((col) => col.accessor === 'dependencies');

    render(column?.filter as ReactElement);

    expect((NumberRangeForTableFilter as jest.Mock).mock.calls.length).toBe(1);
    expect((NumberRangeForTableFilter as jest.Mock).mock.calls[0][0]).toEqual({
      values: mockFilter.query.dependencies,
      setValues: mockFilter.setQuery.dependencies,
    });
  });

  test('Filter components correctly update query values when changed', () => {
    jest.clearAllMocks();
    const columns = useColumns(mockFilter);

    // Test ID filter
    const idColumn = columns.find((col) => col.accessor === 'operationID');
    render(idColumn?.filter as ReactElement);
    const idSetValues = mockFilter.setQuery.ID;
    (NumberRangeForTableFilter as jest.Mock).mock.calls[0][0].setValues([5, 10]);
    expect(idSetValues).toHaveBeenCalledWith([5, 10]);
    cleanup();
    jest.clearAllMocks();

    // Test targetCPUID filter
    const cpuColumn = columns.find((col) => col.accessor === 'targetCPUID');
    render(cpuColumn?.filter as ReactElement);
    const cpuSetValue = mockFilter.setQuery.targetCPUID;
    (TextInputForTableFilter as jest.Mock).mock.calls[0][0].setValue('CPU-100');
    expect(cpuSetValue).toHaveBeenCalledWith('CPU-100');
    cleanup();
    jest.clearAllMocks();

    // Test targetDevice filter
    const deviceColumn = columns.find((col) => col.accessor === 'targetDevice');
    render(deviceColumn?.filter as ReactElement);
    const deviceSetValue = mockFilter.setQuery.targetDeviceID;
    (TextInputForTableFilter as jest.Mock).mock.calls[0][0].setValue('Device-100');
    expect(deviceSetValue).toHaveBeenCalledWith('Device-100');
    cleanup();
    jest.clearAllMocks();

    // Test operation filter
    const operationColumn = columns.find((col) => col.accessor === 'operation');
    render(operationColumn?.filter as ReactElement);
    const operationSetValue = mockFilter.setQuery.operation;
    (MultiSelectForTableFilter as jest.Mock).mock.calls[0][0].setValue(['modify']);
    expect(operationSetValue).toHaveBeenCalledWith(['modify']);
    cleanup();
    jest.clearAllMocks();

    // Test dependencies filter
    const dependenciesColumn = columns.find((col) => col.accessor === 'dependencies');
    render(dependenciesColumn?.filter as ReactElement);
    const dependenciesSetValues = mockFilter.setQuery.dependencies;
    (NumberRangeForTableFilter as jest.Mock).mock.calls[0][0].setValues([3, 5]);
    expect(dependenciesSetValues).toHaveBeenCalledWith([3, 5]);
  });
});
