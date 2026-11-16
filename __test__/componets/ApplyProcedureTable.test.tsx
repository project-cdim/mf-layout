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
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { ApplyProcedureTable } from '@/components';

import { useLayoutApplyDetail } from '@/utils/hooks';

jest.mock('@/shared-modules/utils/hooks/useQuery', () => ({
  useQuery: () => ({ id: '1' }),
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
jest.mock('@tabler/icons-react', () => ({
  ...jest.requireActual('@tabler/icons-react'),
  IconAlertCircleFilled: () => <div data-testid='icon-alert-circle-filled'></div>,
}));

describe('ApplyProcedureTable', () => {
  test('renders the table title', () => {
    render(<ApplyProcedureTable />);
    expect(screen.getByText('Migration Steps')).toBeInTheDocument();
  });

  test('renders the visible columns checkbox group', () => {
    render(<ApplyProcedureTable />);
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  test('renders the apply and rollback checkboxes', () => {
    render(<ApplyProcedureTable />);
    expect(screen.getByLabelText('Apply')).toBeInTheDocument();
    expect(screen.getByLabelText('Rollback')).toBeInTheDocument();
  });

  test('renders the CustomDataTable component', () => {
    render(<ApplyProcedureTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test.each([
    [true, true],
    [false, true],
    [true, false],
  ])('renders loader', (layout, resource) => {
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: { applyID: '1', apply: { status: 'IN_PROGRESS', startedAt: new Date() }, procedures: [] },
      error: {
        layout: undefined,
        resource: undefined,
      },
      isValidating: {
        layout: layout,
        resource: resource,
      },
      mutate: () => void {},
    });
    const { container } = render(<ApplyProcedureTable />);
    expect(container).toDisplayLoader();
  });

  test('renders row with layout and rolleback error record', async () => {
    const user = userEvent.setup({ delay: null });
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: '1',
        apply: { status: 'IN_PROGRESS', startedAt: new Date() },
        procedures: [
          {
            operationID: '1',
            targetCPUID: '1',
            targetDevice: 'device',
            apply: {
              operation: 'operation',
              dependencies: [],
              status: 'FAILED',
              error: { code: 'error0001', message: 'error0001 has occurred' },
            },
            rollback: {
              operation: 'operation',
              dependencies: [],
              status: 'FAILED',
              error: { code: 'error0002', message: 'error0002 has occurred' },
            },
          },
        ],
      },
      error: {
        layout: undefined,
        resource: undefined,
      },
      isValidating: {
        layout: false,
        resource: false,
      },
      mutate: () => void {},
    });

    render(<ApplyProcedureTable />);
    const errorRow = screen.getAllByRole('row')[2];
    expect(errorRow).toHaveStyle('background-color: rgb(255, 201, 201)');

    await user.click(errorRow);

    expect(screen.getAllByTestId('icon-alert-circle-filled')).toHaveLength(2);
    expect(screen.getAllByText('{action} Failed')).toHaveLength(2);
    expect(screen.getByText('Error Code : error0001')).toBeInTheDocument();
    expect(screen.getByText('Message : error0001 has occurred')).toBeInTheDocument();
    expect(screen.getByText('Error Code : error0002')).toBeInTheDocument();
    expect(screen.getByText('Message : error0002 has occurred')).toBeInTheDocument();
  });

  test('renders row with layout error record', async () => {
    const user = userEvent.setup({ delay: null });
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: '1',
        apply: { status: 'IN_PROGRESS', startedAt: new Date() },
        procedures: [
          {
            operationID: '1',
            targetCPUID: '1',
            targetDevice: 'device',
            apply: {
              operation: 'operation',
              dependencies: [],
              status: 'FAILED',
              error: { code: 'error0001', message: 'error0001 has occurred' },
            },
            rollback: {
              operation: 'operation',
              dependencies: [],
              status: 'COMPLETED',
              error: undefined,
            },
          },
        ],
      },
      error: {
        layout: undefined,
        resource: undefined,
      },
      isValidating: {
        layout: false,
        resource: false,
      },
      mutate: () => void {},
    });

    render(<ApplyProcedureTable />);
    const errorRow = screen.getAllByRole('row')[2];
    expect(errorRow).toHaveStyle('background-color: rgb(255, 201, 201)');

    await user.click(errorRow);

    expect(screen.getByTestId('icon-alert-circle-filled')).toBeInTheDocument();
    expect(screen.getByText('{action} Failed')).toBeInTheDocument();
    expect(screen.getByText('Error Code : error0001')).toBeInTheDocument();
    expect(screen.getByText('Message : error0001 has occurred')).toBeInTheDocument();
  });

  test('renders row with rollback error record', async () => {
    const user = userEvent.setup({ delay: null });
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: '1',
        apply: { status: 'IN_PROGRESS', startedAt: new Date() },
        procedures: [
          {
            operationID: '1',
            targetCPUID: '1',
            targetDevice: 'device',
            apply: {
              operation: 'operation',
              dependencies: [],
              status: 'COMPLETED',
              error: undefined,
            },
            rollback: {
              operation: 'operation',
              dependencies: [],
              status: 'FAILED',
              error: { code: 'error0002', message: 'error0002 has occurred' },
            },
          },
        ],
      },
      error: {
        layout: undefined,
        resource: undefined,
      },
      isValidating: {
        layout: false,
        resource: false,
      },
      mutate: () => void {},
    });

    render(<ApplyProcedureTable />);
    const errorRow = screen.getAllByRole('row')[2];
    expect(errorRow).toHaveStyle('background-color: rgb(255, 201, 201)');

    await user.click(errorRow);

    expect(screen.getByTestId('icon-alert-circle-filled')).toBeInTheDocument();
    expect(screen.getByText('{action} Failed')).toBeInTheDocument();
    expect(screen.getByText('Error Code : error0002')).toBeInTheDocument();
    expect(screen.getByText('Message : error0002 has occurred')).toBeInTheDocument();
  });

  test('renders row with error record, but no error code and message', async () => {
    const user = userEvent.setup({ delay: null });
    (useLayoutApplyDetail as jest.Mock).mockReturnValue({
      data: {
        applyID: '1',
        apply: { status: 'IN_PROGRESS', startedAt: new Date() },
        procedures: [
          {
            operationID: '1',
            targetCPUID: '1',
            targetDevice: 'device',
            apply: {
              operation: 'operation',
              dependencies: [],
              status: 'FAILED',
              error: undefined,
            },
            rollback: {
              operation: 'operation',
              dependencies: [],
              status: 'FAILED',
              error: undefined,
            },
          },
        ],
      },
      error: {
        layout: undefined,
        resource: undefined,
      },
      isValidating: {
        layout: false,
        resource: false,
      },
      mutate: () => void {},
    });

    render(<ApplyProcedureTable />);
    const errorRow = screen.getAllByRole('row')[2];
    expect(errorRow).toHaveStyle('background-color: rgb(255, 201, 201)');

    await user.click(errorRow);

    expect(screen.getAllByTestId('icon-alert-circle-filled')).toHaveLength(2);
    expect(screen.getAllByText('{action} Failed')).toHaveLength(2);
    expect(screen.getAllByText('Error Code : -')).toHaveLength(2);
    expect(screen.getAllByText('Message : -')).toHaveLength(2);
  });
});
