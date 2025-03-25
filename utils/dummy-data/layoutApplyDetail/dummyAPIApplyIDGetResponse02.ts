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

// Apply : COMPLETED, resume: COMPLETED
export const dummyAPIApplyIDGetResponse: APIApplyIDGetResponse = {
  status: 'COMPLETED',
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
    { status: 'SKIPPED', operationID: 2 },
  ],
  resumeProcedures: [
    {
      operation: 'boot',
      operationID: 2,
      dependencies: [],
      targetDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
    },
  ],
  resumeResult: [
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/devices/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/power',
      method: 'PUT',
      status: 'COMPLETED',
      isOSBoot: {
        uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/is-os-ready',
        method: 'GET',
        statusCode: 200,
        responseBody: {
          status: true,
          IPAddress: '192.168.122.11',
        },
        queryParameter: {
          timeOut: 2,
        },
      },
      statusCode: 200,
      operationID: 2,
      requestBody: {
        action: 'on',
      },
      responseBody: {
        deviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
  ],
  startedAt: '2024-07-17T02:43:51Z',
  endedAt: '2024-07-17T02:45:45Z',
  suspendedAt: '2024-07-17T02:43:57Z',
  resumedAt: '2024-07-17T02:45:07Z',
};
