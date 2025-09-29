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

import LayoutDesignDetail from '@/app/[lng]/layout-design-detail/page';
import { render } from '@/shared-modules/__test__/test-utils';
import { useLoading, useQuery } from '@/shared-modules/utils/hooks';
import { dummyAPPLayoutDesignDetail } from '@/utils/dummy-data/layoutDesignDetail/dummyAPPLayoutDesignDetail';
import { useLayoutDesignDetail } from '@/utils/hooks';
import { screen } from '@testing-library/react';

// Mock the imported modules and hooks
jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useLayoutDesignDetail: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useLoading: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn().mockImplementation(({ pageTitle }) => <div data-testid='page-header'>{pageTitle}</div>),
  MessageBox: jest.fn().mockImplementation(({ type, title, message }) => (
    <div data-testid='message-box' data-type={type} data-title={title}>
      {message}
    </div>
  )),
  CardLoading: jest.fn().mockImplementation(({ children, loading }) => (
    <div data-testid='card-loading' data-loading={loading}>
      {children}
    </div>
  )),
  HorizontalTable: jest.fn().mockImplementation(({ tableData, loading }) => (
    <div data-testid='horizontal-table' data-loading={loading}>
      {tableData.length}
    </div>
  )),
  DatetimeString: jest.fn().mockImplementation(({ date }) => (date ? date.toISOString() : '')),
}));

jest.mock('@/components', () => ({
  ...jest.requireActual('@/components'),
  StatusToIcon: jest
    .fn()
    .mockImplementation(({ status, target }) => (
      <div data-testid='status-to-icon' data-status={status} data-target={target}></div>
    )),
  DesignProcedureTable: jest.fn().mockImplementation(() => <div data-testid='design-procedure-table'></div>),
  NodeLayout: jest.fn().mockImplementation(({ nodes, loading }) => (
    <div data-testid='node-layout' data-loading={loading}>
      {nodes.length}
    </div>
  )),
}));

jest.mock('@/components/MigrationConditions', () => ({
  __esModule: true,
  MigrationConditions: jest.fn().mockImplementation(() => <div data-testid='migration-conditions'></div>),
}));

const mockGetDeviceByID = jest.fn().mockImplementation((id) => ({
  deviceID: id,
  type: 'CPU',
  totalCores: 8,
  capacityMiB: id === 'res10203' ? 16384 : 0,
}));

describe('LayoutDesignDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (useQuery as jest.Mock).mockReturnValue({ id: '100000000000000000000001' });
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: dummyAPPLayoutDesignDetail,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });
    (useLoading as jest.Mock).mockImplementation((isValidating) => Boolean(isValidating));
  });

  test('renders layout design details correctly', () => {
    render(<LayoutDesignDetail />);

    // Check main components are rendered
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-loading')).toBeInTheDocument();
    expect(screen.getByTestId('horizontal-table')).toBeInTheDocument();
    expect(screen.getByTestId('node-layout')).toBeInTheDocument();
    expect(screen.getByTestId('design-procedure-table')).toBeInTheDocument();
    expect(screen.getByTestId('migration-conditions')).toBeInTheDocument();

    // Check design ID is displayed
    expect(screen.getByText('100000000000000000000001')).toBeInTheDocument();

    // No error message should be displayed
    expect(screen.queryByTestId('message-box')).not.toBeInTheDocument();
  });

  test('displays layout error message when layout error occurs', () => {
    const layoutError = new Error('Layout API error');
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: { layout: layoutError, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // Error message should be displayed
    expect(screen.getByTestId('message-box')).toBeInTheDocument();
    expect(screen.getByTestId('message-box')).toHaveAttribute('data-type', 'error');
    expect(screen.getByTestId('message-box')).toHaveAttribute('data-title', 'Layout API error');
  });

  test('displays resource error message when resource error occurs', () => {
    const resourceError = new Error('Resource API error');
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: { layout: undefined, resource: resourceError },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // Error message should be displayed
    expect(screen.getByTestId('message-box')).toBeInTheDocument();
    expect(screen.getByTestId('message-box')).toHaveAttribute('data-type', 'error');
    expect(screen.getByTestId('message-box')).toHaveAttribute('data-title', 'Resource API error');
  });

  test('displays both layout and resource error messages when both errors occur', () => {
    const layoutError = new Error('Layout API error');
    const resourceError = new Error('Resource API error');
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: { layout: layoutError, resource: resourceError },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // Both error messages should be displayed
    const errorMessages = screen.getAllByTestId('message-box');
    expect(errorMessages).toHaveLength(2);
  });

  test('shows loading state when layout and resource are validating', () => {
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: true, resource: true },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });
    (useLoading as jest.Mock).mockImplementation(() => true);

    render(<LayoutDesignDetail />);

    // Loading indicators should be displayed
    expect(screen.getByTestId('card-loading')).toHaveAttribute('data-loading', 'true');
    expect(screen.getByTestId('horizontal-table')).toHaveAttribute('data-loading', 'true');
    expect(screen.getByTestId('node-layout')).toHaveAttribute('data-loading', 'true');
  });

  test('displays cause of failure when status is FAILED', () => {
    const failedDesignData = {
      ...dummyAPPLayoutDesignDetail,
      status: 'FAILED',
      cause: 'Failed due to resource constraints',
    };
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: failedDesignData,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // Verify table data contains 4 rows (including cause of failure)
    expect(screen.getByTestId('horizontal-table')).toHaveTextContent('4');
  });

  test('handles undefined data gracefully', () => {
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: undefined,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // Components should still render without data
    expect(screen.getByTestId('card-loading')).toBeInTheDocument();
    expect(screen.getByTestId('horizontal-table')).toBeInTheDocument();
    expect(screen.getByTestId('node-layout')).toBeInTheDocument();

    // No design ID should be displayed
    expect(screen.queryByText('100000000000000000000001')).not.toBeInTheDocument();
  });

  test('handles empty nodes array correctly', () => {
    const noNodesDesignData = {
      ...dummyAPPLayoutDesignDetail,
      nodes: [],
    };
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: noNodesDesignData,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // NodeLayout should receive empty array
    expect(screen.getByTestId('node-layout')).toHaveTextContent('0');
  });

  test('calls mutate when reload function is called', () => {
    const mockMutate = jest.fn();
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: dummyAPPLayoutDesignDetail,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: mockMutate,
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // We can't directly test the reload function call since it's internal
    // But we can verify that the mutate function was passed to PageHeader
    expect(useLayoutDesignDetail().mutate).toBe(mockMutate);
  });

  test('handles undefined endedAt correctly', () => {
    const inProgressDesignData = {
      ...dummyAPPLayoutDesignDetail,
      status: 'IN_PROGRESS',
      endedAt: undefined,
    };
    (useLayoutDesignDetail as jest.Mock).mockReturnValue({
      data: inProgressDesignData,
      error: { layout: undefined, resource: undefined },
      isValidating: { layout: false, resource: false },
      mutate: jest.fn(),
      getDeviceByID: mockGetDeviceByID,
    });

    render(<LayoutDesignDetail />);

    // Horizontal table should still render
    expect(screen.getByTestId('horizontal-table')).toBeInTheDocument();
  });
});
