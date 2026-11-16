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
    status: 'COMPLETED',
    startDate: '2023-07-29T00:00:00.000Z',
    endDate: '2023-07-29T00:00:00.000Z',
    durationSec: 10 * 24 * 60 * 60,
  },
  // Active
  active: {
    status: 'ACTIVE',
    durationSec: 10 * 24 * 60 * 60,
    startDate: '2023-07-29T00:00:00.000Z',
  },
};

/**
 * APILayoutDetail
 * Type definition for the response of GET /layout-detail?/{designID}
 */
export const LayoutDetail: APILayoutDetail = {
  designID: '636ddde1ba39547845db0628',
  status: LayoutStatus,
  // request: any, // Currently not used (content to be PUT in /layout-designs)
  design: {
    node: [
      {
        nodeID: 'string', // string | undefined
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
          // unknownProcessor is not defined in Team B's definition, is it okay?
          cpu: {
            deviceID: ['string', 'string', 'string'],
          },
          memory: {
            deviceID: ['string', 'string', 'string'],
          },
          storage: {
            deviceID: ['string', 'string', 'string'],
          },
          gpu: {
            deviceID: ['string', 'string', 'string'],
          },
          fpga: {
            deviceID: ['string', 'string', 'string'],
          },
          networkInterface: {
            deviceID: ['string', 'string', 'string'],
          },
          virtualMedia: {
            deviceID: ['string', 'string', 'string'],
          },
          graphicController: {
            deviceID: ['string', 'string', 'string'],
          },
          accelerator: {
            deviceID: ['string', 'string', 'string'],
          },
          dsp: {
            deviceID: ['string', 'string', 'string'],
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
  procedure: [],
  //   rollbackProcedure: any; // Only used during cancellation. Migration procedure to revert the system to the state before the execution.
};
