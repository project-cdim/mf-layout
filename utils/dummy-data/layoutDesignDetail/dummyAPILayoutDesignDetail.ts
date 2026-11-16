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

import { APILayoutDesign } from '@/types';

export const dummyAPILayoutDesign: APILayoutDesign = {
  designID: '100000000000000000000001',
  status: 'COMPLETED',
  requestID: '1-1',
  startedAt: '2024-04-14T03:34:56.789012Z',
  endedAt: '2024-04-14T03:54:32.123456Z',
  design: {
    nodes: [
      {
        services: [
          {
            id: 'service_A',
            requestInstanceID: 'request_instance_1',
          },
        ],
        device: {
          cpu: {
            deviceIDs: ['res10102'],
          },
          memory: {
            deviceIDs: ['res10203'],
          },
          storage: {
            deviceIDs: ['res10302'],
          },
          networkInterface: {
            deviceIDs: ['res10401'],
          },
        },
      },
      {
        services: [
          {
            id: 'service_B',
            requestInstanceID: 'request_instance_2',
          },
        ],
        device: {
          cpu: {
            deviceIDs: ['res11102'],
          },
          memory: {
            deviceIDs: ['res11203'],
          },
          storage: {
            deviceIDs: ['res11302'],
          },
          networkInterface: {
            deviceIDs: ['res11401'],
          },
        },
      },
    ],
  },
  conditions: {
    toleranceCriteria: {
      cpu: [
        {
          deviceIDs: ['0001', 'res10102'],
          limit: {
            averageUseRate: 33.0,
            weights: [1.0, 0.8],
          },
        },
        {
          deviceIDs: [
            '0001',
            '0011',
            '0021',
            'res10101',
            'res10109',
            'res10110',
            'res10111',
            'res10112',
            'res1101',
            'res1102',
            'res1103',
          ],
          limit: {
            averageUseRate: 55.000000000000256,
            weights: [1.0, 1.2, 0.5, 0.75, 0.25, 0.1, 0.05, 0.01, 1.25, 1.5, 0.2],
          },
        },
      ],
      memory: [
        {
          deviceIDs: ['1011', 'res10203'],
          limit: {
            averageUseBytes: 4294967296.0,
          },
        },
        {
          deviceIDs: [
            '1011',
            '1021',
            'res10201',
            'res10202',
            'res10203',
            'res10204',
            'res10205',
            'res10206',
            'res10207',
            'res10208',
            'res11201',
          ],
          limit: {
            averageUseBytes: 8589934592.0,
          },
        },
      ],
    },
    energyCriteria: 6000,
  },
  procedures: [
    {
      operationID: 1,
      operation: 'shutdown',
      dependencies: [],
      targetDeviceID: 'res10102',
    },
    {
      operationID: 2,
      operation: 'disconnect',
      dependencies: [1],
      targetCPUID: 'res10102',
      targetDeviceID: 'res10302',
    },
    {
      operationID: 3,
      operation: 'connect',
      dependencies: [1],
      targetCPUID: 'res10102',
      targetDeviceID: 'res10401',
    },
    {
      operationID: 4,
      operation: 'boot',
      dependencies: [1, 2, 3],
      targetDeviceID: 'res10102',
    },
  ],
};
