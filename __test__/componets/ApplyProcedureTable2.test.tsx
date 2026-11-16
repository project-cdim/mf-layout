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

import { render } from '@/shared-modules/__test__/test-utils';

import { ApplyProcedureTable } from '@/components';
import { CustomDataTable } from '@/shared-modules/components';

jest.mock('@/shared-modules/utils/hooks/useQuery', () => ({
  useQuery: () => ({ id: '1' }),
}));

// Mock useTableSettings to control column visibility
const mockHandleSaveTableSettings = jest.fn();
const mockSelectedAccessors = ['id', 'targetCPUID', 'targetDevice', 'apply', 'rollback'];

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useTableSettings: jest.fn(() => ({
    columns: [
      { id: 'id', label: 'ID', fixed: true, visible: true },
      { id: 'targetCPUID', label: 'Host CPU ID', fixed: false, visible: true },
      { id: 'targetDevice', label: 'Target Device', fixed: false, visible: true },
      { id: 'apply', label: 'Apply', fixed: false, visible: mockSelectedAccessors.includes('apply') },
      { id: 'rollback', label: 'Rollback', fixed: false, visible: mockSelectedAccessors.includes('rollback') },
    ],
    defaultColumns: [
      { id: 'id', visible: true },
      { id: 'targetCPUID', visible: true },
      { id: 'targetDevice', visible: true },
      { id: 'apply', visible: true },
      { id: 'rollback', visible: true },
    ],
    selectedAccessors: mockSelectedAccessors,
    handleSaveTableSettings: mockHandleSaveTableSettings,
  })),
}));

jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useLayoutApplyDetail: jest.fn().mockReturnValue({
    data: undefined,
    error: { layout: undefined, resource: undefined },
    isValidating: { layout: false, resource: false },
    mutate: () => void {},
  }),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  CustomDataTable: jest.fn(),
}));

describe('ApplyProcedureTable2', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Reset mock selectedAccessors to default (all columns visible)
    mockSelectedAccessors.length = 0;
    mockSelectedAccessors.push('id', 'targetCPUID', 'targetDevice', 'apply', 'rollback');
  });

  test('grouping (display apply and rollback)', () => {
    render(<ApplyProcedureTable />);
    const CustomDataTableProps = (CustomDataTable as jest.Mock).mock.lastCall[0];
    expect(CustomDataTableProps).toHaveProperty('groups');
    expect(CustomDataTableProps).not.toHaveProperty('columns');
  });

  test('no grouping (hidden apply and rollback)', () => {
    // Simulate hiding Apply and Rollback columns
    mockSelectedAccessors.length = 0;
    mockSelectedAccessors.push('id', 'targetCPUID', 'targetDevice');

    render(<ApplyProcedureTable />);

    const CustomDataTableProps = (CustomDataTable as jest.Mock).mock.lastCall[0];
    expect(CustomDataTableProps).not.toHaveProperty('groups');
    expect(CustomDataTableProps).toHaveProperty('columns');
  });
});
