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

// Rollback : In Progress
export const dummyUseLayoutApplyDetail: ReturnType<typeof useLayoutApplyDetail> = {
  data: {
    applyID: 'e1e1860e9b',
    apply: {
      status: 'CANCELED',
      startedAt: new Date('2024-08-01T01:17:36.000Z'),
      canceledAt: new Date('2024-08-01T01:17:40.000Z'),
    },
    rollback: {
      status: 'IN_PROGRESS',
      startedAt: new Date('2024-08-01T01:17:53.000Z'),
      suspendedAt: new Date('2024-08-01T01:18:04.000Z'),
      resumedAt: new Date('2024-08-01T01:22:39.000Z'),
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
        rollback: {
          operation: 'disconnect',
          dependencies: [],
          status: 'FAILED',
        },
      },
      {
        operationID: 2,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'connect',
          dependencies: [1],
          status: 'CANCELED',
        },
      },
      {
        operationID: 3,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '8190c071-3f5f-4862-b741-b42591ac51fc',
        apply: {
          operation: 'connect',
          dependencies: [2],
          status: 'CANCELED',
        },
      },
      {
        operationID: 4,
        targetDevice: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        apply: {
          operation: 'boot',
          dependencies: [3],
          status: 'CANCELED',
        },
      },
      {
        operationID: 5,
        targetDevice: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        apply: {
          operation: 'shutdown',
          dependencies: [4],
          status: 'CANCELED',
        },
      },
      {
        operationID: 6,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        apply: {
          operation: 'disconnect',
          dependencies: [5],
          status: 'CANCELED',
        },
      },
      {
        operationID: 7,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'disconnect',
          dependencies: [6],
          status: 'CANCELED',
        },
      },
      {
        operationID: 8,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '8190c071-3f5f-4862-b741-b42591ac51fc',
        apply: {
          operation: 'disconnect',
          dependencies: [7],
          status: 'CANCELED',
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
