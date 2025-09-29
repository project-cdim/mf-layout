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

import { APIDeviceTypeLowerCamel, APIPolicy, APIPolicyError, APISystemPolicy } from '@/types';
import { PolicyEditModalSystemOperationPolicy } from '@/components/PolicyEditModalSystemOperationPolicy';
import React, { ComponentProps } from 'react';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';
import { AxiosError } from 'axios';

describe('PolicyEditModalSystemOperationPolicy', () => {
  // SetUp

  const addProps = {
    modalMode: 'add',
    modalClose: jest.fn(),
    submit: jest.fn(),
    inputStatus: undefined,
    error: undefined,
  } as const satisfies ComponentProps<typeof PolicyEditModalSystemOperationPolicy>;

  const editProps = {
    modalMode: 'edit',
    selectedPolicyId: 'abc10dfaa9',
    modalClose: jest.fn(),
    submit: jest.fn(),
    inputStatus: undefined,
    error: undefined,
    data: dummyPolicy,
  } as const satisfies ComponentProps<typeof PolicyEditModalSystemOperationPolicy>;

  const policyForEditing = dummyPolicy.policies.find((policy) => policy.policyID === 'abc10dfaa9');

  test('Displayed title correctly in add mode', () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByPlaceholderText('Title')).toHaveValue('');
  });

  test('Displayed title correctly in edit mode', () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...editProps} />);
    // Act
    // Assert
    expect(screen.getByPlaceholderText('Title')).toHaveAttribute('value', policyForEditing?.title);
  });

  test('Displayed inputs correctly in add mode', () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
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
    expect(screen.getByRole('group', { name: 'Usage Threshold' }).querySelectorAll("input[type='text']").length).toBe(
      0
    );
  });

  test('Displayed inputs correctly in edit mode', () => {
    // Arrange
    /** */
    function getInputValueAsNumber(container: HTMLElement, dataPath: string): number | string | undefined {
      const inputElement = container.querySelector<HTMLInputElement>(`input[data-path="${dataPath}"]`);
      return inputElement?.value;
    }
    /**
     * NOTE dummy policy
     * - cpu: < 80%
     * - memory: < 60%
     */
    function getDummyValue(
      deviceType: APIDeviceTypeLowerCamel,
      key: 'value' | 'unit' | 'comparison'
    ): number | string | undefined {
      let returnValue = undefined;
      const useThreshold = (policyForEditing?.policy as APISystemPolicy).useThreshold;
      if (useThreshold && useThreshold[deviceType]) {
        returnValue = useThreshold[deviceType][key];
      }
      switch (returnValue) {
        case undefined:
          break;
        case 'percent':
          returnValue = '%';
          break;
        case 'gt':
          returnValue = '>';
          break;
        case 'lt':
          returnValue = '<';
          break;
        case 'ge':
          returnValue = '≥';
          break;
        case 'le':
          returnValue = '≤';
          break;
        default:
          returnValue = String(returnValue);
          break;
      }
      return returnValue;
    }
    const { container } = render(<PolicyEditModalSystemOperationPolicy {...editProps} />);
    // Act
    // Assert
    expect(screen.getByRole('checkbox', { name: 'CPU' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Memory' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Storage' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'GPU' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'FPGA' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Accelerator' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'DSP' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'VirtualMedia' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'GraphicController' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'NetworkInterface' })).not.toBeChecked();
    expect(screen.getAllByRole('textbox').length).toBe(7); // title, cpu*3, memory*3
    expect(getInputValueAsNumber(container, 'policies.cpu.comparison')).toBe(getDummyValue('cpu', 'comparison'));
    expect(getInputValueAsNumber(container, 'policies.cpu.value')).toBe(getDummyValue('cpu', 'value'));
    expect(getInputValueAsNumber(container, 'policies.cpu.unit')).toBe(getDummyValue('cpu', 'unit'));
    expect(getInputValueAsNumber(container, 'policies.memory.comparison')).toBe(getDummyValue('memory', 'comparison'));
    expect(getInputValueAsNumber(container, 'policies.memory.value')).toBe(getDummyValue('memory', 'value'));
    expect(getInputValueAsNumber(container, 'policies.memory.unit')).toBe(getDummyValue('memory', 'unit'));
  });

  test('The cancel button is displayed correctly', () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('The cancel button works correctly', async () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    // Assert
    expect(addProps.modalClose).toHaveBeenCalled();
  });

  test('The OK button is displayed correctly', () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
    // Act
    // Assert
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('The OK button works correctly in add mode', async () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
    // Act
    await userEvent.type(screen.getByRole('textbox', { name: 'Title (100 or less)' }), 'testtitle');
    await userEvent.click(screen.getByRole('checkbox', { name: 'CPU' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(addProps.submit).toHaveBeenCalled();
  });

  test('The OK button works correctly in edit mode', async () => {
    // Arrange
    render(<PolicyEditModalSystemOperationPolicy {...editProps} />);
    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(editProps.submit).toHaveBeenCalled();
  });

  test('Validation: When the title is over 101 characters, an error is displayed', async () => {
    // Arrange
    /** Press the OK button. Error: 'Please enter between 1 to 100 characters' */
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
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
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
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
    render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
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

  test('Validation: check values, when trying to save wrong data , errors are displayed', async () => {
    // Arrange
    const errorPolicy: APIPolicy = {
      policyID: 'abc10dfaa2',
      category: 'systemOperationPolicy',
      title: 'Constraints on threshold values of resource usage rates calculated at the time of configuration design 2',
      policy: {
        useThreshold: {
          storage: {
            // > 100%, comparison error
            value: 100,
            unit: 'percent',
            comparison: 'gt',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    };
    const editProps2 = {
      ...editProps,
      selectedPolicyId: 'abc10dfaa2',
      data: {
        count: 1,
        policies: [errorPolicy],
      },
    } as const satisfies ComponentProps<typeof PolicyEditModalSystemOperationPolicy>;
    render(<PolicyEditModalSystemOperationPolicy {...editProps2} />);
    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Assert
    expect(screen.getAllByText('Specify a range from 0 to 100', { exact: false })).toHaveLength(2);
  });

  test('Validation: check values, onChange value', async () => {
    // Arrange
    const { container } = render(<PolicyEditModalSystemOperationPolicy {...addProps} />);
    // Act 0
    await userEvent.click(screen.getByRole('checkbox', { name: 'CPU' })); //on
    const cpuComparisonInput = container.querySelector<HTMLInputElement>('input[data-path="policies.cpu.comparison"]');
    const cpuValueInput = container.querySelector<HTMLInputElement>('input[data-path="policies.cpu.value"]');
    // Act 1
    await userEvent.click(cpuComparisonInput!); //open select options
    await userEvent.click(screen.getByRole('option', { name: '>' })); //wrong input, > (default:100)
    // Assert 1
    expect(screen.getByText('Specify a range from 0 to 100', { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText('Specify a range from 0 to 100', { exact: false })).toHaveLength(1);
    // Act 2
    await userEvent.clear(cpuValueInput!);
    await userEvent.type(cpuValueInput!, '90'); //correct input, > 90
    // Assert 2
    expect(screen.queryByText('Specify a range from 0 to 100', { exact: false })).not.toBeInTheDocument();
    // Act 3
    await userEvent.clear(cpuValueInput!);
    await userEvent.type(cpuValueInput!, '0'); //correct input, > 0
    await userEvent.click(cpuComparisonInput!); //open select options
    await userEvent.click(screen.getByRole('option', { name: '<' })); //wrong input, < 0
    // Assert 3
    expect(screen.getByText('Specify a range from 0 to 100', { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText('Specify a range from 0 to 100', { exact: false })).toHaveLength(1);
  });

  test('Validation: devices not selected are not validated', async () => {
    // Arrange
    /** Because the entered value is not initialized when deselected */
    const editProps2 = {
      ...editProps,
      selectedPolicyId: 'tmp_id_for_test',
      data: {
        count: 1,
        policies: [
          {
            policyID: 'tmp_id_for_test',
            category: 'systemOperationPolicy',
            title: 'title text',
            policy: {
              useThreshold: {
                cpu: {
                  value: 70,
                  unit: 'percent',
                  comparison: 'lt',
                },
                networkInterface: {
                  // error, > 100%
                  value: 100,
                  unit: 'percent',
                  comparison: 'gt',
                },
              },
            },
            enabled: true,
            createdAt: '2023-05-10T00:00:00Z',
            updatedAt: '2023-05-10T00:00:00Z',
          },
        ],
      },
    } as const satisfies ComponentProps<typeof PolicyEditModalSystemOperationPolicy>;
    render(<PolicyEditModalSystemOperationPolicy {...editProps2} />);
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
      selectedPolicyId: 'abc10dfaa9',
      data: dummyPolicy,
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      inputStatus: undefined,
      error: new AxiosError('An error occurred'),
    } as const satisfies ComponentProps<typeof PolicyEditModalSystemOperationPolicy>;
    render(<PolicyEditModalSystemOperationPolicy {...props} />);
    // Act
    // Assert
    expect(screen.getByText('An error occurred', { exact: false })).toBeInTheDocument();
  });

  test('Displays the error message from the API correctly', () => {
    // Arrange
    const props = {
      modalMode: 'edit',
      selectedPolicyId: 'abc10dfaa9',
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
    } as const satisfies ComponentProps<typeof PolicyEditModalSystemOperationPolicy>;
    render(<PolicyEditModalSystemOperationPolicy {...props} />);
    // Act
    // Assert
    expect(screen.getByText('E0000', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Error Message', { exact: false })).toBeInTheDocument();
  });
});
