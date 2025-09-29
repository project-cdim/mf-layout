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

import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { APIDeviceTypeLowerCamel, APINodePolicy, APIPolicy, APIPolicyError } from '@/types';
import { PolicyEditModalNodeConfigurationPolicy } from '@/components/PolicyEditModalNodeConfigurationPolicy';
import React, { ComponentProps } from 'react';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';
import { AxiosError } from 'axios';

describe('PolicyEditModalNodeConfigurationPolicy', () => {
  // SetUp

  const addProps = {
    modalMode: 'add',
    modalClose: jest.fn(),
    submit: jest.fn(),
    inputStatus: undefined,
    error: undefined,
  } as const satisfies ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>;

  const editProps = {
    modalMode: 'edit',
    selectedPolicyId: 'd8eceb14d1',
    modalClose: jest.fn(),
    submit: jest.fn(),
    inputStatus: undefined,
    error: undefined,
    data: dummyPolicy,
  } as const satisfies ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>;

  const policyForEditing = dummyPolicy.policies.find((policy) => policy.policyID === 'd8eceb14d1');

  test('Displayed title correctly in add mode', () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByPlaceholderText('Title')).toHaveValue('');
  });

  test('Displayed title correctly in edit mode', () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...editProps} />);
    // Act
    // Assert
    expect(screen.getByPlaceholderText('Title')).toHaveAttribute('value', policyForEditing?.title);
  });

  test('Displayed inputs correctly in add mode', () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByRole('checkbox', { name: 'CPU' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Memory' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Storage' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'GPU' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'FPGA' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Accelerator' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'DSP' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'VirtualMedia' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'GraphicController' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'NetworkInterface' })).not.toBeChecked();
    expect(
      screen.getByRole('group', { name: 'Hardware Connections Limit' }).querySelectorAll("input[type='text']").length
    ).toBe(0);
  });

  test('Displayed inputs correctly in edit mode', () => {
    // Arrange
    /** */
    function getInputValueAsNumber(container: HTMLElement, dataPath: string): number | undefined {
      const inputElement = container.querySelector<HTMLInputElement>(`input[type="text"][data-path="${dataPath}"]`);
      if (inputElement) {
        const value = inputElement.value;
        return value ? Number(value) : undefined;
      }
      return undefined;
    }
    /**
     * NOTE dummy policy
     * - memory:  1 - 5
     * - storage: 2 - 8
     * - gpu:     1 - 2
     */
    function getDummyValue(deviceType: APIDeviceTypeLowerCamel, minOrMax: 'minNum' | 'maxNum'): number | undefined {
      const hardwareConnectionsLimit = (policyForEditing?.policy as APINodePolicy).hardwareConnectionsLimit;
      if (hardwareConnectionsLimit && hardwareConnectionsLimit[deviceType]) {
        return hardwareConnectionsLimit[deviceType][minOrMax];
      }
      return undefined;
    }

    const { container } = render(<PolicyEditModalNodeConfigurationPolicy {...editProps} />);
    // Act
    // Assert
    expect(screen.getByRole('checkbox', { name: 'CPU' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Memory' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Storage' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'GPU' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'FPGA' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Accelerator' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'DSP' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'VirtualMedia' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'GraphicController' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'NetworkInterface' })).not.toBeChecked();
    expect(
      screen.getByRole('group', { name: 'Hardware Connections Limit' }).querySelectorAll("input[type='text']").length
    ).toBe(6);
    expect(getInputValueAsNumber(container, 'policies.memory.minNum')).toBe(getDummyValue('memory', 'minNum'));
    expect(getInputValueAsNumber(container, 'policies.memory.maxNum')).toBe(getDummyValue('memory', 'maxNum'));
    expect(getInputValueAsNumber(container, 'policies.storage.minNum')).toBe(getDummyValue('storage', 'minNum'));
    expect(getInputValueAsNumber(container, 'policies.storage.maxNum')).toBe(getDummyValue('storage', 'maxNum'));
    expect(getInputValueAsNumber(container, 'policies.gpu.minNum')).toBe(getDummyValue('gpu', 'minNum'));
    expect(getInputValueAsNumber(container, 'policies.gpu.maxNum')).toBe(getDummyValue('gpu', 'maxNum'));
  });

  test('The cancel button is displayed correctly', () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('The cancel button works correctly', async () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    // Assert
    expect(addProps.modalClose).toHaveBeenCalled();
  });

  test('The OK button is displayed correctly', () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('The OK button works correctly in add mode', async () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act
    await userEvent.type(screen.getByRole('textbox', { name: 'Title (100 or less)' }), 'testtitle');
    await userEvent.click(screen.getByRole('checkbox', { name: 'CPU' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(addProps.submit).toHaveBeenCalled();
  });
  test('The OK button works correctly in edit mode', async () => {
    // Arrange
    render(<PolicyEditModalNodeConfigurationPolicy {...editProps} />);
    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(editProps.submit).toHaveBeenCalled();
  });

  test('Validation: When the title is over 101 characters, an error is displayed', async () => {
    // Arrange
    /** Press the OK button. Error: 'Please enter between 1 to 100 characters' */
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    const titleInput = screen.getByPlaceholderText('Title');
    // Act 1
    // Input 100 characters
    await userEvent.clear(titleInput);
    await userEvent.type(
      titleInput,
      '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
    );
    // Assert 1
    expect(screen.queryByText('Enter between 1 and 100 characters', { exact: false })).not.toBeInTheDocument();
    // Act 2
    // Input 101 characters
    await userEvent.clear(titleInput);
    await userEvent.type(
      titleInput,
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'
    );
    // Assert 2
    await waitFor(() => {
      expect(screen.getByText('Enter between 1 and 100 characters', { exact: false })).toBeInTheDocument();
    });
  }, 10000);

  test('Validation: When there is no input for the title, an error is displayed', async () => {
    // Arrange
    /** Press the OK button. Error: 'Please enter between 1 to 100 characters' */
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    const titleInput = screen.getByPlaceholderText('Title');
    // Act 1
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert 1
    await waitFor(() => {
      expect(screen.getByText('Enter between 1 and 100 characters', { exact: false })).toBeInTheDocument();
    });
    // Act 2
    await userEvent.type(titleInput, '111');
    // Assert 2
    expect(screen.queryByText('Enter between 1 and 100 characters', { exact: false })).not.toBeInTheDocument();
    // Act 3
    await userEvent.clear(titleInput);
    // Assert 3
    await waitFor(() => {
      expect(screen.getByText('Enter between 1 and 100 characters', { exact: false })).toBeInTheDocument();
    });
  });

  test('Validation: When there is no selection for the device (checkbox), an error is displayed', async () => {
    // Arrange
    /** Mock the InputSet and set the data within it, press the OK button or uncheck. Error: 'Please check at least one' */
    render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    const titleInput = screen.getByPlaceholderText('Title');
    // Act 1
    await userEvent.type(titleInput, 'testtitle');
    // Assert 1
    expect(screen.queryByText('Check at least one', { exact: false })).not.toBeInTheDocument();
    // Act 2
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert 2
    expect(screen.getByText('Check at least one', { exact: false })).toBeInTheDocument();
    // Act 3
    await userEvent.click(screen.getByRole('checkbox', { name: 'CPU' })); //on
    await userEvent.click(screen.getByRole('checkbox', { name: 'CPU' })); //off
    // Assert 3
    expect(screen.getByText('Check at least one', { exact: false })).toBeInTheDocument();
  });

  test('Validation: check values, when minimum value > maximum value, errors are displayed', async () => {
    // Arrange
    const errorPolicy: APIPolicy = {
      policyID: 'd8eceb14da',
      category: 'nodeConfigurationPolicy',
      title: 'Constraint conditions related to node configuration constraints',
      policy: {
        hardwareConnectionsLimit: {
          cpu: {
            // Minimum value > Maximum value error
            maxNum: 5,
            minNum: 10,
          },
          networkInterface: {
            // Minimum value > Maximum value error
            maxNum: 0,
            minNum: 3,
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    };
    const editProps2 = {
      ...editProps,
      selectedPolicyId: 'd8eceb14da',
      data: {
        count: 1,
        policies: [errorPolicy],
      },
    } as const satisfies ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>;
    render(<PolicyEditModalNodeConfigurationPolicy {...editProps2} />);
    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(screen.getAllByText('Specify a maximum value', { exact: false }).length).toBe(2);
    expect(screen.getAllByText('Specify a minimum value', { exact: false }).length).toBe(2);
  });

  test('Validation: check values, onChange value', async () => {
    // Arrange
    const { container } = render(<PolicyEditModalNodeConfigurationPolicy {...addProps} />);
    // Act 0
    await userEvent.click(screen.getByRole('checkbox', { name: 'CPU' })); //on
    const cpuMinInput = container.querySelector<HTMLInputElement>(
      'input[type="text"][data-path="policies.cpu.minNum"]'
    );
    const cpuMaxInput = container.querySelector<HTMLInputElement>(
      'input[type="text"][data-path="policies.cpu.maxNum"]'
    );
    // Act 1
    await userEvent.type(cpuMinInput!, '3'); //wrong input, max(default:1) < min
    // Assert 1
    expect(screen.getByText('Specify a minimum value', { exact: false })).toBeInTheDocument();
    // Act 2
    await userEvent.type(cpuMaxInput!, '2'); //wrong input, max < min(inputed:3)
    // Assert 2
    expect(screen.queryByText('Specify a minimum value', { exact: false })).not.toBeInTheDocument();
    expect(screen.getByText('Specify a maximum value', { exact: false })).toBeInTheDocument;
  });

  test('Validation: devices not selected are not validated', async () => {
    // Arrange
    /** Because the entered value is not initialized when deselected */
    const editProps2 = {
      ...editProps,
      selectedPolicyId: 'd8eceb14da',
      data: {
        count: 1,
        policies: [
          {
            policyID: 'd8eceb14da',
            category: 'nodeConfigurationPolicy',
            title: 'Constraint conditions related to node configuration constraints',
            policy: {
              hardwareConnectionsLimit: {
                cpu: {
                  maxNum: 10,
                  minNum: 5,
                },
                networkInterface: {
                  // Minimum value > Maximum value error
                  maxNum: 0,
                  minNum: 3,
                },
              },
            },
            enabled: true,
            createdAt: '2023-05-10T00:00:00Z',
            updatedAt: '2023-05-10T00:00:00Z',
          },
        ],
      },
    } as const satisfies ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>;
    render(<PolicyEditModalNodeConfigurationPolicy {...editProps2} />);
    // Act
    await userEvent.click(screen.getByRole('checkbox', { name: 'NetworkInterface' })); //has error, but be off
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(screen.queryByText('Check at least one', { exact: false })).not.toBeInTheDocument();
    expect(editProps.submit).toHaveBeenCalled();
  });

  test('Displays the error message correctly (when there is no error.response)', () => {
    // Arrange
    const props = {
      modalMode: 'edit',
      selectedPolicyId: 'd8eceb14da',
      data: dummyPolicy,
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      inputStatus: undefined,
      error: new AxiosError('An error occurred'),
    } as const satisfies ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>;
    render(<PolicyEditModalNodeConfigurationPolicy {...props} />);
    // Act
    // Assert
    expect(screen.getByText('An error occurred', { exact: false })).toBeInTheDocument();
  });

  test('Displays the error message from the API correctly', () => {
    // Arrange
    const props = {
      modalMode: 'edit',
      selectedPolicyId: 'd8eceb14da',
      data: dummyPolicy,
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      inputStatus: undefined,
      error: {
        message: 'An error occurred',
        response: {
          data: {
            code: 'E0000',
            message: 'Error Message',
          },
        },
      } as AxiosError<APIPolicyError, any>,
    } as const satisfies ComponentProps<typeof PolicyEditModalNodeConfigurationPolicy>;
    render(<PolicyEditModalNodeConfigurationPolicy {...props} />);
    // Act
    // Assert
    expect(screen.getByText('E0000', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Error Message', { exact: false })).toBeInTheDocument();
  });
});
