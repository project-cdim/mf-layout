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

import { screen, waitFor } from '@testing-library/react';
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
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the table title', () => {
    render(<ApplyProcedureTable />);
    expect(screen.getByText('Migration Steps')).toBeInTheDocument();
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
    expect(screen.getAllByText('Error Code : Unknown')).toHaveLength(2);
    expect(screen.getAllByText('Message : If the problem persists, please contact your administrator')).toHaveLength(2);
  });

  describe('Column Settings Feature', () => {
    test('renders settings button', () => {
      render(<ApplyProcedureTable />);
      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      expect(settingsButton).toBeInTheDocument();
    });

    test('opens column settings dialog when settings button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText('Column settings')).toBeInTheDocument();
      });
      // Verify table name is shown in dialog (may appear multiple times)
      expect(screen.getAllByText('Migration Steps').length).toBeGreaterThan(0);
    });

    test('displays all column checkboxes in settings dialog', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      // Check that all column checkboxes are displayed
      await waitFor(() => {
        expect(screen.getByLabelText('ID')).toBeInTheDocument();
      });
      expect(screen.getByLabelText('Host CPU ID')).toBeInTheDocument();
      expect(screen.getByLabelText('Target Device')).toBeInTheDocument();
      expect(screen.getByLabelText('Apply')).toBeInTheDocument();
      expect(screen.getByLabelText('Rollback')).toBeInTheDocument();
    });

    test('ID column checkbox is disabled (fixed column)', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      const idCheckbox = await waitFor(() => screen.getByLabelText('ID'));
      expect(idCheckbox).toBeDisabled();
    });

    test('closes settings dialog when save button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      // Uncheck "Host CPU ID" column
      const hostCpuIdCheckbox = await waitFor(() => screen.getByLabelText('Host CPU ID'));
      await user.click(hostCpuIdCheckbox);

      // Verify save button is present
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeInTheDocument();

      // Click save button
      await user.click(saveButton);

      // Verify dialog is closed after save
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
      });
    });

    test('restores default columns when "Restore defaults" button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      // Open settings dialog
      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      // Uncheck some columns
      const hostCpuIdCheckbox = await waitFor(() => screen.getByLabelText('Host CPU ID'));
      const targetDeviceCheckbox = screen.getByLabelText('Target Device');
      await user.click(hostCpuIdCheckbox);
      await user.click(targetDeviceCheckbox);

      // Click "Restore defaults" button
      const restoreButton = screen.getByRole('button', { name: /restore defaults/i });
      await user.click(restoreButton);

      // Verify checkboxes are restored to default state
      expect(screen.getByLabelText('ID')).toBeChecked();
      expect(screen.getByLabelText('Host CPU ID')).toBeChecked();
      expect(screen.getByLabelText('Target Device')).toBeChecked();
      expect(screen.getByLabelText('Apply')).toBeChecked();
      expect(screen.getByLabelText('Rollback')).toBeChecked();
    });

    test('closes settings dialog when cancel button is clicked without saving', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      // Uncheck a column
      const hostCpuIdCheckbox = await waitFor(() => screen.getByLabelText('Host CPU ID'));
      await user.click(hostCpuIdCheckbox);

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Verify dialog is closed
      await waitFor(() => {
        expect(screen.queryByText('Column settings')).not.toBeInTheDocument();
      });

      // Verify localStorage was not updated
      const storageKey = Object.keys(localStorage).find((key) =>
        key.includes('layout-apply-detail.apply-procedure-table')
      );
      expect(storageKey).toBeUndefined();
    });

    test('uses commonColumns when both Apply and Rollback columns are hidden', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ApplyProcedureTable />);

      // Open column settings dialog
      const settingsButton = screen.getByRole('button', { name: 'Column settings' });
      await user.click(settingsButton);

      // Uncheck both Apply and Rollback columns
      const applyCheckbox = await waitFor(() => screen.getByLabelText('Apply'));
      const rollbackCheckbox = screen.getByLabelText('Rollback');
      await user.click(applyCheckbox);
      await user.click(rollbackCheckbox);

      // Save the settings
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
      });

      // Verify the table is still rendered (now using commonColumns instead of groups)
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Migration Steps')).toBeInTheDocument();
    });
  });

  describe('onStorageError callback', () => {
    test('calls onStorageError callback when storage error occurs', () => {
      const onStorageError = jest.fn();

      // Mock localStorage to throw an error
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      (useLayoutApplyDetail as jest.Mock).mockReturnValue({
        data: {
          applyID: '1',
          apply: { status: 'IN_PROGRESS', startedAt: new Date() },
          procedures: [],
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

      render(<ApplyProcedureTable onStorageError={onStorageError} />);

      // Verify onStorageError was called
      expect(onStorageError).toHaveBeenCalled();

      // Restore the original implementation
      setItemSpy.mockRestore();
    });
  });
});
