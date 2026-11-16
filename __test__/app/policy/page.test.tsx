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
import axios from 'axios';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
// import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageHeader } from '@/shared-modules/components';
import commonMessages from '@/shared-modules/public/locales/en/common.json';
import mfLayoutMessages from '@/shared-modules/public/locales/en/mf-layout.json';
import { usePermission } from '@/shared-modules/utils/hooks';

import { PolicyConfirmModal, PolicyEditModal } from '@/components';

import Policy from '@/app/[lng]/policy/page';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
}));

jest.unmock('next-intl');
jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useMessages: jest.fn(),
}));

jest.mock('@luigi-project/client', () => null);
jest.mock('next/link');
// jest.mock('swr');
jest.mock('axios');

jest.mock('swr/immutable', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/PolicyConfirmModal');
const mockPolicyConfirmModal = jest.fn().mockReturnValue(null);
jest.mock('@/components/PolicyEditModal');
const mockPolicyEditModal = jest.fn().mockReturnValue(null);
jest.mock('@/shared-modules/components/PageLink');

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  usePermission: jest.fn(),
}));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  LoadingOverlay: jest.fn(),
}));

jest.setTimeout(60 * 1000);
describe('Policy', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    (useSWRImmutable as unknown as jest.Mock).mockReset();
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: dummyPolicy,
      error: null,
      mutate: jest.fn(),
    }));

    mockPolicyConfirmModal.mockReset();
    mockPolicyEditModal.mockReset();
    (PolicyConfirmModal as unknown as jest.Mock).mockReset();
    (PolicyConfirmModal as unknown as jest.Mock).mockImplementation(mockPolicyConfirmModal);
    (PolicyEditModal as unknown as jest.Mock).mockReset();
    (PolicyEditModal as unknown as jest.Mock).mockImplementation(mockPolicyEditModal);

    (axios.post as unknown as jest.Mock).mockReset();
    (axios.post as unknown as jest.Mock).mockResolvedValue({ data: { policyID: 'aaeceb14ss' } });
    (axios.put as unknown as jest.Mock).mockReset();
    (axios.put as unknown as jest.Mock).mockResolvedValue({});
    (axios.delete as unknown as jest.Mock).mockReset();
    (axios.delete as unknown as jest.Mock).mockResolvedValue({});

    (usePermission as unknown as jest.Mock).mockImplementation(() => true);

    (useMessages as unknown as jest.Mock).mockImplementation(() => {
      return { ...commonMessages, ...mfLayoutMessages } as AbstractIntlMessages;
    });
  });

  test('The title "Constraint Conditions" is displayed', () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    const givenProps = (PageHeader as unknown as jest.Mock).mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Policies');
    expect(givenProps.items).toEqual([{ title: 'Layout Management' }, { title: 'Policies' }]);
  });
  test('Loading is displayed', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: dummyPolicy,
      isValidating: true,
      mutate: jest.fn(),
    }));
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    expect((LoadingOverlay as unknown as jest.Mock).mock.lastCall[0].visible).toBe(true);
  });
  test('Loading is not displayed', async () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    const LoadingOverlayElements = screen.queryByRole('presentation');
    await waitFor(() => {
      expect(LoadingOverlayElements).not.toBeInTheDocument();
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
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('An error occurred');
    expect(message).toHaveTextContent('Error Message');
  });
  test('When unable to connect to the server, a message is displayed', async () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      error: {
        message: 'An error occurred',
        response: null,
      },
      mutate: jest.fn(),
    }));
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('An error occurred');
    expect(message).toBeNull();
  });
  test('When the add (Node Layout Policy) button is clicked, the modal for adding is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the add button
    const button = screen.getByTitle('Node Layout Policy Add');
    if (button) {
      await userEvent.click(button);
    }
    await waitFor(() => {
      // Verify that mockPolicyConfirmModal is called
      expect(mockPolicyEditModal).toHaveBeenCalled();
    });
  });
  test('When the add (System Operation Policy) button is clicked, the modal for adding is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the add button
    const button = screen.getByTitle('System Operation Policy Add');
    if (button) {
      await userEvent.click(button);
    }
    await waitFor(() => {
      // Verify that mockPolicyConfirmModal is called
      expect(mockPolicyEditModal).toHaveBeenCalled();
    });
  });
  test('When the activate button is clicked, the modal for activation is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the activate button
    const button = screen.getAllByRole('button', { name: 'Enable' })[0];
    if (button) {
      await userEvent.click(button);
    }
    // Verify that mockPolicyConfirmModal is called
    await waitFor(() => {
      expect(mockPolicyConfirmModal).toHaveBeenCalled();
    });
  });
  test('When the disable button is clicked, the modal for disabling is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the deactivate
    const button = screen.getAllByRole('button', { name: 'Disable' })[0];
    if (button) {
      await userEvent.click(button);
    }
    await waitFor(() => {
      // Verify that mockPolicyConfirmModal is called
      expect(mockPolicyConfirmModal).toHaveBeenCalled();
    });
  });
  test('When the delete button is clicked, the modal for deletion is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // lick the valid delete button
    const button = screen.getAllByTitle('Delete').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    // Verify that mockPolicyConfirmModal is called
    await waitFor(() => {
      expect(mockPolicyConfirmModal).toHaveBeenCalled();
    });
  });
  test('Clicking the edit button displays the modal for editing.', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the edit button
    const button = screen.getAllByTitle('Edit').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    await waitFor(() => {
      // Verify that mockPolicyConfirmModal is called
      expect(mockPolicyEditModal).toHaveBeenCalled();
    });
  });

  test('The submit for activation is called, and a message that it has been activated is displayed', async () => {
    (axios.put as unknown as jest.Mock).mockResolvedValue({
      data: { enableIDList: ['d8eceb14da'], disableIDList: [] },
    });

    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the valid activate button
    const button = screen.getAllByRole('button', { name: 'Enable' })[0];
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'd8eceb14da';
    const enable = true;

    await waitFor(() => {
      const submitFunc = mockPolicyConfirmModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policyID, enable);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully enable');
    expect(message).toHaveTextContent(`ID : ${policyID}`);
    const expectTitle = dummyPolicy.policies.find((policy) => policy.policyID === policyID)?.title;
    expect(message).toHaveTextContent(`Title : ${expectTitle}`);
    // Verify that the message close button works
    const closeButton = title.parentNode?.parentNode?.parentNode?.querySelector('button');
    await waitFor(async () => {
      if (closeButton) {
        await userEvent.click(closeButton);
      }
      const alertDialog2 = screen.queryByRole('alert');
      const title2 = alertDialog2?.querySelector('span') as HTMLSpanElement;
      expect(title2).toBeUndefined();
    });
  });
  test('When the submit for activation is called and the server returns an error, a message is displayed', async () => {
    /** Message display is on the modal side */
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    (axios.put as unknown as jest.Mock).mockRejectedValue({
      message: 'error title',
      response: {
        status: 404,
        data: { message: 'error response message', code: 'E1111' },
      },
    });
    // Click the valid activate button
    const button = screen.getAllByRole('button', { name: 'Enable' })[0]; // screen.debug(button);
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'd8eceb14da';
    const enable = true;

    await waitFor(() => {
      const submitFunc = mockPolicyConfirmModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policyID, enable);
      });
    });

    await waitFor(() => {
      // Verify the failure message
      // Verify that the error information is passed to the error property since the message display is on the modal side
      expect(mockPolicyConfirmModal.mock.lastCall[0].error).toBeDefined();
    });
  });
  test('The submit for deactivation is called, and a message that it has been deactivated is displayed', async () => {
    (axios.put as unknown as jest.Mock).mockResolvedValue({
      data: { enableIDList: [], disableIDList: ['d8eceb14da'] },
    });

    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the valid disable button
    const button = screen.getAllByRole('button', { name: 'Disable' })[0];
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'd8eceb14da';
    const enable = false;

    await waitFor(() => {
      const submitFunc = mockPolicyConfirmModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policyID, enable);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully disable');
    expect(message).toHaveTextContent(`ID : ${policyID}`);
    const expectTitle = dummyPolicy.policies.find((policy) => policy.policyID === policyID)?.title;
    expect(message).toHaveTextContent(`Title : ${expectTitle}`);
    // Verify that the message close button works
    const closeButton = title.parentNode?.parentNode?.parentNode?.querySelector('button');
    await waitFor(async () => {
      if (closeButton) {
        await userEvent.click(closeButton);
      }
      const alertDialog2 = screen.queryByRole('alert');
      const title2 = alertDialog2?.querySelector('span') as HTMLSpanElement;
      expect(title2).toBeUndefined();
    });
  });
  test('When the submit for deactivation is called and the server returns an error, a message is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    (axios.put as unknown as jest.Mock).mockRejectedValue({
      message: 'error title',
      response: {
        status: 404,
        data: { message: 'error response message', code: 'E1111' },
      },
    });
    // Click the valid disable button
    const button = screen.getAllByRole('button', { name: 'Disable' })[0]; // screen.debug(button);
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'd8eceb14da';
    const enable = false;

    await waitFor(() => {
      const submitFunc = mockPolicyConfirmModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policyID, enable);
      });
    });

    await waitFor(() => {
      // Verify the failure message
      // Verify that the error information is passed to the error property since the message display is on the modal side
      expect(mockPolicyConfirmModal.mock.lastCall[0].error).toBeDefined();
    });
  });
  test('The submit for deletion is called, and a message that it has been deleted is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the valid delete button
    const button = screen.getAllByTitle('Delete').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'd8eceb14da';

    await waitFor(() => {
      const submitFunc = mockPolicyConfirmModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policyID);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully delete');
    expect(message).toHaveTextContent(`ID : ${policyID}`);
    const expectTitle = dummyPolicy.policies.find((policy) => policy.policyID === policyID)?.title;
    expect(message).toHaveTextContent(`Title : ${expectTitle}`);
    // Verify that the message close button works
    const closeButton = title.parentNode?.parentNode?.parentNode?.querySelector('button');
    await waitFor(async () => {
      if (closeButton) {
        await userEvent.click(closeButton);
      }
      const alertDialog2 = screen.queryByRole('alert');
      const title2 = alertDialog2?.querySelector('span') as HTMLSpanElement;
      expect(title2).toBeUndefined();
    });
  });
  test('When the submit for deletion is called and the server returns an error, a message is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    (axios.delete as unknown as jest.Mock).mockRejectedValue({
      message: 'error title',
      response: {
        status: 404,
        data: { message: 'error response message', code: 'E1111' },
      },
    });
    // Click the valid delete button
    const button = screen.getAllByTitle('Delete').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    await waitFor(() => {
      const submitFunc = mockPolicyConfirmModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc();
      });
    });

    await waitFor(() => {
      // Verify the failure message
      // Verify that the error information is passed to the error property since the message display is on the modal side
      expect(mockPolicyConfirmModal.mock.lastCall[0].error).toBeDefined();
    });
  });
  test('The submit for addition (Node Layout Policy) is called, and a message that it has been added is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the add button
    const button = screen.getByTitle('Node Layout Policy Add');
    if (button) {
      await userEvent.click(button);
    }
    const policies = {
      title: 'dummytitle',
      category: 'nodeConfigurationPolicy',
      policies: {
        cpu: {
          enabled: true,
          maxNum: 10,
          minNum: 1,
        },
      },
      /** Whether at least one checkbox is checked */
      _checkboxes: true,
    };
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'aaeceb14ss';

    await waitFor(() => {
      const submitFunc = mockPolicyEditModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policies);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully add');
    expect(message).toHaveTextContent(`ID : ${policyID}`);
    expect(message).toHaveTextContent(`Title : ${policies.title}`);
  });

  test('The submit for addition (System Oparation Policy) is called, and a message that it has been added is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the add button
    const button = screen.getByTitle('System Operation Policy Add');
    if (button) {
      await userEvent.click(button);
    }
    const policies = {
      title: 'dummytitle',
      category: 'systemOperationPolicy',
      policies: {
        cpu: {
          enabled: false,
          value: 80,
          unit: 'percent',
          comparison: 'le',
        },
      },
      /** Whether at least one checkbox is checked */
      _checkboxes: true,
    };
    // Call the submit passed to mockPolicyConfirmModal
    const policyID = 'aaeceb14ss';

    await waitFor(() => {
      const submitFunc = mockPolicyEditModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policies);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully add');
    expect(message).toHaveTextContent(`ID : ${policyID}`);
    expect(message).toHaveTextContent(`Title : ${policies.title}`);
  });
  test('When the submit for addition is called and the server returns an error, a message is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    (axios.post as unknown as jest.Mock).mockRejectedValue({
      message: 'error title',
      response: {
        status: 404,
        data: { message: 'error response message', code: 'E1111' },
      },
    });
    const policies = {
      title: 'dummytitle',
      category: 'nodeConfigurationPolicy',
      policies: {
        cpu: {
          enabled: true,
          maxNum: 10,
          minNum: 1,
        },
      },
      /** Whether at least one checkbox is checked */
      _checkboxes: true,
    };
    // Click the valid add button
    const button = screen.getByTitle('Node Layout Policy Add');
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    await waitFor(() => {
      const submitFunc = mockPolicyEditModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policies);
      });
    });

    await waitFor(() => {
      // Verify the failure message
      // Verify that the error information is passed to the error property since the message display is on the modal side
      expect(mockPolicyEditModal.mock.lastCall[0].error).toBeDefined();
    });
  });

  test('The submit for edit is called, and a message that it has been edited is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the edit button
    const button = screen.getAllByTitle('Edit').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    const policies = {
      policyID: 'aaeceb14ss',
      title: 'dummytitle',
      category: 'nodeConfigurationPolicy',
      policies: {
        cpu: {
          enabled: true,
          maxNum: 10,
          minNum: 1,
        },
      },
      /** Whether at least one checkbox is checked */
      _checkboxes: true,
    };
    // Call the submit passed to mockPolicyConfirmModal
    await waitFor(() => {
      const submitFunc = mockPolicyEditModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policies.policyID, policies);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully update');
    expect(message).toHaveTextContent(`ID : ${policies.policyID}`);
    expect(message).toHaveTextContent(`Title : ${policies.title}`);
  });
  test('When the submit for edit is called and the server returns an error, a message is displayed', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );

    (axios.put as unknown as jest.Mock).mockRejectedValue({
      message: 'error title',
      response: {
        status: 404,
        data: { message: 'error response message', code: 'E1111' },
      },
    });
    const policies = {
      policyID: 'aaeceb14ss',
      title: 'dummytitle',
      category: 'nodeConfigurationPolicy',
      policies: {
        cpu: {
          enabled: true,
          maxNum: 10,
          minNum: 1,
        },
      },
      /** Whether at least one checkbox is checked */
      _checkboxes: true,
    };
    // Click the edit button
    const button = screen.getAllByTitle('Edit').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    // Call the submit passed to mockPolicyConfirmModal
    await waitFor(() => {
      const submitFunc = mockPolicyEditModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policies.policyID, policies);
      });
    });

    await waitFor(() => {
      // Verify the failure message
      // Verify that the error information is passed to the error property since the message display is on the modal side
      expect(mockPolicyEditModal.mock.lastCall[0].error).toBeDefined();
    });
  });
  test('The submit for edit is called, and a message that it has been edited is displayed (System Operation Constraints)', async () => {
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <Policy />
      </NextIntlClientProvider>
    );
    // Click the edit button
    const button = screen.getAllByTitle('Edit').find((button) => !button.hasAttribute('disabled'));
    if (button) {
      await userEvent.click(button);
    }
    const policies = {
      policyID: 'aaeceb14ss',
      title: 'dummytitle',
      category: 'systemConfigurationPolicy',
      policies: {
        cpu: {
          enabled: true,
          value: 70,
          unit: 'percent',
          comparison: 'gt',
        },
      },
      /** Whether at least one checkbox is checked */
      _checkboxes: true,
    };
    // Call the submit passed to mockPolicyConfirmModal
    await waitFor(() => {
      const submitFunc = mockPolicyEditModal.mock.lastCall[0].submit;
      expect(submitFunc).toBeDefined();
      act(() => {
        submitFunc(policies.policyID, policies);
      });
    });

    // Verify the success message
    const alertDialog = screen.queryByRole('alert');
    const title = alertDialog?.querySelector('span') as HTMLSpanElement;
    const message = alertDialog?.querySelector('span')?.parentNode?.nextSibling as HTMLDivElement;
    expect(alertDialog).toBeInTheDocument();
    expect(title).toHaveTextContent('The policy has been successfully update');
    expect(message).toHaveTextContent(`ID : ${policies.policyID}`);
    expect(message).toHaveTextContent(`Title : ${policies.title}`);
  });
});
