import type { Meta, StoryObj } from '@storybook/react';
import { APIPolicyError, APPPolicies } from '@/types';
import { PolicyEditModal } from '@/components';
import { Card } from '@mantine/core';
import { AxiosError } from 'axios';

const meta = {
  title: 'Components/PolicyEditModal',
  component: PolicyEditModal,
  parameters: {
    PolicyEditModal: 'centered',
  },
  args: {
    modalClose: () => alert('modalClose'),
    submit: () => alert('submit'),
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card withBorder>
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof PolicyEditModal>;

export default meta;
type Story = StoryObj<typeof PolicyEditModal>;

/** Add Dialog */
export const Add: Story = {
  args: {
    modalMode: 'add',
    // modalClose: () => {},
    // submit: () => {},
    inputStatus: undefined,
    error: undefined,
    data: undefined,
  },
};

const nodeConfigurationPolicy: APPPolicies = {
  title: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
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
};

const systemOperationPolicy: APPPolicies = {
  title: 'DUMMY TITLE of systemOperationPolicy',
  category: 'systemOperationPolicy',
  policies: {
    cpu: {
      enabled: true,
      value: 10,
      unit: 'percent',
      comparison: 'gt',
    },
    memory: {
      enabled: true,
      value: 20,
      unit: 'percent',
      comparison: 'lt',
    },
    storage: {
      enabled: true,
      value: 30,
      unit: 'percent',
      comparison: 'ge',
    },
    gpu: {
      enabled: true,
      value: 99,
      unit: 'percent',
      comparison: 'le',
    },
    fpga: {
      enabled: false,
      value: 100,
      unit: 'percent',
      comparison: 'le',
    },
    accelerator: {
      enabled: false,
      value: 100,
      unit: 'percent',
      comparison: 'le',
    },
    dsp: {
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
};

{
  true;
  10;
  ('percent');
  // comparison: 'gt' | 'lt' | 'ge' | 'le';
  ('gt');
}

// {
//       title: string;
//       category: 'systemOperationPolicy';
//       policies: {
//         [key in APIDeviceTypeLowerCamel]: APPUseThreshold;
//       };
//       /** Whether at least one checkbox is checked */
//       _checkboxes?: boolean;
//     };

/** Edit Dialog. Title 101 characters */
export const EditNodeConfigurationPolicy: Story = {
  args: {
    modalMode: 'edit',
    inputStatus: nodeConfigurationPolicy,
  },
};

export const EditSystemOperationPolicy: Story = {
  args: {
    modalMode: 'edit',
    // inputStatus: dummyPolicy.policies.find((policy) => policy.category === 'systemOperationPolicy'),
    inputStatus: systemOperationPolicy,
  },
};

export const Error: Story = {
  args: {
    modalMode: 'add',
    error: new AxiosError<APIPolicyError>('error message', 'error code'),
  },
};
