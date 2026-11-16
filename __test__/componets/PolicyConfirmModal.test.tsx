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
import React, { ComponentProps } from 'react';

import { APIPolicyError } from '@/types';

import { PolicyConfirmModal } from '@/components';
import { AxiosError } from 'axios';

jest.unmock('next-intl');
jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useMessages: jest.fn(),
}));

describe('PolicyConfirmModal', () => {
  beforeEach(() => {
    (useMessages as unknown as jest.Mock).mockImplementation(() => {
      return { ...commonMessages, ...mfLayoutMessages } as AbstractIntlMessages;
    });
  });

  test('Correctly displays "delete" confirmation content', () => {
    const props = {
      modalMode: 'delete',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Do you want to delete "Dummy Title"?', { exact: false })).toBeInTheDocument();
  });

  test('Correctly displays "enable" confirmation content', () => {
    const props = {
      modalMode: 'enable',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Do you want to enable "Dummy Title"?', { exact: false })).toBeInTheDocument();
  });

  test('Correctly displays "disable" confirmation content', () => {
    const props = {
      modalMode: 'disable',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Do you want to disable "Dummy Title"?', { exact: false })).toBeInTheDocument();
  });

  test('The cancel button works', async () => {
    /** The callback function passed via props can be executed */
    const props = {
      modalMode: 'delete',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;

    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    const button = screen.getByRole('button', { name: 'No' });
    await user.click(button);
    expect(props.modalClose).toHaveBeenCalled();
  });

  test('Correctly displays the "OK" execution button', () => {
    const props = {
      modalMode: 'enable',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
  });

  test('Correctly displays the "Delete" execution button', () => {
    const props = {
      modalMode: 'delete',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
  });

  test('The "OK" execution button works correctly (enable)', async () => {
    /** The callback function passed via props can be executed */
    const props = {
      modalMode: 'enable',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    const button = screen.getByRole('button', { name: 'Yes' });
    await user.click(button);
    expect(props.submit).toHaveBeenCalled();
  });

  test('The "OK" execution button works correctly (disable)', async () => {
    /** The callback function passed via props can be executed */
    /** A branch exists for enable/disable on click */
    const props = {
      modalMode: 'disable',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    const button = screen.getByRole('button', { name: 'Yes' });
    await user.click(button);
    expect(props.submit).toHaveBeenCalled();
  });

  test('The "Delete" execution button works correctly', async () => {
    /** The callback function passed via props can be executed */
    const props = {
      modalMode: 'delete',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: undefined,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    const user = userEvent.setup({ delay: null });
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    const button = screen.getByRole('button', { name: 'Yes' });
    await user.click(button);
    expect(props.submit).toHaveBeenCalled();
  });

  test('Correctly displays the error message (when error.response is absent)', () => {
    const props = {
      modalMode: 'delete',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: new AxiosError('An error occurred'),
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('An error occurred', { exact: false })).toBeInTheDocument();
  });

  test('Correctly displays the error message from the API', () => {
    const props = {
      modalMode: 'delete',
      selectedPolicyId: 'selectedPolicyIdxxxxxxxxx',
      policyTitle: 'Dummy Title',
      modalClose: jest.fn(),
      submit: jest.fn(),
      error: {
        message: 'An error occurred',
        response: {
          data: {
            code: 'E0000',
            message: 'Error Message',
          },
        },
      } as AxiosError<APIPolicyError, any>,
      // data: APIPolicies,
    } as const satisfies ComponentProps<typeof PolicyConfirmModal>;
    render(
      <NextIntlClientProvider locale='en' messages={useMessages()}>
        <PolicyConfirmModal {...props} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('E0000', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Error Message', { exact: false })).toBeInTheDocument();
  });
});
