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

import { render } from '@/shared-modules/__test__/test-utils';
import { screen } from '@testing-library/react';
import { ToleranceCriteriaSection } from '@/components/ToleranceCriteriaSection';
import { DataTableColumn } from 'mantine-datatable';

// Mock the imported components
jest.mock('@/shared-modules/components', () => ({
  CustomDataTable: jest.fn(({ records, loading }) => (
    <div data-testid='custom-data-table' data-records={JSON.stringify(records)} data-loading={loading}>
      CustomDataTable
    </div>
  )),
}));

jest.mock('@/components', () => ({
  InfoCard: jest.fn(({ title, infoLabel, value, loading }) => (
    <div
      data-testid='info-card'
      data-title={title}
      data-info-label={infoLabel}
      data-value={value}
      data-loading={loading}
    >
      InfoCard
    </div>
  )),
}));

describe('ToleranceCriteriaSection', () => {
  const mockColumns: DataTableColumn<any>[] = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'name', title: 'Name' },
  ];

  const mockDevices = [
    { id: 'device-1', name: 'Device 1' },
    { id: 'device-2', name: 'Device 2' },
  ];

  const mockData = [
    {
      limit: { averageUseRate: 80 },
      devices: mockDevices,
    },
    {
      limit: { averageUseBytes: 1024 },
      devices: mockDevices,
    },
  ];

  const defaultProps = {
    title: 'Test Tolerance Criteria',
    data: mockData,
    columns: mockColumns,
    infoCardProps: {
      title: 'Test Info Card',
      infoLabel: 'Test Info Label',
    },
    valueExtractor: (limit: { averageUseRate?: number; averageUseBytes?: number }) =>
      `${limit.averageUseRate ? limit.averageUseRate + '%' : ''} ${limit.averageUseBytes ? limit.averageUseBytes + ' bytes' : ''}`.trim(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with provided props', () => {
    render(<ToleranceCriteriaSection {...defaultProps} />);

    expect(screen.getByText('Test Tolerance Criteria')).toBeInTheDocument();
    expect(screen.getAllByTestId('info-card').length).toBe(2);
    expect(screen.getAllByTestId('custom-data-table').length).toBe(2);
  });

  test('renders "No data" message when data is empty array', () => {
    render(<ToleranceCriteriaSection {...defaultProps} data={[]} />);

    expect(screen.getByText('Test Tolerance Criteria')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.queryByTestId('info-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-data-table')).not.toBeInTheDocument();
  });

  test('renders "No data" message when data is undefined', () => {
    render(<ToleranceCriteriaSection {...defaultProps} data={undefined} />);

    expect(screen.getByText('Test Tolerance Criteria')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.queryByTestId('info-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-data-table')).not.toBeInTheDocument();
  });

  test('passes correct props to InfoCard component', () => {
    render(<ToleranceCriteriaSection {...defaultProps} />);

    const infoCards = screen.getAllByTestId('info-card');
    expect(infoCards[0]).toHaveAttribute('data-title', 'Test Info Card');
    expect(infoCards[0]).toHaveAttribute('data-info-label', 'Test Info Label');
    expect(infoCards[0]).toHaveAttribute('data-value', '80%');
    expect(infoCards[0]).toHaveAttribute('data-loading', 'false');

    expect(infoCards[1]).toHaveAttribute('data-title', 'Test Info Card');
    expect(infoCards[1]).toHaveAttribute('data-info-label', 'Test Info Label');
    expect(infoCards[1]).toHaveAttribute('data-value', '1024 bytes');
    expect(infoCards[1]).toHaveAttribute('data-loading', 'false');
  });

  test('passes loading state to child components', () => {
    render(<ToleranceCriteriaSection {...defaultProps} loading={true} />);

    const infoCards = screen.getAllByTestId('info-card');
    expect(infoCards[0]).toHaveAttribute('data-loading', 'true');
    expect(infoCards[1]).toHaveAttribute('data-loading', 'true');

    const dataTables = screen.getAllByTestId('custom-data-table');
    expect(dataTables[0]).toHaveAttribute('data-loading', 'true');
    expect(dataTables[1]).toHaveAttribute('data-loading', 'true');
  });

  test('correctly labels tolerance criteria items', () => {
    render(<ToleranceCriteriaSection {...defaultProps} />);

    expect(screen.getByText('Tolerance Criteria 1')).toBeInTheDocument();
    expect(screen.getByText('Tolerance Criteria 2')).toBeInTheDocument();
  });

  test('handles empty devices array', () => {
    const emptyDevicesData = [
      {
        limit: { averageUseRate: 80 },
        devices: [],
      },
    ];

    render(<ToleranceCriteriaSection {...defaultProps} data={emptyDevicesData} />);

    const dataTables = screen.getAllByTestId('custom-data-table');
    expect(dataTables[0]).toHaveAttribute('data-records', '[]');
  });

  test('correctly extracts values with valueExtractor function', () => {
    const customValueExtractor = jest.fn((limit) => {
      if (limit.averageUseRate) return `${limit.averageUseRate}%`;
      if (limit.averageUseBytes) return `${limit.averageUseBytes} bytes`;
      return '';
    });

    render(<ToleranceCriteriaSection {...defaultProps} valueExtractor={customValueExtractor} />);

    expect(customValueExtractor).toHaveBeenCalledTimes(2);
    expect(customValueExtractor).toHaveBeenCalledWith({ averageUseRate: 80 });
    expect(customValueExtractor).toHaveBeenCalledWith({ averageUseBytes: 1024 });
  });

  test('handles boundary conditions in data', () => {
    const boundaryData = [
      {
        limit: { averageUseRate: 0 },
        devices: mockDevices,
      },
      {
        limit: { averageUseBytes: 0 },
        devices: [],
      },
      {
        limit: {},
        devices: mockDevices,
      },
    ];

    render(<ToleranceCriteriaSection {...defaultProps} data={boundaryData} />);

    expect(screen.getAllByTestId('info-card').length).toBe(3);
    expect(screen.getAllByTestId('custom-data-table').length).toBe(3);
  });
});
