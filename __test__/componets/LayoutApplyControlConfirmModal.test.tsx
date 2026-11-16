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

import React, { ComponentProps } from 'react';

import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { LayoutApplyControlConfirmModal } from '@/components';

describe('LayoutApplyControlConfirmModal', () => {
  const defaultProp: ComponentProps<typeof LayoutApplyControlConfirmModal> = {
    modalProps: {
      close: jest.fn(),
      submitFunction: jest.fn(),
      id: 'test-id',
      isOpen: true,
      confirmTitle: 'Confirm Title',
      confirmMessage: 'Are you sure you want to proceed?',
      submitButtonLabel: 'Submit',
      cancelButtonLabel: 'Cancel',
      errorTitle: 'Error',
      error: undefined,
    },
  };

  test('Renders modal with correct title and message', () => {
    render(<LayoutApplyControlConfirmModal {...defaultProp} />);
    expect(screen.getByText('Confirm Title')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  test('Calls close function when cancel button is clicked', async () => {
    render(<LayoutApplyControlConfirmModal {...defaultProp} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(defaultProp.modalProps.close).toHaveBeenCalled();
  });

  test('Calls submit function when submit button is clicked', async () => {
    render(<LayoutApplyControlConfirmModal {...defaultProp} />);
    await userEvent.click(screen.getByText('Submit'));
    expect(defaultProp.modalProps.submitFunction).toHaveBeenCalled();
  });

  test('Displays error message when error is present', () => {
    const errorProp = {
      ...defaultProp,
      modalProps: {
        ...defaultProp.modalProps,
        error: {
          isAxiosError: true,
          toJSON: () => ({}),
          name: 'AxiosError',
          message: 'An error occurred',
          response: {
            data: {
              message: 'Error details',
              code: '123',
            },
          },
        } as any,
      },
    };
    render(<LayoutApplyControlConfirmModal {...errorProp} />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByText('Error details (123)')).toBeInTheDocument();
  });
});
