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

import { APIPolicies } from '@/types';

// dummy data
export const dummyPolicy: APIPolicies = {
  count: 5,
  policies: [
    {
      policyID: 'd8eceb14da',
      category: 'nodeConfigurationPolicy',
      title: 'Node configuration constraints',
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
    },
    {
      policyID: 'd8eceb14d1',
      category: 'nodeConfigurationPolicy',
      title: 'Node configuration constraints 2',
      policy: {
        hardwareConnectionsLimit: {
          memory: {
            maxNum: 5,
            minNum: 1,
          },
          storage: {
            maxNum: 8,
            minNum: 2,
          },
          gpu: {
            maxNum: 2,
            minNum: 1,
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    },
    {
      policyID: 'abc10dfaa9',
      category: 'systemOperationPolicy',
      title: 'Resource usage rate threshold constraints for configuration design',
      policy: {
        useThreshold: {
          cpu: {
            value: 80,
            unit: 'percent',
            comparison: 'lt',
          },
          memory: {
            value: 60,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    },
    {
      policyID: 'abc10dfaa2',
      category: 'systemOperationPolicy',
      title:
        'Constraints on threshold values of resource usage rates calculated at the time of configuration design 2 (over 100 characters)',
      policy: {
        useThreshold: {
          storage: {
            value: 88,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: true,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    },
    {
      policyID: 'abc10dfaa3',
      category: 'systemOperationPolicy',
      title:
        'Constraints on threshold values of resource usage rates calculated at the time of configuration design 3 (over 100 charactors)',
      policy: {
        useThreshold: {
          gpu: {
            value: 70,
            unit: 'percent',
            comparison: 'lt',
          },
          virtualMedia: {
            value: 90,
            unit: 'percent',
            comparison: 'lt',
          },
        },
      },
      enabled: false,
      createdAt: '2023-05-10T00:00:00Z',
      updatedAt: '2023-05-10T00:00:00Z',
    },
  ],
};
