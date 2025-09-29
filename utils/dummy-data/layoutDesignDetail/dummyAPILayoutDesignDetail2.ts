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
  designID: '100000000000000000000002',
  status: 'COMPLETED',
  requestID: '1-2',
  startedAt: '2024-04-13T02:34:56.789012Z',
  endedAt: '2024-04-13T02:54:32.123456Z',
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
            deviceIDs: ['0001'],
          },
          accelerator: {
            deviceIDs: ['0002'],
          },
          dsp: {
            deviceIDs: ['0003'],
          },
          fpga: {
            deviceIDs: ['0004'],
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
            deviceIDs: ['0011'],
          },
          gpu: {
            deviceIDs: ['0005'],
          },
          virtualMedia: {
            deviceIDs: ['res10602'],
          },
          graphicController: {
            deviceIDs: ['res10502'],
          },
        },
      },
    ],
  },
  conditions: {
    toleranceCriteria: {
      // cpu: [
      // ],
      // memory: [
      // ],
    },
    // energyCriteria: 6000,
  },
  procedures: [],
};
