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

// Apply : Suspended
export const dummyUseLayoutApplyDetail: ReturnType<typeof useLayoutApplyDetail> = {
  data: {
    applyID: '6ab69d73da',
    apply: {
      status: 'SUSPENDED',
      startedAt: new Date('2024-08-01T02:26:28.000Z'),
      suspendedAt: new Date('2024-08-01T02:26:33.000Z'),
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
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'connect',
          dependencies: [1],
          status: 'COMPLETED',
        },
      },
      {
        operationID: 3,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'connect',
          dependencies: [2],
          status: 'FAILED',
          error: {
            code: 'EF003BAS004',
            message: '接続済みのデバイスが指定されました。',
          },
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
        targetDevice: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        apply: {
          operation: 'boot',
          dependencies: [4],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 6,
        targetDevice: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        apply: {
          operation: 'shutdown',
          dependencies: [5],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 7,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        apply: {
          operation: 'disconnect',
          dependencies: [6],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 8,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'disconnect',
          dependencies: [7],
          status: 'SKIPPED',
        },
      },
      {
        operationID: 9,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '8190c071-3f5f-4862-b741-b42591ac51fc',
        apply: {
          operation: 'disconnect',
          dependencies: [8],
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
