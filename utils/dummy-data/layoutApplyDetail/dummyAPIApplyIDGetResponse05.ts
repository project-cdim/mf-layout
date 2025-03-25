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

import { APIApplyIDGetResponse } from '@/shared-modules/types';

// Apply : CANCELD, Rollback: FAILD
export const dummyAPIApplyIDGetResponse: APIApplyIDGetResponse = {
  status: 'CANCELED',
  procedures: [
    {
      operation: 'connect',
      operationID: 1,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [],
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
    },
    {
      operation: 'connect',
      operationID: 2,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [1],
      targetDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
    },
  ],
  applyID: 'dummy005',
  applyResult: [
    {
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'FAILED',
      statusCode: 200,
      operationID: 1,
      requestBody: {
        action: 'connect',
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      responseBody: {
        code: '500',
        message: 'Internal Server Error : not connect',
      },
      getInformation: {
        responseBody: {
          powerState: 'On',
        },
      },
    },
    {
      status: 'CANCELED',
      operationID: 2,
    },
  ],
  rollbackProcedures: [
    {
      operation: 'disconnect',
      operationID: 1,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [],
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
    },
  ],
  executeRollback: true,
  rollbackStatus: 'FAILED',
  rollbackResult: [
    {
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'FAILED',
      statusCode: 200,
      operationID: 1,
      requestBody: {
        action: 'disconnect',
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      responseBody: {
        code: '500',
        message: 'Internal Server Error: not disconnect',
      },
      getInformation: {
        responseBody: {
          powerState: 'On',
        },
      },
    },
  ],
  startedAt: '2024-11-20T01:03:39Z',
  endedAt: '2024-11-20T01:05:20Z',
  canceledAt: '2024-11-20T01:03:47Z',
  rollbackStartedAt: '2024-11-20T01:03:49Z',
  rollbackEndedAt: '2024-11-20T01:05:20Z',
};
