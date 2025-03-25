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

import { APILayoutDetail, APILayoutStatus } from '@/types';

// Case where layout information is empty

const LayoutStatus: APILayoutStatus = {
  currentStep: 'end',
  // Design
  design: {
    status: 'COMPLETED',
    startDate: '2023-07-29T00:09:18.000Z',
    endDate: '2023-07-29T10:29:45.000Z',
    durationSec: 20 * 60,
  },
  // Apply
  apply: {
    status: 'FAILED',
    code: 'E40005',
    message: 'Failed to execute LayoutApply',
    startDate: '2023-07-29T00:00:00.000Z',
    endDate: '2023-07-29T00:00:00.000Z',
    durationSec: 10 * 24 * 60 * 60,
  },
};

/**
 * APILayoutDetail
 * Type definition for the response of GET /layout-detail?/{designID}
 */
export const LayoutDetail: APILayoutDetail = {
  designID: '636ddde1ba39547845db0628',
  status: LayoutStatus,
  design: {
    node: [
      {
        service: [
          {
            serviceId: 'string',
            id: 'string',
          },
          {
            serviceId: 'string',
            id: 'string',
          },
          {
            serviceId: 'string',
            id: 'string',
          },
        ],
        device: {
          cpu: {
            deviceID: [], //, 'string', 'string'],
          },
          memory: {
            deviceID: [], //, 'string', 'string'],
          },
          storage: {
            deviceID: [], //, 'string', 'string'],
          },
          gpu: {
            deviceID: [], //s, 'string', 'string'],
          },
          fpga: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          networkInterface: {
            deviceID: [], // 'res10401', 'string', 'string'],
          },
          virtualMedia: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          graphicController: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          accelerator: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          dsp: {
            deviceID: [], // 'string', 'string', 'string'],
          },
        },
      },
      {
        // nodeID: 'string', // string | undefined
        service: [
          {
            serviceId: 'string',
            id: 'string',
          },
          {
            serviceId: 'string',
            id: 'string',
          },
          {
            serviceId: 'string',
            id: 'string',
          },
        ],
        device: {
          cpu: {
            deviceID: [], //, 'string', 'string'],
          },
          memory: {
            deviceID: [], //, 'string', 'string'],
          },
          storage: {
            deviceID: [], //, 'string', 'string'],
          },
          gpu: {
            deviceID: [], //s, 'string', 'string'],
          },
          fpga: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          networkInterface: {
            deviceID: [], // 'res10401', 'string', 'string'],
          },
          virtualMedia: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          graphicController: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          accelerator: {
            deviceID: [], // 'string', 'string', 'string'],
          },
          dsp: {
            deviceID: [], // 'string', 'string', 'string'],
          },
        },
      },
    ],
  },
  /** Policy */
  conditions: {
    toleranceCriteria: {
      cpu: [
        {
          device: ['string', 'string', 'string'],
          limit: {
            averageUseRate: 0,
          },
        },
      ],
      memory: [
        {
          device: ['string', 'string', 'string'],
          limit: {
            averageUseBytes: 1,
          },
        },
      ],
    },
    energyCriteria: 0,
  },
  /** Migration procedure */
  procedure: [
    {
      operationId: 1,
      operation: 'disconnect',
      targetCpuId: 'res10101',
      targetDeviceId: 'res10201',
      dependencies: [],
      applyResults: {
        // Refer to the response of /layout-apply
        // Add IN_PROGRESS, CANCELING? What about the waiting state?
        status: 'COMPLETED', //'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED',
        endDate: '2023-07-25T11:34:24.000Z',
        uri: 'string',
        method: 'string',
        queryParameter: 'string',
        requestBody: {
          hostCpuId: 'string',
          targetDeviceId: 'string',
        },
        statusCode: 200, // HTTP status code
        responseBody: {
          description: 'string',
          code: 'string',
          message: 'string',
        },
      },
    },
    {
      operationId: 2,
      operation: 'connect',
      targetCpuId: 'res10102',
      targetDeviceId: 'res10202',
      dependencies: [1],
      applyResults: {
        // Refer to the response of /layout-apply
        // Add IN_PROGRESS, CANCELING? What about the waiting state?
        status: 'FAILED', //'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED',
        endDate: '2023-07-25T11:45:00.000Z',
        uri: 'string',
        method: 'string',
        queryParameter: 'string',
        requestBody: {
          hostCpuId: 'string',
          targetDeviceId: 'string',
        },
        statusCode: 200, // HTTP status code
        responseBody: {
          description: 'string',
          code: 'string',
          message: 'string',
        },
      },
    },
    {
      operationId: 3,
      operation: 'connect',
      targetCpuId: 'res10109',
      targetDeviceId: 'res10201',
      dependencies: [],
      applyResults: {
        // Refer to the response of /layout-apply
        // Add IN_PROGRESS, CANCELING? What about the waiting state?
        status: 'CANCELED', //'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED',
        endDate: '2023-07-25T12:00:00.000Z',
        uri: 'string',
        method: 'string',
        queryParameter: 'string',
        requestBody: {
          hostCpuId: 'string',
          targetDeviceId: 'string',
        },
        statusCode: 200, // HTTP status code
        responseBody: {
          description: 'string',
          code: 'string',
          message: 'string',
        },
      },
    },
    {
      operationId: 4,
      operation: 'connect',
      targetCpuId: 'res10109',
      targetDeviceId: 'res10201',
      dependencies: [],
      applyResults: {
        // Refer to the response of /layout-apply
        // Add IN_PROGRESS, CANCELING? What about the waiting state?
        status: 'IN_PROGRESS', //'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED',
        endDate: '2023-07-25T13:00:00.000Z',
        uri: 'string',
        method: 'string',
        queryParameter: 'string',
        requestBody: {
          hostCpuId: 'string',
          targetDeviceId: 'string',
        },
        statusCode: 200, // HTTP status code
        responseBody: {
          description: 'string',
          code: 'string',
          message: 'string',
        },
      },
    },
    {
      operationId: 5,
      operation: 'boot',
      targetCpuId: 'res10109',
      dependencies: [2],
      applyResults: {
        // Refer to the response of /layout-apply
        // Add IN_PROGRESS, CANCELING? What about the waiting state?
        status: 'SKIPPED', //'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED',
        endDate: '2023-07-25T14:00:00.000Z',
        uri: 'string',
        method: 'string',
        queryParameter: 'string',
        requestBody: {
          hostCpuId: 'string',
          targetDeviceId: 'string',
        },
        statusCode: 200, // HTTP status code
        responseBody: {
          description: 'string',
          code: 'string',
          message: 'string',
        },
      },
    },
    {
      operationId: 6,
      operation: 'boot',
      targetCpuId: 'res10109',
      dependencies: [2],
      applyResults: {
        // Refer to the response of /layout-apply
        // Add IN_PROGRESS, CANCELING? What about the waiting state?
        // @ts-expect-error
        status: 'DUMMY', //'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED',
        endDate: '2023-07-25T12:00:00.000Z',
        uri: 'string',
        method: 'string',
        queryParameter: 'string',
        requestBody: {
          hostCpuId: 'string',
          targetDeviceId: 'string',
        },
        statusCode: 200, // HTTP status code
        responseBody: {
          description: 'string',
          code: 'string',
          message: 'string',
        },
      },
    },
  ],
};
