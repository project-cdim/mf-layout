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
import { NextIntlClientProvider, useMessages } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';

import { render } from '@/shared-modules/__test__/test-utils';
import commonMessages from '@/shared-modules/public/locales/en/common.json';
import mfLayoutMessages from '@/shared-modules/public/locales/en/mf-layout.json';
import { usePermission } from '@/shared-modules/utils/hooks';

import { APIPolicy } from '@/types';

import { PolicyCard, PolicyCards } from '@/components';

import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';
import { dateParse } from '@/utils/parse';

const locale = 'en';

/** Function passed to PolicyCard */
const functions = {
  deletePolicy: jest.fn(),
  enablePolicy: jest.fn(),
  disablePolicy: jest.fn(),
  editPolicy: jest.fn(),
};

jest.unmock('next-intl');

jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useMessages: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
}));

jest.mock('@tabler/icons-react', () => ({
  ...jest.requireActual('@tabler/icons-react'),
  IconCheck: () => <div data-testid='mockIconForOK_Available'></div>,
  IconBan: () => <div data-testid='mockIconForDisabled_Unavailable'></div>,
}));

describe('PolicyCard', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();

    (usePermission as unknown as jest.Mock).mockImplementation(() => true);

    (useMessages as unknown as jest.Mock).mockImplementation(() => {
      return { ...commonMessages, ...mfLayoutMessages } as AbstractIntlMessages;
    });
  });
  test('The specified ID is displayed', () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={dummyPolicy.policies[0]} loading={true} key={`node_1`} functions={functions} />{' '}
      </NextIntlClientProvider>
    );
    expect(screen.getByText(dummyPolicy.policies[0].policyID)).toBeInTheDocument();
  });

  test('The specified title is displayed', () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={dummyPolicy.policies[0]} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(dummyPolicy.policies[0].title)).toBeInTheDocument();
  });

  test('The specified "Hardware Connections Limit" is displayed', () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={dummyPolicy.policies[0]} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Hardware Connections Limit')).toBeInTheDocument();
  });
  test('The specified "Usage Threshold" is displayed', () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={dummyPolicy.policies[2]} loading={true} key={`system_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('Usage Threshold');
  });

  test('The specified node configuration constraints are displayed', () => {
    const makeHardwareConnectionsLimitValue = (minNum: number, maxNum: number) => `${minNum} - ${maxNum}`;
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'nodeConfigurationPolicy',
      title: 'Dummy Policy',
      policy: {
        hardwareConnectionsLimit: {
          cpu: {
            maxNum: 5,
            minNum: 1,
          },
          networkInterface: {
            maxNum: 8,
            minNum: 3,
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    };
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent(
      makeHardwareConnectionsLimitValue(
        tmpPolicy.policy.hardwareConnectionsLimit.cpu?.minNum || 0,
        tmpPolicy.policy.hardwareConnectionsLimit.cpu?.maxNum || 0
      )
    );
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(
      makeHardwareConnectionsLimitValue(
        tmpPolicy.policy.hardwareConnectionsLimit.networkInterface?.minNum || 0,
        tmpPolicy.policy.hardwareConnectionsLimit.networkInterface?.maxNum || 0
      )
    );
  });
  test('The specified system operation policy is displayed', () => {
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
          dsp: {
            value: 50,
            unit: 'percent',
            comparison: 'gt',
          },
          virtualMedia: {
            value: 100,
            unit: 'percent',
            comparison: 'le',
          },
          storage: {
            value: 0,
            unit: 'percent',
            comparison: 'ge',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    };

    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('GPU: Under 90%');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('DSP: Over 50%');
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('VirtualMedia: 100% or less');
    expect(screen.getAllByRole('listitem')[3]).toHaveTextContent('Storage: 0% or more');
  });
  test('The specified registration date and time are displayed', () => {
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Created' }).nextSibling?.nextSibling).toHaveTextContent(
      dateParse(tmpPolicy.createdAt, locale)
    );
  });
  test('The update date is displayed', () => {
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Updated' }).nextSibling?.nextSibling).toHaveTextContent(
      dateParse(tmpPolicy.updatedAt, locale)
    );
  });
  test('The enabled state is displayed correctly', () => {
    /** Check that the active label and edit/delete buttons are not clickable */
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByTestId('mockIconForOK_Available')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument();
    expect(screen.getByTitle('Edit')).toBeDisabled();
    expect(screen.getByTitle('Delete')).toBeDisabled();
  });
  test('The disabled state is displayed correctly', () => {
    /** Check for the disabled label. Edit and delete buttons will be checked in subsequent tests */
    /** Check that the active label and edit/delete buttons are not clickable */
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    expect(screen.getByTestId('mockIconForDisabled_Unavailable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument();
    expect(screen.getByTitle('Edit')).toBeEnabled();
    expect(screen.getByTitle('Delete')).toBeEnabled();
  });
  test('The enable button works correctly', async () => {
    /** Execute the callback function passed via props */
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    const button = screen.getByRole('button', { name: 'Enable' });
    await user.click(button);
    expect(functions.enablePolicy).toHaveBeenCalled();
  });
  test('The disable button works correctly', async () => {
    /** Execute the callback function passed via props */
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    const button = screen.getByRole('button', { name: 'Disable' });
    await user.click(button);
    expect(functions.disablePolicy).toHaveBeenCalled();
  });
  test('The edit button works correctly', async () => {
    /** Execute the callback function passed via props */
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    const button = screen.getByTitle('Edit');
    await user.click(button);
    expect(functions.editPolicy).toHaveBeenCalled();
  });
  test('The delete button works correctly', async () => {
    /** Execute the callback function passed via props */
    const tmpPolicy: APIPolicy = {
      policyID: 'policyID0000000',
      category: 'systemOperationPolicy',
      title: 'Dummy Policy',
      policy: {
        useThreshold: {
          gpu: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-06-10T00:00:00Z',
    };
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyCard policy={tmpPolicy} loading={true} key={`node_1`} functions={functions} />
      </NextIntlClientProvider>
    );
    const button = screen.getByTitle('Delete');
    await user.click(button);
    expect(functions.deletePolicy).toHaveBeenCalled();
  });
});

describe('PolicyCards', () => {
  test('Displays child elements correctly', () => {
    const DummyTextComponent = () => <p>child element</p>;
    render(
      <PolicyCards>
        <DummyTextComponent />
      </PolicyCards>
    );
    expect(screen.getByText('child element')).toBeInTheDocument();
  });
});
