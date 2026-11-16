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

import React from 'react';

import { render } from '@testing-library/react';

import { PageLink } from '@/shared-modules/components';

import { APPProcedure } from '@/types';

import { useColumns } from '@/utils/hooks/detail/useColumns';

jest.mock('@/shared-modules/components/PageLink');
const mockPageLink = jest.fn().mockReturnValue(null);

describe('useColumns', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    (PageLink as unknown as jest.Mock).mockImplementation(mockPageLink);
  });
  test('Returns the columns', async () => {
    const columns = useColumns();
    expect(columns).toHaveLength(6);

    // Test the render method of the Host CPU ID column
    const hostCpuIDColumn = columns.find((col) => col.accessor === 'hostCpuID');
    expect(hostCpuIDColumn).toBeDefined();

    const appProcedure: APPProcedure = {
      operationID: 1,
      operation: 'boot',
      hostCpuID: 'cpu1234',
      targetDeviceID: 'device5678',
      dependencies: '',
      result: 'xxx',
    };

    if (hostCpuIDColumn?.render) {
      const view = hostCpuIDColumn.render(appProcedure, 0);
      if (React.isValidElement(view)) {
        render(view);
      }

      expect(mockPageLink.mock.lastCall[0].title).toBe('Resource Details');
      expect(mockPageLink.mock.lastCall[0].path).toBe('/cdim/res-resource-detail');
      expect(mockPageLink.mock.lastCall[0].query?.id).toBe(appProcedure.hostCpuID);
    }

    // Test the render method of the device ID column
    const targetDeviceIDColumn = columns.find((col) => col.accessor === 'targetDeviceID');
    expect(targetDeviceIDColumn).toBeDefined();

    if (targetDeviceIDColumn?.render) {
      const view = targetDeviceIDColumn.render(appProcedure, 0);
      if (React.isValidElement(view)) {
        render(view);
      }
      expect(mockPageLink.mock.lastCall[0].title).toBe('Resource Details');
      expect(mockPageLink.mock.lastCall[0].path).toBe('/cdim/res-resource-detail');
      expect(mockPageLink.mock.lastCall[0].query?.id).toBe(appProcedure.targetDeviceID);
    }

    // Verify the existence of other columns
    const operationIDColumn = columns.find((col) => col.accessor === 'operationID');
    expect(operationIDColumn).toBeDefined();
    expect(operationIDColumn?.title).toBe('ID');

    const operationColumn = columns.find((col) => col.accessor === 'operation');
    expect(operationColumn).toBeDefined();
    expect(operationColumn?.title).toBe('Operation Type');

    const dependenciesColumn = columns.find((col) => col.accessor === 'dependencies');
    expect(dependenciesColumn).toBeDefined();
    expect(dependenciesColumn?.title).toBe('Dependency ID');

    const resultColumn = columns.find((col) => col.accessor === 'result');
    expect(resultColumn).toBeDefined();
    expect(resultColumn?.title).toBe('Result.normal');
  });
});
