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

import { MultiSelect, NumberInput } from '@mantine/core';
import { renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DataTableColumnGroup } from 'mantine-datatable';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageLink } from '@/shared-modules/components';

import { APPProcedureWithResult } from '@/types';

import { dummyUseLayoutApplyDetail } from '@/utils/dummy-data/layoutApplyDetail/dummyUseLayoutApplyDetail14';
import { useColumns } from '@/utils/hooks/procedure/useColumns';
import { ApplyProcedureFilter } from '@/utils/hooks/procedure/useFilter';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/shared-modules/components/PageLink');
const mockPageLink = jest.fn().mockReturnValue(null);

jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  NumberInput: jest.fn(),
  MultiSelect: jest.fn(),
}));

describe('useColumns', () => {
  const dummyFilteredRecords = dummyUseLayoutApplyDetail.data?.procedures || [];
  const filter: ApplyProcedureFilter = {
    query: {
      ID: [undefined, undefined],
      targetCPUID: '',
      targetDeviceID: '',
      operation: [],
      dependencies: [undefined, undefined],
      status: [],
      rollbackOperation: [],
      rollbackDependencies: [undefined, undefined],
      rollbackStatus: [],
    },
    setQuery: {
      ID: jest.fn(),
      targetCPUID: jest.fn(),
      targetDeviceID: jest.fn(),
      operation: jest.fn(),
      dependencies: jest.fn(),
      status: jest.fn(),
      rollbackOperation: jest.fn(),
      rollbackDependencies: jest.fn(),
      rollbackStatus: jest.fn(),
    },
    selectOptions: {
      operation: [],
      status: [],
      rollbackOperation: [],
      rollbackStatus: [],
    },
    filteredRecords: dummyFilteredRecords,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (PageLink as unknown as jest.Mock).mockImplementation(mockPageLink);
  });

  test('should return default columns', () => {
    // Check if each column is displayed
    const { result } = renderHook(() => useColumns(filter, ['targetCPUID', 'targetDevice', 'apply', 'rollback']));
    const columns: DataTableColumnGroup<APPProcedureWithResult>[] = result.current.defaultCol;

    expect(columns).toHaveLength(3);
    expect(columns[0].id).toBe('common');
    expect(columns[1].id).toBe('apply');
    expect(columns[2].id).toBe('rollback');

    const commonColumns = columns[0].columns;
    expect(commonColumns).toEqual(result.current.commonColumns);
    expect(commonColumns).toHaveLength(3);
    expect(commonColumns[0].accessor).toBe('operationID');
    expect(commonColumns[1].accessor).toBe('targetCPUID');
    expect(commonColumns[2].accessor).toBe('targetDevice');

    const { isGroupNecessary } = result.current;
    expect(isGroupNecessary).toBe(true);

    const applyColumns = columns[1].columns;
    expect(applyColumns).toHaveLength(3);
    expect(applyColumns[0].accessor).toBe('operation');
    expect(applyColumns[1].accessor).toBe('dependencies');
    expect(applyColumns[2].accessor).toBe('result');

    const rollbackColumns = columns[2].columns;
    expect(rollbackColumns).toHaveLength(3);
    expect(rollbackColumns[0].accessor).toBe('rollbackOperation');
    expect(rollbackColumns[1].accessor).toBe('rollbackDependencies');
    expect(rollbackColumns[2].accessor).toBe('rollbackResult');
  });

  test('operation id is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['operationID']);
    const operationIDColumn = columns[0].columns.find((col) => col.accessor === 'operationID');

    if (!operationIDColumn) {
      throw new Error('undefined');
    }

    expect(operationIDColumn.title).toBe('ID');

    render(operationIDColumn.filter as ReactElement);

    expect((NumberInput as unknown as jest.Mock).mock.calls).toHaveLength(2);

    (NumberInput as unknown as jest.Mock).mock.lastCall[0].onChange(1);
    expect(filter.setQuery.ID).toHaveBeenCalledTimes(1);
  });

  test('targetCPUID is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['targetCPUID']);

    const targetCPUIDColumn = columns[0].columns.find((col) => col.accessor === 'targetCPUID');
    expect(targetCPUIDColumn).toBeDefined();

    if (!targetCPUIDColumn || !targetCPUIDColumn.render) {
      throw new Error('undefined');
    }
    const view = targetCPUIDColumn.render(dummyFilteredRecords[0], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(mockPageLink.mock.lastCall[0].title).toBe('Resource Details');
    expect(mockPageLink.mock.lastCall[0].path).toBe('/cdim/res-resource-detail');
    expect(mockPageLink.mock.lastCall[0].query?.id).toBe(dummyFilteredRecords[0].targetCPUID);
  });

  test('targetCPUID is rendered with no id', async () => {
    const { defaultCol: columns } = useColumns(filter, ['targetCPUID']);

    const targetCPUIDColumn = columns[0].columns.find((col) => col.accessor === 'targetCPUID');
    expect(targetCPUIDColumn).toBeDefined();

    if (!targetCPUIDColumn || !targetCPUIDColumn.render) {
      throw new Error('undefined');
    }

    const dummy = { ...dummyFilteredRecords[0], targetCPUID: undefined };

    const view = targetCPUIDColumn.render(dummy, 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.queryByText('Resource Details')).toBeNull();
    // PageLink is not called
    expect(mockPageLink.mock.calls).toHaveLength(0);
  });

  test('Query is updated by targetCPUID input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['targetCPUID']);
    const targetCPUIDColumn = columns[0].columns.find((col) => col.accessor === 'targetCPUID');
    if (!targetCPUIDColumn || !targetCPUIDColumn.filter) {
      throw new Error('undefined');
    }
    render(targetCPUIDColumn.filter as ReactElement);

    const input = screen.getByLabelText('Host CPU ID');
    // The number of times it is called is not counted because the initial value of the query is an empty string
    await userEvent.clear(input);
    await userEvent.type(input, 'cpu1234');
    // called as many times as the number of characters entered
    expect(filter.setQuery.targetCPUID).toHaveBeenCalledTimes(7);
  });

  test('targetDevice is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['targetDevice']);

    const targetDeviceColumn = columns[0].columns.find((col) => col.accessor === 'targetDevice');
    expect(targetDeviceColumn).toBeDefined();
    if (!targetDeviceColumn || !targetDeviceColumn.render) {
      throw new Error('undefined');
    }
    const view = targetDeviceColumn.render(dummyFilteredRecords[0], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(mockPageLink.mock.lastCall[0].title).toBe('Resource Details');
    expect(mockPageLink.mock.lastCall[0].path).toBe('/cdim/res-resource-detail');
    expect(mockPageLink.mock.lastCall[0].query?.id).toBe(dummyFilteredRecords[0].targetDevice);
  });

  test('Query is updated by targetDevice input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['targetDevice']);
    const targetDeviceColumn = columns[0].columns.find((col) => col.accessor === 'targetDevice');
    if (!targetDeviceColumn || !targetDeviceColumn.filter) {
      throw new Error('undefined');
    }
    render(targetDeviceColumn.filter as ReactElement);

    const input = screen.getByLabelText('Target Device');
    // The number of times it is called is not counted because the initial value of the query is an empty string
    await userEvent.clear(input);
    await userEvent.type(input, 'device5678');
    // called as many times as the number of characters entered
    expect(filter.setQuery.targetDeviceID).toHaveBeenCalledTimes(10);
  });

  test('apply operation is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);

    const applyOperationColumn = columns[1].columns.find((col) => col.accessor === 'operation');
    expect(applyOperationColumn).toBeDefined();
    if (!applyOperationColumn || !applyOperationColumn.render) {
      throw new Error('undefined');
    }
    const view = applyOperationColumn.render(dummyFilteredRecords[0], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  test('Query is updated by apply operation input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);
    const applyOperationColumn = columns[1].columns.find((col) => col.accessor === 'operation');
    if (!applyOperationColumn || !applyOperationColumn.filter) {
      throw new Error('undefined');
    }
    render(applyOperationColumn.filter as ReactElement);

    (MultiSelect as unknown as jest.Mock).mock.lastCall[0].onChange(['connect']);
    expect(filter.setQuery.operation).toHaveBeenCalledTimes(1);
  });

  test('apply dependencies is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);

    const applyDependenciesColumn = columns[1].columns.find((col) => col.accessor === 'dependencies');
    expect(applyDependenciesColumn).toBeDefined();
    if (!applyDependenciesColumn || !applyDependenciesColumn.render) {
      throw new Error('undefined');
    }
    const view = applyDependenciesColumn.render(dummyFilteredRecords[1], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('Query is updated by apply dependencies input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);
    const applyDependenciesColumn = columns[1].columns.find((col) => col.accessor === 'dependencies');
    if (!applyDependenciesColumn || !applyDependenciesColumn.filter) {
      throw new Error('undefined');
    }
    render(applyDependenciesColumn.filter as ReactElement);

    expect(applyDependenciesColumn.title).toBe('Dependency ID');

    expect((NumberInput as unknown as jest.Mock).mock.calls).toHaveLength(2);

    (NumberInput as unknown as jest.Mock).mock.lastCall[0].onChange(1);
    expect(filter.setQuery.dependencies).toHaveBeenCalledTimes(1);
  });

  test('apply result is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);

    const applyResultColumn = columns[1].columns.find((col) => col.accessor === 'result');
    expect(applyResultColumn).toBeDefined();
    if (!applyResultColumn || !applyResultColumn.render) {
      throw new Error('undefined');
    }
    const view = applyResultColumn.render(dummyFilteredRecords[1], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('apply result is rendered with no status', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);

    const applyResultColumn = columns[1].columns.find((col) => col.accessor === 'result');
    expect(applyResultColumn).toBeDefined();
    if (!applyResultColumn || !applyResultColumn.render) {
      throw new Error('undefined');
    }

    const dummy = { ...dummyFilteredRecords[1], apply: { ...dummyFilteredRecords[1].apply, status: undefined } };

    const view = applyResultColumn.render(dummy, 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.queryByText('Completed')).toBeNull();
  });

  test('Query is updated by apply result input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['apply']);
    const applyResultColumn = columns[1].columns.find((col) => col.accessor === 'result');
    if (!applyResultColumn || !applyResultColumn.filter) {
      throw new Error('undefined');
    }
    render(applyResultColumn.filter as ReactElement);

    (MultiSelect as unknown as jest.Mock).mock.lastCall[0].onChange(['completed']);
    expect(filter.setQuery.status).toHaveBeenCalledTimes(1);
  });

  test('rollback operation is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);

    const rollbackOperationColumn = columns[2].columns.find((col) => col.accessor === 'rollbackOperation');
    expect(rollbackOperationColumn).toBeDefined();
    if (!rollbackOperationColumn || !rollbackOperationColumn.render) {
      throw new Error('undefined');
    }
    const view = rollbackOperationColumn.render(dummyFilteredRecords[0], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  test('rollback operation is rendered with no operation', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);

    const rollbackOperationColumn = columns[2].columns.find((col) => col.accessor === 'rollbackOperation');
    expect(rollbackOperationColumn).toBeDefined();
    if (!rollbackOperationColumn || !rollbackOperationColumn.render) {
      throw new Error('undefined');
    }

    const dummy = {
      ...dummyFilteredRecords[0],
      rollback: undefined,
    };

    const view = rollbackOperationColumn.render(dummy, 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.queryByText('Disconnect')).toBeNull();
  });

  test('Query is updated by rollback operation input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);
    const rollbackOperationColumn = columns[2].columns.find((col) => col.accessor === 'rollbackOperation');
    if (!rollbackOperationColumn || !rollbackOperationColumn.filter) {
      throw new Error('undefined');
    }
    render(rollbackOperationColumn.filter as ReactElement);

    (MultiSelect as unknown as jest.Mock).mock.lastCall[0].onChange(['disconnect']);
    expect(filter.setQuery.rollbackOperation).toHaveBeenCalledTimes(1);
  });

  test('rollback dependencies is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);

    const rollbackDependenciesColumn = columns[2].columns.find((col) => col.accessor === 'rollbackDependencies');
    expect(rollbackDependenciesColumn).toBeDefined();
    if (!rollbackDependenciesColumn || !rollbackDependenciesColumn.render) {
      throw new Error('undefined');
    }
    const view = rollbackDependenciesColumn.render(dummyFilteredRecords[0], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('rollback dependencies is rendered with no dependencies', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);

    const rollbackDependenciesColumn = columns[2].columns.find((col) => col.accessor === 'rollbackDependencies');
    expect(rollbackDependenciesColumn).toBeDefined();
    if (!rollbackDependenciesColumn || !rollbackDependenciesColumn.render) {
      throw new Error('undefined');
    }

    const dummy = {
      ...dummyFilteredRecords[0],
      rollback: undefined,
    };

    const view = rollbackDependenciesColumn.render(dummy, 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.queryByText('2')).toBeNull();
  });

  test('Query is updated by rollback dependencies input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);
    const rollbackDependenciesColumn = columns[2].columns.find((col) => col.accessor === 'rollbackDependencies');
    if (!rollbackDependenciesColumn || !rollbackDependenciesColumn.filter) {
      throw new Error('undefined');
    }
    render(rollbackDependenciesColumn.filter as ReactElement);

    expect(rollbackDependenciesColumn.title).toBe('Dependency ID');

    expect((NumberInput as unknown as jest.Mock).mock.calls).toHaveLength(2);

    (NumberInput as unknown as jest.Mock).mock.lastCall[0].onChange(2);
    expect(filter.setQuery.rollbackDependencies).toHaveBeenCalledTimes(1);
  });

  test('rollback result is rendered', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);

    const rollbackResultColumn = columns[2].columns.find((col) => col.accessor === 'rollbackResult');
    expect(rollbackResultColumn).toBeDefined();
    if (!rollbackResultColumn || !rollbackResultColumn.render) {
      throw new Error('undefined');
    }
    const view = rollbackResultColumn.render(dummyFilteredRecords[0], 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('rollback result is rendered with no status', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);

    const rollbackResultColumn = columns[2].columns.find((col) => col.accessor === 'rollbackResult');
    expect(rollbackResultColumn).toBeDefined();
    if (!rollbackResultColumn || !rollbackResultColumn.render) {
      throw new Error('undefined');
    }

    const dummy = {
      ...dummyFilteredRecords[0],
      rollback: { ...dummyFilteredRecords[0].rollback, status: undefined },
    } as APPProcedureWithResult;

    const view = rollbackResultColumn.render(dummy, 0);
    if (React.isValidElement(view)) {
      render(view);
    }

    expect(screen.queryByText('Completed')).toBeNull();
  });

  test('Query is updated by rollback result input', async () => {
    const { defaultCol: columns } = useColumns(filter, ['rollback']);
    const rollbackResultColumn = columns[2].columns.find((col) => col.accessor === 'rollbackResult');
    if (!rollbackResultColumn || !rollbackResultColumn.filter) {
      throw new Error('undefined');
    }
    render(rollbackResultColumn.filter as ReactElement);

    (MultiSelect as unknown as jest.Mock).mock.lastCall[0].onChange(['completed']);
    expect(filter.setQuery.rollbackStatus).toHaveBeenCalledTimes(1);
  });

  test('No grouping columns (apply and rollback are hidden)', async () => {
    const { result } = renderHook(() => useColumns(filter, ['targetCPUID', 'targetDevice']));
    const { isGroupNecessary } = result.current;
    expect(isGroupNecessary).toBe(false);
  });
});
