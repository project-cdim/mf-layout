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

import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';

import { DesignProcedureTable } from '@/components';

import { useLayoutDesignDetail } from '@/utils/hooks';
import { useFilter } from '@/utils/hooks/design-detail/useFilter';
import { useColumns } from '@/utils/hooks/design-detail/useColumns';
import { useLoading } from '@/shared-modules/utils/hooks';

// Mock the needed hooks and components
jest.mock('@/shared-modules/utils/hooks', () => ({
  useLoading: jest.fn().mockReturnValue(false),
}));

jest.mock('@/shared-modules/components', () => ({
  CustomDataTable: jest.fn(({ records, loading }) => (
    <div data-testid='custom-data-table'>
      <table role='table'>
        <thead>
          <tr>
            <th>Operation ID</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record: { operationID: string }) => (
            <tr key={record.operationID} data-testid='table-row'>
              <td>{record.operationID}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div data-testid='loading-indicator'>Loading...</div>}
    </div>
  )),
}));

jest.mock('@/utils/hooks', () => ({
  useLayoutDesignDetail: jest.fn().mockReturnValue({
    data: undefined,
    error: { layout: undefined },
    isValidating: { layout: false },
    mutate: () => void {},
  }),
}));

jest.mock('@/utils/hooks/design-detail/useFilter', () => ({
  useFilter: jest.fn().mockReturnValue({
    filteredRecords: [],
    filterValues: {},
    setFilterValues: jest.fn(),
  }),
}));

jest.mock('@/utils/hooks/design-detail/useColumns', () => ({
  useColumns: jest.fn().mockReturnValue([
    { accessor: 'operationID', title: 'Operation ID' },
    { accessor: 'targetDevice', title: 'Target Device' },
  ]),
}));

describe('DesignProcedureTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the table title', () => {
    render(<DesignProcedureTable />);
    expect(screen.getByText('Migration Steps')).toBeInTheDocument();
  });

  test('renders the CustomDataTable component', () => {
    render(<DesignProcedureTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('custom-data-table')).toBeInTheDocument();
  });

  test('passes the correct props to CustomDataTable', () => {
    const mockFilteredRecords = [{ operationID: '1', targetDevice: 'device1' }];
    const mockColumns = [
      { accessor: 'operationID', title: 'Operation ID' },
      { accessor: 'targetDevice', title: 'Target Device' },
    ];

    (useFilter as jest.Mock).mockReturnValue({
      filteredRecords: mockFilteredRecords,
      filterValues: {},
      setFilterValues: jest.fn(),
    });

    (useColumns as jest.Mock).mockReturnValue(mockColumns);

    render(<DesignProcedureTable />);

    expect(screen.getByTestId('table-row')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('shows loading state when isValidating.layout is true', () => {
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: { layout: undefined },
      isValidating: { layout: true },
      mutate: () => void {},
    });

    (useLoading as jest.Mock).mockReturnValue(true);

    render(<DesignProcedureTable />);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    // Verify that useLoading was called with the correct parameter
    expect(useLoading).toHaveBeenCalledWith(true);
  });

  test('handles empty records gracefully', () => {
    (useFilter as jest.Mock).mockReturnValue({
      filteredRecords: [],
      filterValues: {},
      setFilterValues: jest.fn(),
    });

    render(<DesignProcedureTable />);

    expect(screen.queryByTestId('table-row')).not.toBeInTheDocument();
  });
});
