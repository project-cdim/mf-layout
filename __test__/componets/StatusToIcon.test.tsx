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

import { render } from '@testing-library/react';

import { IconWithInfo } from '@/shared-modules/components';

import { StatusToIcon } from '@/components/StatusToIcon';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  IconWithInfo: jest.fn(),
}));

describe('statusToIcon for Design', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });

  test('When the status is IN_PROGRESS, the label is in English as "In progress"', () => {
    const status = 'IN_PROGRESS';
    render(<StatusToIcon status={status} target='Design' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} is currently in progress');
  });

  test('When the status is FAILED, the label is in English as "Design failed"', () => {
    const status = 'FAILED';
    render(<StatusToIcon status={status} target='Design' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} failed');
  });

  test('When the status is COMPLETED, the label is in English as "Design completed successfully"', () => {
    const status = 'COMPLETED';
    render(<StatusToIcon status={status} target='Design' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} completed');
  });

  test('When the status is CANCELING, the label is in English as "Canceling design"', () => {
    const status = 'CANCELING';
    render(<StatusToIcon status={status} target='Design' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} is being canceled');
  });

  test('When the status is CANCELED, the label is in English as "Design canceled"', () => {
    const status = 'CANCELED';
    render(<StatusToIcon status={status} target='Design' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} canceled');
  });
});

describe('statusToIcon for Apply', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });

  test('When the status is IN_PROGRESS, the label is in English as "In progress"', () => {
    const status = 'IN_PROGRESS';
    render(<StatusToIcon status={status} target='Apply' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} is currently in progress');
  });

  test('When the status is FAILED, the label is in English as "Apply failed"', () => {
    const status = 'FAILED';
    render(<StatusToIcon status={status} target='Apply' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} failed');
  });

  test('When the status is COMPLETED, the label is in English as "Apply completed successfully"', () => {
    const status = 'COMPLETED';
    render(<StatusToIcon status={status} target='Apply' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} completed');
  });

  test('When the status is CANCELING, the label is in English as "Canceling Apply"', () => {
    const status = 'CANCELING';
    render(<StatusToIcon status={status} target='Apply' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} is being canceled');
  });

  test('When the status is CANCELED, the label is in English as "Apply canceled"', () => {
    const status = 'CANCELED';
    render(<StatusToIcon status={status} target='Apply' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} canceled');
  });

  test('When the status is SUSPENDED, the label is in English as "Apply suspended"', () => {
    const status = 'SUSPENDED';
    render(<StatusToIcon status={status} target='Apply' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} suspended');
  });
});

describe('statusToIcon for Rollback', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });

  test('When the status is IN_PROGRESS, the label is in English as "In progress"', () => {
    const status = 'IN_PROGRESS';
    render(<StatusToIcon status={status} target='Rollback' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} is currently in progress');
  });

  test('When the status is FAILED, the label is in English as "Rollback failed"', () => {
    const status = 'FAILED';
    render(<StatusToIcon status={status} target='Rollback' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} failed');
  });

  test('When the status is COMPLETED, the label is in English as "Rollback completed successfully"', () => {
    const status = 'COMPLETED';
    render(<StatusToIcon status={status} target='Rollback' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} completed');
  });

  test('When the status is SUSPENDED, the label is in English as "Rollback suspended"', () => {
    const status = 'SUSPENDED';
    render(<StatusToIcon status={status} target='Rollback' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} suspended');
  });

  test('When the status is SKIPPED, the label is in English as "Rollback skipped"', () => {
    const status = 'SKIPPED';
    render(<StatusToIcon status={status} target='Rollback' />);

    const givenProps = (IconWithInfo as unknown as jest.Mock).mock.lastCall[0];
    expect(givenProps.label).toBe('{action} skipped');
  });

  test('When the status is undefined, no icon is rendered', () => {
    const status = undefined;
    const { container } = render(<StatusToIcon status={status} target='Rollback' />);
    expect(container.firstChild).toBeNull();
  });
});
