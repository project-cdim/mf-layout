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

import { initialValues } from '@/utils/policy';

describe('initialValues', () => {
  test('should have correct values for initialValues', () => {
    const expectedValues = {
      nodeConfigurationPolicy: {
        title: '',
        category: 'nodeConfigurationPolicy',
        policies: {
          accelerator: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          cpu: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          dsp: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          fpga: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          gpu: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          memory: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          storage: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          virtualMedia: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          graphicController: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
          networkInterface: {
            enabled: false,
            minNum: 1,
            maxNum: 1,
          },
        },
        _checkboxes: false,
      },
      systemOperationPolicy: {
        title: '',
        category: 'systemOperationPolicy',
        policies: {
          accelerator: {
            enabled: false,
            value: 100,
            unit: 'percent',
            comparison: 'le',
          },
          cpu: {
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
          fpga: {
            enabled: false,
            value: 100,
            unit: 'percent',
            comparison: 'le',
          },
          gpu: {
            enabled: false,
            value: 100,
            unit: 'percent',
            comparison: 'le',
          },
          memory: {
            enabled: false,
            value: 100,
            unit: 'percent',
            comparison: 'le',
          },
          storage: {
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
        _checkboxes: false,
      },
    };
    expect(initialValues).toEqual(expectedValues);
  });
});
