/*
 * Copyright 2026 NEC Corporation.
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

// Apply : FAILED
// procedure1.error: format1 { code, message: string }
// procedure2.error: format2 { errorInfo: [{ errorCode, errorMessage }] }
// procedure3.error: format3 { code, message: Array<{ msg, ... }> }
export const dummyUseLayoutApplyDetail: ReturnType<typeof useLayoutApplyDetail> = {
  data: {
    applyID: '9f3e1b2c4d',
    apply: {
      status: 'FAILED',
      startedAt: new Date('2024-11-20T01:00:00.000Z'),
      endedAt: new Date('2024-11-20T01:05:00.000Z'),
    },
    procedures: [
      {
        operationID: 1,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        apply: {
          operation: 'connect',
          dependencies: [],
          status: 'FAILED',
          startedAt: new Date('2024-11-20T01:01:00.000Z'),
          endedAt: new Date('2024-11-20T01:01:30.000Z'),
          // format1: { code, message: string }
          error: {
            code: 'EF003BAS010',
            message: 'Your request is not supported for the specified target dee.',
          },
        },
      },
      {
        operationID: 2,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        apply: {
          operation: 'connect',
          dependencies: [1],
          status: 'FAILED',
          startedAt: new Date('2024-11-20T01:02:00.000Z'),
          endedAt: new Date('2024-11-20T01:02:30.000Z'),
          // format2: { errorInfo: [{ errorCode, errorMessage }] }
          error: {
            code: 'EF013BAS005',
            message: 'The specified Device ID is not found.',
          },
        },
      },
      {
        operationID: 3,
        targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
        targetDevice: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
        apply: {
          operation: 'connect',
          dependencies: [2],
          status: 'FAILED',
          startedAt: new Date('2024-11-20T01:03:00.000Z'),
          endedAt: new Date('2024-11-20T01:03:30.000Z'),
          // format3: { code, message: Array<{ msg, ... }> }
          error: {
            code: 'EF003BAS012',
            message: 'Input should be a valid UUID, invalid group length in group 4: expected 12, found 13',
          },
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
