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

// Apply : CANCELED, rollback->resume: COMPLETED
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
    { operation: 'boot', operationID: 2, dependencies: [], targetDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2' },
  ],
  applyID: 'a0f84fcba5',
  applyResult: [
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 1,
      requestBody: { action: 'connect', deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1' },
      responseBody: {
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
      getInformation: { responseBody: { powerState: 'On' } },
    },
    { status: 'CANCELED', operationID: 2 },
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
  rollbackStatus: 'COMPLETED',
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
        message: 'Internal Server Error',
      },
      getInformation: {
        responseBody: {
          powerState: 'On',
        },
      },
    },
  ],
  resumeProcedures: [
    {
      operation: 'disconnect',
      operationID: 1,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [],
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
    },
  ],
  resumeResult: [
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 1,
      requestBody: {
        action: 'disconnect',
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      responseBody: {
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
      getInformation: {
        responseBody: {
          powerState: 'On',
        },
      },
    },
  ],
  startedAt: '2024-07-17T02:43:51Z',
  endedAt: '2024-07-17T02:51:45Z',
  suspendedAt: '2024-07-17T02:47:57Z',
  resumedAt: '2024-07-17T02:49:07Z',
  rollbackStartedAt: '2024-07-17T02:48:07Z',
  rollbackEndedAt: '2024-07-17T02:50:07Z',
};
