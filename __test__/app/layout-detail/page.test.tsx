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

import { LoadingOverlay } from '@mantine/core';
import { act, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DataTable } from 'mantine-datatable';
import { ReactFlow } from 'reactflow';
import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';
import { APIresource, APIresources } from '@/shared-modules/types';
import { useQuery } from '@/shared-modules/utils/hooks';

import LayoutDetail from '@/app/[lng]/layout-detail/page';
import { LayoutDetail as DummyLayoutDetail } from '@/utils/dummy-data/layoutDetail/LayoutDetail1';
import { LayoutDetail as DummyLayoutDetail2 } from '@/utils/dummy-data/layoutDetail/LayoutDetail2';
import { LayoutDetail as DummyLayoutDetail14 } from '@/utils/dummy-data/layoutDetail/LayoutDetail14';
import { LayoutDetail as DummyLayoutDetail15 } from '@/utils/dummy-data/layoutDetail/LayoutDetail15';

jest.mock('next/link');
// jest.mock('swr');
jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/shared-modules/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn(),
  useMSW: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));

jest.mock('mantine-datatable');
jest.mock('reactflow', () => ({
  __esModule: true,
  ...jest.requireActual('reactflow'),
  ReactFlow: jest.fn(),
}));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  LoadingOverlay: jest.fn(),
}));

// Dummy original data
const resourcesOrg: APIresource = {
  annotation: {
    available: true,
  },
  device: {
    deviceID: 'xxx',
    status: {
      health: 'OK',
      state: 'Enabled',
    },
    type: 'CPU',
    deviceSwitchInfo: 'CXLxxx',
    links: [
      {
        type: 'CPU',
        deviceID: 'xxx',
      },
    ],
  },
  resourceGroupIDs: [],
  nodeIDs: [],
};

// dummy data
const dummyResourcesDetail: APIresources = {
  count: 100,
  resources: [
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'res10101',
        type: 'CPU',
        totalCores: 8,
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'res10201',
        type: 'memory',
        capacityMiB: 32 * 1024, // 32GiB
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'res10301',
        type: 'storage',
        driveCapacityBytes: 4 * 1024 * 1024 * 1024 * 1024, // 4 TiB
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'res10401',
        type: 'networkInterface',
        links: [],
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST105',
        type: 'CPU',
        totalCores: 16,
        links: [],
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST106',
        type: 'memory',
        capacityMiB: 64 * 1024,
        links: [],
      },
    },
    {
      ...resourcesOrg,
      device: {
        ...resourcesOrg.device,
        deviceID: 'resTEST107',
        type: 'storage',
        driveCapacityBytes: 8 * 1024 * 1024 * 1024 * 1024,
        links: [],
      },
    },
  ],
};

