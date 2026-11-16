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

import { render } from '@/shared-modules/__test__/test-utils';

import { PolicyEditModal } from '@/components/PolicyEditModal';
import React, { ComponentProps } from 'react';
import { dummyPolicy } from '@/utils/dummy-data/policy/Policy';

jest.mock('@/components', () => ({
  PolicyEditModalNodeConfigurationPolicy: jest.fn(({ modalMode }) => (
    <div data-testid='mock-node-config'>mode: {modalMode}</div>
  )),
  PolicyEditModalSystemOperationPolicy: jest.fn(({ modalMode }) => (
    <div data-testid='mock-system-operation'>mode: {modalMode}</div>
  )),
}));

describe('PolicyEditModal', () => {
  // SetUp
  function makeProps(
    overRide: Partial<ComponentProps<typeof PolicyEditModal>> &
      Required<Pick<ComponentProps<typeof PolicyEditModal>, 'category' | 'modalMode'>>
  ): ComponentProps<typeof PolicyEditModal> {
    const baseProps = {
      selectedPolicyId: 'dummyID',
      policyTitle: 'dummyTitle',
      inputStatus: undefined,
      error: undefined,
      // modalClose: () => {},
      modalClose: jest.fn(),
      submit: jest.fn(),
      data: dummyPolicy,
    } as const;
    return {
      ...baseProps,
      ...overRide,
    };
  }

  beforeEach(() => {
    jest.resetModules();
  });

  test('Output <PolicyEditModalNodeConfigurationPolicy> in add mode', () => {
    // Arrange
    const props = makeProps({
      category: 'nodeConfigurationPolicy',
      modalMode: 'add',
    });
    // Act
    render(<PolicyEditModal {...props} />);
    // Assert
    expect(screen.getByTestId('mock-node-config')).toBeInTheDocument();
    expect(screen.getByText('mode: add')).toBeInTheDocument();
  });

  test('Output <PolicyEditModalNodeConfigurationPolicy> in edit mode', () => {
    // Arrange
    const props = makeProps({
      category: 'nodeConfigurationPolicy',
      modalMode: 'edit',
    });
    // Act
    render(<PolicyEditModal {...props} />);
    // Assert
    expect(screen.getByTestId('mock-node-config')).toBeInTheDocument();
    expect(screen.getByText('mode: edit')).toBeInTheDocument();
  });

  test('Output <PolicyEditModalSystemOperationPolicy> in add mode', () => {
    // Arrange
    const props = makeProps({
      category: 'systemOperationPolicy',
      modalMode: 'add',
    });
    // Act
    render(<PolicyEditModal {...props} />);
    // Assert
    expect(screen.getByTestId('mock-system-operation')).toBeInTheDocument();
    expect(screen.getByText('mode: add')).toBeInTheDocument();
  });

  test('Output <PolicyEditModalSystemOperationPolicy> in edit mode', () => {
    // Arrange
    const props = makeProps({
      category: 'systemOperationPolicy',
      modalMode: 'edit',
    });
    // Act
    render(<PolicyEditModal {...props} />);
    // Assert
    expect(screen.getByTestId('mock-system-operation')).toBeInTheDocument();
    expect(screen.getByText('mode: edit')).toBeInTheDocument();
  });
});
