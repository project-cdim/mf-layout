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

import { useForm } from '@mantine/form';
import { renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { APIDeviceTypeLowerCamel, APPPolicies, isAPIDeviceTypeLC } from '@/types';

import { PolicyInputSet } from '@/components';

import { deviceTypes } from '@/utils/define';
import { changeToAPPCase } from '@/utils/parse';
import { initialValues } from '@/utils/policy/initialValues';

type dataType = {
  label: string;
  value: string;
};
const checkOnChangeFunc = jest.fn();

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  Select: jest.fn(({ data, value, onChange }) => {
    const handleChange = (event: { currentTarget: { value: string } }) => {
      checkOnChangeFunc();
      onChange(event.currentTarget.value);
    };
    return (
      <select data-testid={`mock-select_${value}`} value={value} onChange={handleChange}>
        {data.map(({ label, value }: dataType) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }),
}));

describe('PolicyInputSet', () => {
  const editedValues = {
    nodeConfigurationPolicy: {
      title: '',
      category: 'nodeConfigurationPolicy',
      policies: {
        accelerator: { enabled: true, minNum: 1, maxNum: 1 },
        cpu: { enabled: true, minNum: 1, maxNum: 1 },
        dsp: { enabled: false, minNum: 1, maxNum: 1 },
        fpga: { enabled: false, minNum: 1, maxNum: 1 },
        gpu: { enabled: false, minNum: 1, maxNum: 1 },
        memory: { enabled: false, minNum: 1, maxNum: 1 },
        storage: { enabled: false, minNum: 1, maxNum: 1 },
        virtualMedia: { enabled: false, minNum: 1, maxNum: 1 },
        graphicController: { enabled: false, minNum: 1, maxNum: 1 },
        networkInterface: { enabled: false, minNum: 1, maxNum: 1 },
      },
      _checkboxes: true,
    },
    systemOperationPolicy: {
      title: '',
      category: 'systemOperationPolicy',
      policies: {
        accelerator: {
          enabled: true,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        cpu: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        dsp: {
          enabled: true,
          value: 80,
          unit: 'percent',
          comparison: 'lt',
        },
        fpga: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        gpu: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        memory: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        storage: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        virtualMedia: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        graphicController: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
        networkInterface: {
          enabled: false,
          value: 100,
          unit: 'percent',
          comparison: 'le',
        },
      },
      _checkboxes: true,
    },
  };
  const formAddNodeConfigurationPolicy = renderHook(() =>
    useForm<APPPolicies>({
      initialValues: initialValues.nodeConfigurationPolicy,
    })
  ).result.current;
  const formEditNodeConfigurationPolicy = renderHook(() =>
    useForm<APPPolicies>({ initialValues: editedValues.nodeConfigurationPolicy as APPPolicies })
  ).result.current;
  const formAddSystemOperationPolicy = renderHook(() =>
    useForm<APPPolicies>({
      initialValues: initialValues.systemOperationPolicy,
    })
  ).result.current;
  const formEditSystemOperationPolicy = renderHook(() =>
    useForm<APPPolicies>({ initialValues: editedValues.systemOperationPolicy as APPPolicies })
  ).result.current;

  const formEditErrorNodeConfigurationPolicy = renderHook(() =>
    useForm<APPPolicies>({
      initialValues: editedValues.nodeConfigurationPolicy as APPPolicies,
      initialErrors: { _checkboxes: 'CheckBoxes error' },
    })
  ).result.current;
  const formEditErrorSystemOperationPolicy = renderHook(() =>
    useForm<APPPolicies>({
      initialValues: editedValues.systemOperationPolicy as APPPolicies,
      initialErrors: { _checkboxes: 'CheckBoxes error' },
    })
  ).result.current;

  test('The title "Hardware Connection Restrictions" is displayed (when the category is Node Configuration Constraints)', () => {
    render(<PolicyInputSet form={formAddNodeConfigurationPolicy} />);
    expect(screen.getByText('Hardware Connections Limit')).toBeInTheDocument();
  });
  test('The title "Utilization Threshold" is displayed (when the category is System Operation Constraints)', () => {
    render(<PolicyInputSet form={formAddSystemOperationPolicy} />);
    expect(screen.getByText('Usage Threshold')).toBeInTheDocument();
  });
  // Refer to APIDeviceType. Supported devices are (cpu, memory, storage, gpu, fpga, accelerator, dsp, virtualMedia, graphicController, networkInterface)
  test('Node Configuration Constraints: Checkboxes and device types are correctly listed', () => {
    /** Ensure all device types are covered */

    render(<PolicyInputSet form={formAddNodeConfigurationPolicy} />);
    deviceTypes.forEach((deviceType) => {
      expect(screen.getByLabelText(changeToAPPCase(deviceType))).toBeInTheDocument();
      expect(screen.getByLabelText(changeToAPPCase(deviceType))).toHaveAttribute('type', 'checkbox');
    });
  });
  test('System Operation Constraints: Checkboxes and device types are correctly listed', () => {
    /** Ensure all device types are covered */

    render(<PolicyInputSet form={formAddSystemOperationPolicy} />);
    deviceTypes.forEach((deviceType) => {
      expect(screen.getByLabelText(changeToAPPCase(deviceType))).toBeInTheDocument();
      expect(screen.getByLabelText(changeToAPPCase(deviceType))).toHaveAttribute('type', 'checkbox');
    });
  });
  test('Node Configuration Constraints: The selection state of the displayed checkboxes changes according to the passed information', () => {
    /** Ensure checkboxes are checked for the selected device types */
    /** Ensure checkboxes are not checked for the unselected device types */
    render(<PolicyInputSet form={formEditNodeConfigurationPolicy} />);
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('accelerator'))).toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('cpu'))).toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('dsp'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('fpga'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('gpu'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('memory'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('storage'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('virtualMedia'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('graphicController'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('networkInterface'))).not.toBeChecked();
  });
  test('System Operation Constraints: The selection state of the displayed checkboxes changes according to the passed information', () => {
    /** Ensure checkboxes are checked for the selected device types */
    /** Ensure checkboxes are not checked for the unselected device types */
    render(<PolicyInputSet form={formEditSystemOperationPolicy} />);
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('accelerator'))).toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('cpu'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('dsp'))).toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('fpga'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('accelerator'))).toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('gpu'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('memory'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('storage'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('virtualMedia'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('graphicController'))).not.toBeChecked();
    expect(screen.getByLabelText<HTMLInputElement>(changeToAPPCase('networkInterface'))).not.toBeChecked();
  });
  test('Node Configuration Constraints: Input components are not displayed to the right of unchecked checkboxes', () => {
    render(<PolicyInputSet form={formAddNodeConfigurationPolicy} />);
    expect(screen.queryByRole('textbox')).toBeNull();
  });
  test('System Operation Constraints: Input components are not displayed to the right of unchecked checkboxes', () => {
    render(<PolicyInputSet form={formAddSystemOperationPolicy} />);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  test('Node Configuration Constraints: When checkboxes are selected, input components for the number of devices are displayed to the right', async () => {
    /** The numeric input textboxes for Hardware Connection Restrictions match twice the number of selected devices */
    render(<PolicyInputSet form={formEditNodeConfigurationPolicy} />);
    let deviceNumber = 0;
    const deviceList = new Set(deviceTypes);
    for (const key in editedValues.nodeConfigurationPolicy.policies) {
      if (isAPIDeviceTypeLC(key) && editedValues.nodeConfigurationPolicy.policies[key].enabled === true) {
        deviceNumber++;
        deviceList.delete(key);
      }
    }
    expect(screen.getAllByRole('textbox')).toHaveLength(deviceNumber * 2);
    // /** Click and select one from the remaining items */
    const deviceIter = deviceList.values();
    const targetDeviceType = deviceIter.next().value;
    const nextDevice = screen.getByLabelText<HTMLInputElement>(changeToAPPCase(targetDeviceType));

    await userEvent.click(nextDevice);

    expect(
      formEditNodeConfigurationPolicy.values.policies[targetDeviceType as APIDeviceTypeLowerCamel].enabled
    ).toBeFalsy();
  });

  test('System Operation Constraints: When checkboxes are selected, input components for the number of devices are displayed to the right', () => {
    /** The numeric input textboxes for Utilization Threshold match the number of selected devices */
    /** The combo boxes for Utilization Threshold (units and inequality) match twice the number of selected devices */
    render(<PolicyInputSet form={formEditSystemOperationPolicy} />);
    let deviceNumber = 0;
    for (const key in editedValues.systemOperationPolicy.policies) {
      if (isAPIDeviceTypeLC(key) && editedValues.systemOperationPolicy.policies[key].enabled === true) {
        deviceNumber++;
      }
    }
    expect(screen.getAllByRole('textbox')).toHaveLength(deviceNumber);
    expect(screen.getAllByRole('combobox')).toHaveLength(deviceNumber * 2);
  });
  test('Node Configuration Constraints: Able to change input values (minimum value, maximum value)', async () => {
    /** Ensure the form's value changes when the value is modified */
    render(<PolicyInputSet form={formEditNodeConfigurationPolicy} />);

    const inputMin = screen.getAllByRole('textbox')[0];
    await userEvent.clear(inputMin);
    await userEvent.type(inputMin, '333');
    expect(inputMin).toHaveAttribute('value', '333');

    const inputMax = screen.getAllByRole('textbox')[1];
    await userEvent.clear(inputMax);
    await userEvent.type(inputMax, '999');
    expect(inputMax).toHaveAttribute('value', '999');
  });

  test('System Operation Constraints: Able to change input values, inequality', async () => {
    /** Ensure the element's value changes and onChange is called when the value is modified */
    render(<PolicyInputSet form={formEditSystemOperationPolicy} />);
    const inputValue = screen.getAllByRole('textbox')[0];
    await userEvent.clear(inputValue);
    await userEvent.type(inputValue, '80');
    expect(inputValue).toHaveAttribute('value', '80');

    const mockselect = screen.getAllByTestId('mock-select_le')[0];
    await userEvent.selectOptions(mockselect, 'gt');
    expect(checkOnChangeFunc).toHaveBeenCalled();
  });

  test('Error messages are displayed when there are errors (Node Configuration Constraints)', () => {
    render(<PolicyInputSet form={formEditErrorNodeConfigurationPolicy} />);
    expect(screen.getByText('CheckBoxes error')).toBeInTheDocument();
  });

  test('Error messages are displayed when there are errors (System Operation Constraints)', () => {
    render(<PolicyInputSet form={formEditErrorSystemOperationPolicy} />);
    expect(screen.getByText('CheckBoxes error')).toBeInTheDocument();
  });
});
