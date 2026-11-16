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

import { useLayoutApplyDetail } from '@/utils/hooks';

// Apply : Failed + Resume Requested
export const dummyUseLayoutApplyDetail: ReturnType<typeof useLayoutApplyDetail> = {
  data: {
    applyID: 'bdb2dfafd6',
    apply: {
      status: 'FAILED',
      startedAt: new Date('2024-07-17T02:52:24.000Z'),
      suspendedAt: new Date('2024-07-17T02:52:29.000Z'),
      resumedAt: new Date('2024-07-17T02:52:38.000Z'),
      endedAt: new Date('2024-07-17T02:52:39.000Z'),
    },
    procedures: [
      {
        operationID: 1,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        apply: {
          operation: 'connect',
          dependencies: [],
          status: 'COMPLETED',
        },
      },
      {
        operationID: 2,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        apply: {
          operation: 'connect',
          dependencies: [1],
          status: 'FAILED',
          error: {
            code: 'E40007',
            message:
              'The URL in the configuration file is incorrect.http://localhost:48888/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
          },
        },
      },
      {
        operationID: 3,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'connect',
          dependencies: [2],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 4,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '8190c071-3f5f-4862-b741-b42591ac51fc',
        apply: {
          operation: 'connect',
          dependencies: [3],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 5,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        apply: {
          operation: 'disconnect',
          dependencies: [4],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 6,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'disconnect',
          dependencies: [5],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 7,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '8190c071-3f5f-4862-b741-b42591ac51fc',
        apply: {
          operation: 'disconnect',
          dependencies: [6],
          status: 'SKIPPED',
        },
      },
    ],
  },
  error: {
    layout: undefined,
    resource: undefined,
  },
  isValidating: {
    layout: false,
    resource: false,
  },
  mutate: () => {},
};