describe('LayoutDetail', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    (useSWRImmutable as unknown as jest.Mock).mockReset();
    (useSWRImmutable as unknown as jest.Mock).mockImplementation((key: string) => ({
      data: key && key.includes('resources') ? dummyResourcesDetail : DummyLayoutDetail,
      error: null,
      mutate: jest.fn(),
    }));
    (useQuery as unknown as jest.Mock).mockReturnValue({ id: '636ddde1ba39547845db0628' });
  });

  test('Ensure the PageHeader receives the correct title and breadcrumb list', () => {
    render(<LayoutDetail />);

    const givenProps = (PageHeader as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    const mutate = givenProps.mutate;
    mutate();
    expect(givenProps.pageTitle).toBe('Layout Design Details');
    expect(givenProps.items).toEqual([
      { title: 'Layout Management' },
      {
        href: '/cdim/lay-layout-list',
        title: 'Layout Designs',
      },
      {
        title: 'Layout Design Details <636ddde1ba39547845db0628>',
      },
    ]);
  });

  test('Loading is displayed', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      isValidating: true,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);

    expect((LoadingOverlay as unknown as jest.Mock).mock.lastCall[0].visible).toBe(true);
  });
  test('Loading is not displayed', async () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);
    await waitFor(() => {
      expect((LoadingOverlay as unknown as jest.Mock).mock.lastCall[0].visible).toBe(false);
    });
  });
  test('Table sorting', () => {
    const user = userEvent.setup({ delay: null });
    (DataTable as unknown as jest.Mock).mockImplementation((props) => {
      return (
        <div data-testid='container'>
          <button
            onClick={() => {
              props.onSortStatusChange({
                columnAccessor: 'operationID',
                direction: 'desc',
              });
            }}
          >
            onSortStatusChange
          </button>
          <p data-testid='onSortStatusChangeName'>{props.onSortStatusChange.name}</p>
        </div>
      );
    });
    render(<LayoutDetail />);
    const button = screen.getByRole('button', { name: 'onSortStatusChange' });
    user.click(button);

    expect(screen.getByTestId('onSortStatusChangeName')).toHaveTextContent('handleSortStatus');
  });
  test('Pagination', async () => {
    // Select the second page from the DataTable side
    (DataTable as unknown as jest.Mock).mockImplementation((props) => {
      // Perform asynchronously to avoid updating state during rendering
      setTimeout(() =>
        act(() => {
          props.onPageChange(2), 0;
        })
      );
      return null;
    });

    render(<LayoutDetail />);
    await waitFor(() => {
      expect((DataTable as unknown as jest.Mock).mock.lastCall[0].page).toBe(2);
    });
  });
  test('When the server returns an error, a message is displayed', async () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      error: {
        message: 'An error occurred',
        response: {
          data: {
            message: 'Error Message',
          },
        },
      },
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);
    (MessageBox as unknown as jest.Mock).mock.calls.forEach((call) => {
      expect(call[0].type).toBe('error');
      expect(call[0].title).toBe('An error occurred');
      expect(call[0].message).toBe('Error Message');
    });
  });

  test('When unable to connect to the server, a message is displayed', async () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      error: {
        message: 'An error occurred',
        response: null,
      },
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);
    (MessageBox as unknown as jest.Mock).mock.calls.forEach((call) => {
      expect(call[0].type).toBe('error');
      expect(call[0].title).toBe('An error occurred');
      expect(call[0].message).toBe('');
    });
  });
  test('While the query is not retrieved, the id is set to an empty string', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn(),
    }));

    (useQuery as unknown as jest.Mock).mockReturnValue({ id: undefined });
    render(<LayoutDetail />);
    const layoutID = screen.getByText('Layout ID').nextSibling;
    expect(layoutID).toHaveTextContent('');
  });

  test('When the query is empty, the id is set to an empty string', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn(),
    }));

    (useQuery as unknown as jest.Mock).mockReturnValue({});
    render(<LayoutDetail />);
    const layoutID = screen.getByText('Layout ID').nextSibling;
    expect(layoutID).toHaveTextContent('');
  });

  test('When the migration steps are an empty array, the table is empty', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation((key: string) => ({
      data: key && key.includes('resources') ? dummyResourcesDetail : DummyLayoutDetail2,
      error: null,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);

    const lastCall = (DataTable as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(lastCall.records).toHaveLength(0);
  });

  test('The title "Node Configuration" is displayed', () => {
    render(<LayoutDetail />);
    expect(screen.getByText('Node Layout')).toBeInTheDocument();
  });
  test('When the configuration proposal data cannot be retrieved, the "Node Configuration" title is not displayed', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation((key: string) => ({
      data: key && key.includes('resources') ? dummyResourcesDetail : null,
      error: null,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);
    expect(screen.queryByText('Node Layout')).not.toBeInTheDocument();
  });
  test('When the configuration proposal data does not include resource information in the node configuration diagram, only node elements are passed to ReactFlow', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation((key: string) => ({
      data: key && key.includes('resources') ? dummyResourcesDetail : DummyLayoutDetail14,
      error: null,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);
    const lastCall = (ReactFlow as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(lastCall.nodes).not.toEqual([]);
    expect(lastCall.edges).toEqual([]);
  });
  test('When the design of the configuration proposal data is empty, an empty array is passed to ReactFlow', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation((key: string) => ({
      data: key && key.includes('resources') ? dummyResourcesDetail : DummyLayoutDetail15,
      error: null,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);

    const lastCall = (ReactFlow as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(lastCall.nodes).toEqual([]);
    expect(lastCall.edges).toEqual([]);
  });
  test('The node elements in the configuration diagram have no links', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation((key: string) => ({
      data: key && key.includes('resources') ? dummyResourcesDetail : DummyLayoutDetail14,
      error: null,
      mutate: jest.fn(),
    }));
    render(<LayoutDetail />);

    const lastCall = (ReactFlow as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(lastCall.nodes.find((item: { type: string }) => item.type === 'device')).toBeFalsy();
  });

  test('The resource elements in the configuration diagram have links', () => {
    render(<LayoutDetail />);
    const lastCall = (ReactFlow as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call

    lastCall.nodeTypes.node(lastCall.nodes.find((item: { type: string }) => item.type === 'node'));
    lastCall.nodeTypes.device(lastCall.nodes.find((item: { type: string }) => item.type === 'device'));
    lastCall.nodeTypes.device(lastCall.nodes.find((item: { data: { spec: string } }) => item.data.spec === '-'));

    expect(lastCall.nodes.find((item: { type: string }) => item.type === 'device')).toBeTruthy();
  });
});
