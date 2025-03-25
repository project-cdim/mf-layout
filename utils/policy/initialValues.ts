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

import _ from 'lodash';

import { APIDeviceTypeLowerCamel, APPHardwareConnection, APPPolicies, APPUseThreshold } from '@/types';

import { deviceTypes } from '@/utils/define';

/** Default values */
const initHardwareConnection: APPHardwareConnection = {
  enabled: false,
  minNum: 1,
  maxNum: 1,
};

const initUseThreshold: APPUseThreshold = {
  enabled: false,
  value: 100,
  unit: 'percent',
  comparison: 'le',
};

export const initialValues: { [key in 'nodeConfigurationPolicy' | 'systemOperationPolicy']: APPPolicies } = {
  nodeConfigurationPolicy: {
    title: '',
    category: 'nodeConfigurationPolicy',
    policies: deviceTypes.reduce((acc, item) => {
      acc[item] = _.cloneDeep(initHardwareConnection);
      return acc;
    }, {} as { [key in APIDeviceTypeLowerCamel]: APPHardwareConnection }),
    _checkboxes: false,
  },
  systemOperationPolicy: {
    title: '',
    category: 'systemOperationPolicy',
    policies: deviceTypes.reduce((acc, item) => {
      acc[item] = _.cloneDeep(initUseThreshold);
      return acc;
    }, {} as { [key in APIDeviceTypeLowerCamel]: APPUseThreshold }),
    _checkboxes: false,
  },
};
