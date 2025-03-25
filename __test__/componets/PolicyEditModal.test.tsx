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

import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { APIPolicies, ModalMode } from '@/types';

import { PolicyEditModal, PolicyInputSet } from '@/components';

import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';

const dummyPolicy2: APIPolicies = {
  count: 5,
  policies: [
    {
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
    },
    {
      policyID: 'abc10dfaa9',
      category: 'systemOperationPolicy',
      title: 'Constraints on the threshold of resource utilization calculated during configuration design',
      policy: {
        useThreshold: {
          storage: {
            // Less than 0 error
            value: 0,
            unit: 'percent',
            comparison: 'lt',
          },
          memory: {
            // Over 100 error
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
};

type dataType = {
  label: string;
  value: string;
};

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  Select: jest.fn(({ data, value, onChange }) => {
    const handleChange = (event: any) => {
      onChange(event.currentTarget.value);
    };
    return (
      <select data-testid='mock-select' value={value} onChange={handleChange}>
        {data.map(({ label, value }: dataType) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }),
}));

jest.mock('@/components/PolicyInputSet');
const mockPolicyInputSet = jest.fn().mockReturnValue(null);

describe('PolicyEditModal', () => {
  type PropsType = {
    modalMode: ModalMode;
    selectedPolicyId?: string;
    policyTitle?: string;
    modalClose: () => void;
    submit: CallableFunction;
    inputStatus: undefined;

    error: any | undefined;
    data?: APIPolicies;
  };
  const addProps: PropsType = {
    modalMode: 'add',
    modalClose: jest.fn(),
    submit: jest.fn(),
    inputStatus: undefined,
    error: undefined,
  };
  const editProps: PropsType = {
    modalMode: 'edit',
    selectedPolicyId: 'd8eceb14d1',
    modalClose: jest.fn(),
    submit: jest.fn(),
    inputStatus: undefined,
    error: undefined,
    data: dummyPolicy,
  };
  beforeEach(() => {
    // Execute before each test
    (PolicyInputSet as unknown as jest.Mock).mockReset();
    (PolicyInputSet as unknown as jest.Mock).mockImplementation(mockPolicyInputSet);
  });
  test('Displayed correctly in add mode', () => {
    /** Category: Node configuration constraints are selected = input hidden: nodeConfigurationPolicy */
    render(<PolicyEditModal {...addProps} />);
    expect(screen.getByRole('combobox').childNodes[0]).toHaveAttribute('value', 'nodeConfigurationPolicy');
  });

  test('Displayed correctly in edit mode', () => {
    /** The target title and category are set correctly */
    render(<PolicyEditModal {...editProps} />);
    expect(screen.getByPlaceholderText('Title')).toHaveAttribute('value', dummyPolicy.policies[1].title);
    expect(screen.getByRole('combobox').childNodes[0]).toHaveAttribute('value', 'nodeConfigurationPolicy');
  });

  test('The title does not change when the category is changed in add mode', async () => {
    render(<PolicyEditModal {...addProps} />);

    // Change the category to "System Operation Constraints"
    // Title input
    const titleInput = screen.getByPlaceholderText('Title');
    const mockselect = screen.getByTestId('mock-select');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'titletest');
    await userEvent.selectOptions(mockselect, 'systemOperationPolicy');
    expect(screen.getByPlaceholderText('Title')).toHaveAttribute('value', 'titletest');
    expect(screen.getByRole<HTMLOptionElement>('option', { name: 'System Operation Policy' }).selected).toBe(true);

    // Change the category to "Node Configuration Constraints"
    await userEvent.selectOptions(mockselect, 'nodeConfigurationPolicy');
    expect(screen.getByPlaceholderText('Title')).toHaveAttribute('value', 'titletest');
    expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Node Layout Policy' }).selected).toBe(true);
  });

  test('The cancel button is displayed correctly', () => {
    render(<PolicyEditModal {...addProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('The cancel button works correctly', async () => {
    render(<PolicyEditModal {...addProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(addProps.modalClose).toHaveBeenCalled();
  });

  test('The OK button is displayed correctly', () => {
    render(<PolicyEditModal {...addProps} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('The OK button works correctly in add mode', async () => {
    render(<PolicyEditModal {...addProps} />);
    const props = mockPolicyInputSet.mock.lastCall[0];
    act(() => {
      // Set the check flag
      props.form.setFieldValue('_checkboxes', true);
    });
    const titleInput = screen.getByPlaceholderText('Title');
    await userEvent.type(titleInput, 'titletest');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(addProps.submit).toHaveBeenCalled();
  });
  test('The OK button works correctly in edit mode', async () => {
    render(<PolicyEditModal {...editProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(editProps.submit).toHaveBeenCalled();
  });

  test('Validation: When the title is over 101 characters, an error is displayed', async () => {
    /** Press the OK button. Error: 'Please enter between 1 to 100 characters' */
    render(<PolicyEditModal {...addProps} />);
    const titleInput = screen.getByPlaceholderText('Title');
    // Input 100 characters
    await userEvent.clear(titleInput);
    await userEvent.type(
      titleInput,
      '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
    );
    expect(screen.queryByText('Enter between 1 and 100 characters', { exact: false })).not.toBeInTheDocument();
    // Input 101 characters
    await userEvent.clear(titleInput);
    await userEvent.type(
      titleInput,
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'
    );
    expect(screen.getByText('Enter between 1 and 100 characters', { exact: false })).toBeInTheDocument();
  });

  test('Validation: When there is no input for the title, an error is displayed', async () => {
    /** Press the OK button. Error: 'Please enter between 1 to 100 characters' */
    render(<PolicyEditModal {...addProps} />);
    const titleInput = screen.getByPlaceholderText('Title');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Enter between 1 and 100 characters', { exact: false })).toBeInTheDocument();
    await userEvent.type(titleInput, '111');
    expect(screen.queryByText('Enter between 1 and 100 characters', { exact: false })).not.toBeInTheDocument();
    await userEvent.clear(titleInput);
    expect(screen.getByText('Enter between 1 and 100 characters', { exact: false })).toBeInTheDocument();
  });

  test('Validation: When there is no selection for the device (checkbox), an error is displayed', async () => {
    /** Mock the InputSet and set the data within it, press the OK button or uncheck. Error: 'Please check at least one' */
    render(<PolicyEditModal {...addProps} />);
    const titleInput = screen.getByPlaceholderText('Title');
    await userEvent.type(titleInput, 'testtitle');
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['_checkboxes']).not.toBe('Check at least one');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['_checkboxes']).toBe('Check at least one');
  });

  test('Validation: Node Configuration Constraints, check minimum value, when minimum value > maximum value, an error is displayed', async () => {
    /** Mock the InputSet and set the data within it, Error: 'Please specify a minimum value' */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'd8eceb14da',
      data: dummyPolicy2,
    };
    render(<PolicyEditModal {...editProps2} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.cpu.minNum']).toBe('Specify a minimum value');
  });

  test('Validation: Node Configuration Constraints, check maximum value, when maximum value < minimum value, an error is displayed', async () => {
    /** Mock the InputSet and set the data within it, Error: 'Please specify a maximum value' */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'd8eceb14da',
      data: dummyPolicy2,
    };
    render(<PolicyEditModal {...editProps2} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.cpu.maxNum']).toBe('Specify a maximum value');
  });

  test('Validation: System Operation Constraints, check value, when less than 0, an error is displayed', async () => {
    /** Mock the InputSet and set the data within it, Error: 'Please specify a range between 0 and 100' */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'abc10dfaa9',
      data: dummyPolicy2,
    };
    render(<PolicyEditModal {...editProps2} />);
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.storage.value']).not.toBe(
      'Specify a range from 0 to 100'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.storage.value']).toBe(
      'Specify a range from 0 to 100'
    );
  });

  test('Validation: System Operation Constraints, check value, when over 100, an error is displayed', async () => {
    /** Mock the InputSet and set the data within it, Error: 'Please specify a range between 0 and 100' */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'abc10dfaa9',
      data: dummyPolicy2,
    };
    render(<PolicyEditModal {...editProps2} />);
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.memory.value']).not.toBe(
      'Specify a range from 0 to 100'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.memory.value']).toBe(
      'Specify a range from 0 to 100'
    );
  });

  test('Validation: System Operation Constraints, check inequality, when less than 0, an error is displayed', async () => {
    /** Mock the InputSet and change the inequality within it, Error: 'Please specify a range between 0 and 100' */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'abc10dfaa9',
      data: dummyPolicy2,
    };
    render(<PolicyEditModal {...editProps2} />);
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.storage.value']).not.toBe(
      'Specify a range from 0 to 100'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.storage.value']).toBe(
      'Specify a range from 0 to 100'
    );
  });

  test('Validation: System Operation Constraints, check inequality, when over 100, an error is displayed', async () => {
    /** Mock the InputSet and change the inequality within it, Error: 'Please specify a range between 0 and 100' */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'abc10dfaa9',
      data: dummyPolicy2,
    };
    render(<PolicyEditModal {...editProps2} />);
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.memory.value']).not.toBe(
      'Specify a range from 0 to 100'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockPolicyInputSet.mock.lastCall[0].form.errors['policies.memory.value']).toBe(
      'Specify a range from 0 to 100'
    );
  });

  test('Validation: Node Configuration Constraints, devices not selected are not validated', async () => {
    /** Because the entered value is not initialized when deselected */
    const editProps2: PropsType = {
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
    };
    render(<PolicyEditModal {...editProps2} />);
    const props = mockPolicyInputSet.mock.lastCall[0];
    act(() => {
      // Set the no-check flag
      props.form.setFieldValue('policies.networkInterface.enabled', false);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(editProps.submit).toHaveBeenCalled();
  });

  test('Validation: System Operation Constraints, devices not selected are not validated', async () => {
    /** Because the entered value is not initialized when deselected */
    const editProps2: PropsType = {
      ...editProps,
      selectedPolicyId: 'abc10dfaa9',
      data: {
        count: 1,
        policies: [
          {
            policyID: 'abc10dfaa9',
            category: 'systemOperationPolicy',
            title: 'Constraints on the threshold of resource utilization calculated during configuration design',
            policy: {
              useThreshold: {
                storage: {
                  value: 0,
                  unit: 'percent',
                  comparison: 'gt',
                },
                memory: {
                  // Over 100 error
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
    };
    render(<PolicyEditModal {...editProps2} />);
    const props = mockPolicyInputSet.mock.lastCall[0];
    act(() => {
      // Set the no-check flag
      props.form.setFieldValue('policies.memory.enabled', false);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(editProps.submit).toHaveBeenCalled();
  });

  test('Displays the error message correctly (when there is no error.response)', () => {
    const props: PropsType = {
      modalMode: 'edit',
      selectedPolicyId: 'd8eceb14da',
      data: dummyPolicy,
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      inputStatus: undefined,
      error: {
        message: 'An error occurred',
      },
    };
    render(<PolicyEditModal {...props} />);
    expect(screen.getByText('An error occurred', { exact: false })).toBeInTheDocument();
  });

  test('Displays the error message from the API correctly', () => {
    const props: PropsType = {
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
      },
    };
    render(<PolicyEditModal {...props} />);
    expect(screen.getByText('E0000', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Error Message', { exact: false })).toBeInTheDocument();
  });
});
