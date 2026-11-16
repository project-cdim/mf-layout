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

import { Button } from '@mantine/core';

import { render } from '@/shared-modules/__test__/test-utils';

import { LayoutApplyControlButtons } from '@/components';

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  Button: jest.fn(),
}));

describe('LayoutApplyControlButtons', () => {
  const defaultProps: ComponentProps<typeof LayoutApplyControlButtons> = {
    phaseText: 'Apply',
    statusText: 'Completed',
    activeButtons: [],
    handleCancel: jest.fn(),
    handleRollback: jest.fn(),
    handleFailed: jest.fn(),
    handleResume: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render the component with all buttons disabled', () => {
    render(<LayoutApplyControlButtons {...defaultProps} />);

    const calls = (Button as unknown as jest.Mock).mock.calls;

    const cancelButtonCall = calls.find((call) => call[0].children === 'Apply Cancel');
    expect(cancelButtonCall).toBeDefined();
    expect(cancelButtonCall[0].disabled).toBe(true);

    const rollbackButtonCall = calls.find((call) => call[0].children === 'Rollback');
    expect(rollbackButtonCall).toBeDefined();
    expect(rollbackButtonCall[0].disabled).toBe(true);

    const forcedTerminationButtonCall = calls.find((call) => call[0].children === 'Forced Termination');
    expect(forcedTerminationButtonCall).toBeDefined();
    expect(forcedTerminationButtonCall[0].disabled).toBe(true);

    const resumeButtonCall = calls.find((call) => call[0].children === 'Resume');
    expect(resumeButtonCall).toBeDefined();
    expect(resumeButtonCall[0].disabled).toBe(true);
  });

  test('enable the Cancel button when activeButtons includes "Cancel"', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Cancel']} />);

    const cancelButtonCall = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'Apply Cancel'
    );
    expect(cancelButtonCall).toBeDefined();
    expect(cancelButtonCall[0].disabled).toBe(false);
  });

  test('enable the Rollback button when activeButtons includes "Rollback"', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Rollback']} />);

    const rollbackButtonCall = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'Rollback'
    );
    expect(rollbackButtonCall).toBeDefined();
    expect(rollbackButtonCall[0].disabled).toBe(false);
  });

  test('enable the Forced Termination button when activeButtons includes "Forced Termination"', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Forced Termination']} />);

    const forcedTerminationButtonCall = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'Forced Termination'
    );
    expect(forcedTerminationButtonCall).toBeDefined();
    expect(forcedTerminationButtonCall[0].disabled).toBe(false);
  });

  test('enable the Resume button when activeButtons includes "Resume"', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Resume']} />);

    const resumeButtonCall = (Button as unknown as jest.Mock).mock.calls.find((call) => call[0].children === 'Resume');
    expect(resumeButtonCall).toBeDefined();
    expect(resumeButtonCall[0].disabled).toBe(false);
  });

  test('call handleCancel when Cancel button is clicked', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Cancel']} />);

    const cancelButtonCall = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'Apply Cancel'
    );
    expect(cancelButtonCall).toBeDefined();

    cancelButtonCall[0].onClick();
    expect(defaultProps.handleCancel).toHaveBeenCalled();
  });

  test('call handleRollback when Rollback button is clicked', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Rollback']} />);

    const rollbackButtonCall = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'Rollback'
    );
    expect(rollbackButtonCall).toBeDefined();

    rollbackButtonCall[0].onClick();
    expect(defaultProps.handleRollback).toHaveBeenCalled();
  });

  test('call handleFailed when Forced Termination button is clicked', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Forced Termination']} />);

    const forcedTerminationButtonCall = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'Forced Termination'
    );
    expect(forcedTerminationButtonCall).toBeDefined();

    forcedTerminationButtonCall[0].onClick();
    expect(defaultProps.handleFailed).toHaveBeenCalled();
  });

  test('call handleResume when Resume button is clicked', () => {
    render(<LayoutApplyControlButtons {...defaultProps} activeButtons={['Resume']} />);

    const resumeButtonCall = (Button as unknown as jest.Mock).mock.calls.find((call) => call[0].children === 'Resume');
    expect(resumeButtonCall).toBeDefined();

    resumeButtonCall[0].onClick();
    expect(defaultProps.handleResume).toHaveBeenCalled();
  });
});
