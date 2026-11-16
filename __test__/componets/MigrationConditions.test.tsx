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
// import '@/shared-modules/__test__/mock';
import { dummyAPPLayoutDesignDetail } from '@/utils/dummy-data/layoutDesignDetail/dummyAPPLayoutDesignDetail';

// Mock hooks
jest.mock('@/utils/hooks', () => ({
  useLayoutDesignDetail: jest.fn(),
}));

// Mock components
jest.mock('@/components', () => ({
  ...jest.requireActual('@/components'),
  InfoCard: jest.fn().mockImplementation((props) => (
    <div
      data-testid='info-card'
      data-title={props.title}
      data-info-label={props.infoLabel}
      data-value={props.value}
      data-loading={props.loading ? 'true' : 'false'}
    >
      {props.title || 'Info Card'}
    </div>
  )),
  ResourceIdWithPageLink: jest.fn().mockImplementation((props) => <div data-testid='resource-link'>{props.id}</div>),
  // eslint-disable-next-line complexity
  ToleranceCriteriaSection: jest.fn().mockImplementation((props) => {
    // Ensure valueExtractor is actually called for each item in data
    if (props.data && props.data.length > 0) {
      props.data.forEach((item: { limit?: number }) => {
        if (item.limit != null) {
          props.valueExtractor(item.limit);
        }
      });
    }
    // console.log('data: ', props.data);
    // console.log('devices: ', props.data[0].devices);
    // console.log('title:', props.title);
    return (
      <div
        data-testid='tolerance-criteria-section'
        data-title={props.title}
        data-loading={props.loading ? 'true' : 'false'}
      >
        {props.title}
        {props.columns[0].render({ id: props.data?.[0]?.devices?.[0].id })}
        {props.title === 'Memory' && props.columns[1].render({ capacity: props.data?.[0]?.devices?.[0].capacity })}
        {props.columns?.[1].title}
      </div>
    );
  }),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  useLoading: jest.fn(),
}));

// Mock utility functions
jest.mock('@/shared-modules/utils', () => ({
  ...jest.requireActual('@/shared-modules/utils'),
  formatEnergyValue: jest.fn().mockImplementation((value) => `${value}W`),
  formatPercentValue: jest.fn().mockImplementation((value) => `${value}%`),
  formatBytesValue: jest.fn().mockImplementation((value) => `${value}B`),
  formatBytes: jest.fn().mockImplementation((value, unit) => `${value}${unit}`),
  bytesToUnit: jest.fn().mockReturnValue('GB'),
}));

// Import components after setting up all mocks
import { MigrationConditions } from '@/components';
import {
  bytesToUnit,
  formatBytes,
  formatBytesValue,
  formatEnergyValue,
  formatPercentValue,
} from '@/shared-modules/utils';
import { useLoading } from '@/shared-modules/utils/hooks';
import { useLayoutDesignDetail } from '@/utils/hooks';

