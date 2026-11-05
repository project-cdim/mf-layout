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

import { APIApplyIDGetResponse } from '@/shared-modules/types';

// Apply : FAILED
// procedure1-3.responseBody: format1 { code, message: string }
// procedure4-6.responseBody: format2 { errorInfo: [{ errorCode, errorMessage }] }
//   procedure6: errorInfo with multiple items
// procedure7-9.responseBody: format3 { code, message: Array<{ msg, ... }> }
//   procedure9: message array with multiple items
export const dummyAPIApplyIDGetResponse: APIApplyIDGetResponse = {
  applyID: '9f3e1b2c4d',
  status: 'FAILED',
  startedAt: '2024-11-20T01:00:00Z',
  endedAt: '2024-11-20T01:09:00Z',
  procedures: [
    {
      operationID: 1,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      operation: 'connect',
      dependencies: [],
    },
    {
      operationID: 2,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      operation: 'connect',
      dependencies: [1],
    },
    {
      operationID: 3,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      operation: 'connect',
      dependencies: [2],
    },
    {
      operationID: 4,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      operation: 'disconnect',
      dependencies: [3],
    },
    {
      operationID: 5,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      operation: 'disconnect',
      dependencies: [4],
    },
    {
      operationID: 6,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      operation: 'disconnect',
      dependencies: [5],
    },
    {
      operationID: 7,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      operation: 'connect',
      dependencies: [6],
    },
    {
      operationID: 8,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      operation: 'connect',
      dependencies: [7],
    },
    {
      operationID: 9,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      operation: 'connect',
      dependencies: [8],
    },
  ],
  result: [
    // format1: { code, message: string }
    {
      operationID: 1,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 400,
      startedAt: '2024-11-20T01:01:00Z',
      endedAt: '2024-11-20T01:01:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      responseBody: {
        code: 'EF003BAS010',
        message: 'Your request is not supported for the specified target device.',
      },
    },
    {
      operationID: 2,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 400,
      startedAt: '2024-11-20T01:02:00Z',
      endedAt: '2024-11-20T01:02:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      },
      responseBody: {
        code: 'EF003BAS011',
        message: 'The operation failed due to a conflict with the current state of the resource.',
      },
    },
    {
      operationID: 3,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 400,
      startedAt: '2024-11-20T01:03:00Z',
      endedAt: '2024-11-20T01:03:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      },
      responseBody: {
        code: 'EF003BAS012',
        message: 'The device is not in a valid state to perform the requested operation.',
      },
    },
    // format2: { errorInfo: [{ errorCode, errorMessage }] }
    {
      operationID: 4,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 404,
      startedAt: '2024-11-20T01:04:00Z',
      endedAt: '2024-11-20T01:04:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      responseBody: {
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        errorInfo: [
          {
            errorCode: 'EF013BAS005',
            errorMessage: 'The specified Device ID is not found.',
          },
        ],
        infoTimestamp: '2026-04-07T07:51:02Z',
      },
    },
    {
      operationID: 5,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 404,
      startedAt: '2024-11-20T01:05:00Z',
      endedAt: '2024-11-20T01:05:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      },
      responseBody: {
        deviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        errorInfo: [
          {
            errorCode: 'EF013BAS006',
            errorMessage: 'The specified CPU ID is not found.',
          },
        ],
        infoTimestamp: '2026-04-07T07:52:02Z',
      },
    },
    {
      operationID: 6,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 404,
      startedAt: '2024-11-20T01:06:00Z',
      endedAt: '2024-11-20T01:06:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      },
      // format2: errorInfo with multiple items
      responseBody: {
        deviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
        errorInfo: [
          {
            errorCode: 'EF013BAS007',
            errorMessage: 'The specified resource is not available.',
          },
          {
            errorCode: 'EF013BAS008',
            errorMessage: 'The device is currently in use by another operation.',
          },
        ],
        infoTimestamp: '2026-04-07T07:53:02Z',
      },
    },
    // format3: { code, message: Array<{ msg, ... }> }
    {
      operationID: 7,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 422,
      startedAt: '2024-11-20T01:07:00Z',
      endedAt: '2024-11-20T01:07:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      responseBody: {
        code: 'EF003BAS012',
        message: [
          {
            ctx: {
              error: 'invalid group length in group 4: expected 12, found 13',
            },
            loc: ['path', 'sourceDeviceID'],
            msg: 'Input should be a valid UUID, invalid group length in group 4: expected 12, found 13',
            type: 'uuid_parsing',
            input: '38ac1c7f-7abc-469f-a313-7d2851c80d661',
          },
        ],
      },
    },
    {
      operationID: 8,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 422,
      startedAt: '2024-11-20T01:08:00Z',
      endedAt: '2024-11-20T01:08:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      },
      responseBody: {
        code: 'EF003BAS013',
        message: [
          {
            ctx: {
              error: "value is not a valid enumeration member; permitted: 'connect', 'disconnect'",
            },
            loc: ['body', 'action'],
            msg: "Input should be 'connect' or 'disconnect'",
            type: 'enum',
            input: 'attach',
          },
        ],
      },
    },
    {
      operationID: 9,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 422,
      startedAt: '2024-11-20T01:09:00Z',
      endedAt: '2024-11-20T01:09:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      },
      // format3: message array with multiple items
      responseBody: {
        code: 'EF003BAS014',
        message: [
          {
            ctx: {
              error: 'field required',
            },
            loc: ['body', 'destinationDeviceID'],
            msg: 'Field required',
            type: 'missing',
            input: null,
          },
          {
            ctx: {
              error: 'invalid group length in group 2: expected 4, found 5',
            },
            loc: ['body', 'destinationDeviceID'],
            msg: 'Input should be a valid UUID, invalid group length in group 2: expected 4, found 5',
            type: 'uuid_parsing',
            input: 'aa58210b-a0071-4fc8-9795-1b37907a87b8',
          },
        ],
      },
    },
  ],
};
