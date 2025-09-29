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

import { APIDeviceTypeLowerCamel } from '@/types';

/** Type definition of constraints */
export type APPPolicies = APPNodeConfigurationPolicy | APPSystemOperationPolicy;

export type APPNodeConfigurationPolicy = {
  title: string;
  category: 'nodeConfigurationPolicy';
  policies: {
    [key in APIDeviceTypeLowerCamel]: APPHardwareConnection;
  };
  /** Whether at least one checkbox is checked */
  _checkboxes?: boolean;
};

export type APPSystemOperationPolicy = {
  title: string;
  category: 'systemOperationPolicy';
  policies: {
    [key in APIDeviceTypeLowerCamel]: APPUseThreshold;
  };
  /** Whether at least one checkbox is checked */
  _checkboxes?: boolean;
};

export type APPHardwareConnection = {
  enabled: boolean;
  maxNum: number;
  minNum: number;
};

/**
 * Checks if the provided argument is of type `APPHardwareConnection`.
 * @param arg - The argument to be checked.
 * @returns A boolean indicating whether the argument is of type `APPHardwareConnection`.
 */
export const isAPPHardwareConnection = (arg: unknown): arg is APPHardwareConnection => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    'minNum' in arg &&
    typeof arg.minNum === 'number' &&
    'maxNum' in arg &&
    typeof arg.maxNum === 'number'
  );
};

export type APPUseThreshold = {
  enabled: boolean;
  value: number;
  unit: 'percent';
  comparison: 'gt' | 'lt' | 'ge' | 'le';
};

/**
 * Checks if the provided argument is of type `APPUseThreshold`.
 * @param arg - The argument to be checked.
 * @returns `true` if the argument is of type `APPUseThreshold`, `false` otherwise.
 */
export const isAPPUseThreshold = (arg: APPUseThreshold | null): arg is APPUseThreshold => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.enabled === 'boolean' &&
    typeof arg.value === 'number' &&
    arg.unit === 'percent' &&
    ['gt', 'lt', 'ge', 'le'].includes(arg.comparison)
  );
};

/** Modal dialog mode */
export type ModalMode = 'delete' | 'enable' | 'disable' | 'edit' | 'add' | undefined;