describe('MigrationConditions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: dummyAPPLayoutDesignDetail,
      isValidating: { layout: false },
    });
    (useLoading as jest.Mock).mockReturnValue(false);
  });

  test('should render loading state correctly', () => {
    // Setup loading state
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: dummyAPPLayoutDesignDetail,
      isValidating: { layout: true },
    });
    (useLoading as jest.Mock).mockReturnValue(true);

    // Render component
    render(<MigrationConditions />);

    // Check title is rendered
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();
    // screen.debug();

    // Verify InfoCard was rendered with loading state
    const infoCard = screen.getByTestId('info-card');
    expect(infoCard).toBeInTheDocument();
    expect(infoCard).toHaveAttribute('data-loading', 'true');
    expect(infoCard).toHaveAttribute('data-title', 'Power Consumption Limit');
  });

  test('should render no data message when conditions are not available', () => {
    // Setup mock with no conditions
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: {},
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check title and no data message
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  test('should render conditions data correctly when available', () => {
    // Render component
    render(<MigrationConditions />);

    // Check title and section headers
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();
    expect(screen.getByText('Power Consumption')).toBeInTheDocument();

    // Verify InfoCard was rendered with correct attributes
    const infoCard = screen.getByTestId('info-card');
    expect(infoCard).toBeInTheDocument();
    expect(infoCard).toHaveAttribute('data-title', 'Power Consumption Limit');
    expect(infoCard).toHaveAttribute('data-info-label', 'Upper bound of system estimated average power consumption');
    expect(infoCard).toHaveAttribute('data-value', '6000W');
    expect(infoCard).toHaveAttribute('data-loading', 'false');

    // Verify ToleranceCriteriaSections were rendered with correct attributes
    const toleranceSections = screen.getAllByTestId('tolerance-criteria-section');
    expect(toleranceSections).toHaveLength(2);

    // CPU section verification
    expect(toleranceSections[0]).toHaveAttribute('data-title', 'CPU');
    expect(toleranceSections[0]).toHaveAttribute('data-loading', 'false');

    // Memory section verification
    expect(toleranceSections[1]).toHaveAttribute('data-title', 'Memory');
    expect(toleranceSections[1]).toHaveAttribute('data-loading', 'false');

    // Verify utility function calls
    expect(formatEnergyValue).toHaveBeenCalledWith(6000);
    expect(bytesToUnit).toHaveBeenCalledWith(16777216);
  });

  test('should handle empty toleranceCriteria arrays', () => {
    // Create test data with empty arrays
    const testData = {
      conditions: {
        energyCriteria: 6000,
        toleranceCriteria: {
          cpu: [],
          memory: [],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check component renders without crashing
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();
    expect(screen.getByText('Power Consumption')).toBeInTheDocument();

    // Verify ToleranceCriteriaSections were rendered
    const toleranceSections = screen.getAllByTestId('tolerance-criteria-section');
    expect(toleranceSections).toHaveLength(2);

    // bytesToUnit should not be called with empty arrays
    expect(bytesToUnit).not.toHaveBeenCalled();
  });

  test('should handle undefined memory capacity', () => {
    // Create test data with undefined memory capacity
    const testData = {
      conditions: {
        energyCriteria: 6000,
        toleranceCriteria: {
          cpu: [
            {
              deviceIDs: ['res10102', 'res10103'],
              limit: { averageUseRate: 33.0, weights: [1.0, 0.8] },
              devices: [
                { id: 'res10102', capacity: 100 },
                { id: 'res10103', capacity: 100 },
              ],
            },
          ],
          memory: [
            {
              deviceIDs: ['res10203', 'res10204'],
              limit: { averageUseBytes: 4294967296.0 },
              devices: [
                { id: 'res10203' }, // No capacity
                { id: 'res10204' }, // No capacity
              ],
            },
          ],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check component renders without errors
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();

    // Verify ToleranceCriteriaSections were rendered
    const toleranceSections = screen.getAllByTestId('tolerance-criteria-section');
    expect(toleranceSections).toHaveLength(2);

    // bytesToUnit should not be called when no valid capacities
    expect(bytesToUnit).not.toHaveBeenCalled();
  });

  test('should handle mixed memory capacity values', () => {
    // Create test data with mixed memory capacities
    const testData = {
      conditions: {
        energyCriteria: 6000,
        toleranceCriteria: {
          cpu: [
            {
              deviceIDs: ['res10102'],
              limit: { averageUseRate: 33.0, weights: [1.0] },
              devices: [{ id: 'res10102', capacity: 100 }],
            },
          ],
          memory: [
            {
              deviceIDs: ['res10203', 'res10204'],
              limit: { averageUseBytes: 4294967296.0 },
              devices: [
                { id: 'res10203', capacity: 8589934592 },
                { id: 'res10204', capacity: 4294967296 },
              ],
            },
          ],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check component renders
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();

    // bytesToUnit should be called with the minimum capacity
    expect(bytesToUnit).toHaveBeenCalledWith(4294967296);
  });

  test('should handle null energyCriteria', () => {
    // Create test data with null energyCriteria
    const testData = {
      conditions: {
        energyCriteria: null,
        toleranceCriteria: {
          cpu: [
            {
              deviceIDs: ['res10102'],
              limit: { averageUseRate: 33.0, weights: [1.0] },
              devices: [{ id: 'res10102', capacity: 100 }],
            },
          ],
          memory: [
            {
              deviceIDs: ['res10203'],
              limit: { averageUseBytes: 4294967296.0 },
              devices: [{ id: 'res10203', capacity: 4294967296 }],
            },
          ],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check component renders
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();

    // formatEnergyValue should be called with null
    expect(formatEnergyValue).toHaveBeenCalledWith(null);
  });

  test('should handle null toleranceCriteria', () => {
    // Create test data with null toleranceCriteria
    const testData = {
      conditions: {
        energyCriteria: 6000,
        toleranceCriteria: {
          cpu: null,
          memory: null,
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check component renders
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();

    // Verify ToleranceCriteriaSections were rendered with null data
    const toleranceSections = screen.getAllByTestId('tolerance-criteria-section');
    expect(toleranceSections).toHaveLength(2);
  });

  test('should handle boundary values for CPU and memory usage', () => {
    // Create test data with boundary values
    const testData = {
      conditions: {
        energyCriteria: 0, // Min value
        toleranceCriteria: {
          cpu: [
            {
              deviceIDs: ['res10102'],
              limit: { averageUseRate: 100.0, weights: [0] }, // Max CPU usage, min weight
              devices: [{ id: 'res10102', capacity: 0 }], // Min capacity
            },
          ],
          memory: [
            {
              deviceIDs: ['res10203'],
              limit: { averageUseBytes: 0.0 }, // Min memory usage
              devices: [{ id: 'res10203', capacity: 0 }], // Min capacity
            },
          ],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });

    // Render component
    render(<MigrationConditions />);

    // Check component renders
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();

    // Verify InfoCard was rendered with boundary value
    const infoCard = screen.getByTestId('info-card');
    expect(infoCard).toHaveAttribute('data-value', '0W');

    // Verify boundary values were passed correctly
    expect(formatEnergyValue).toHaveBeenCalledWith(0);
    expect(formatPercentValue).toHaveBeenCalledWith(100.0);
    expect(formatBytesValue).toHaveBeenCalledWith(0.0);
    expect(bytesToUnit).toHaveBeenCalledWith(0);
  });

  test('should display capacity title with unit when minMemoryCapacityUnit has a value', () => {
    // Create test data with memory devices
    const testData = {
      conditions: {
        energyCriteria: 6000,
        toleranceCriteria: {
          cpu: [],
          memory: [
            {
              deviceIDs: ['mem-1'],
              limit: { averageUseBytes: 1024 },
              devices: [{ id: 'mem-1', capacity: 1024 }],
            },
          ],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });
    // Mock bytesToUnit to return a specific unit
    (bytesToUnit as jest.Mock).mockReturnValue('KB');

    // Get the component
    render(<MigrationConditions />);

    // Verify the component rendered correctly
    expect(screen.getByText('Migration Conditions')).toBeInTheDocument();

    // Verify bytesToUnit was called with the correct capacity
    expect(bytesToUnit).toHaveBeenCalledWith(1024);

    // Check if the memoryColumns title includes the unit in parentheses
    // The title should be like "Capacity(KB)"
    expect(screen.getByText(/Capacity\(KB\)/)).toBeInTheDocument();
  });

  test('should format bytes with empty string when minMemoryCapacityUnit is undefined', () => {
    // Create test data with memory devices
    const testData = {
      conditions: {
        energyCriteria: 6000,
        toleranceCriteria: {
          cpu: [],
          memory: [
            {
              deviceIDs: ['mem-1'],
              limit: { averageUseBytes: 1024 },
              devices: [{ id: 'mem-1', capacity: 1024 }],
            },
          ],
        },
      },
    };

    // Setup mocks
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: testData,
      isValidating: { layout: false },
    });
    // Mock bytesToUnit to return undefined to trigger the empty string fallback
    (bytesToUnit as jest.Mock).mockReturnValue(undefined);

    // Render component
    render(<MigrationConditions />);

    // Verify formatBytes was called with empty string as second parameter
    expect(formatBytes).toHaveBeenCalledWith(1024, '');
  });
});
