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
// responseBody contains only non-standard shapes (outside format1/2/3)
// including empty object and missing responseBody patterns,
// to verify unknown fallback handling in extractError.
export const dummyAPIApplyIDGetResponse: APIApplyIDGetResponse = {
  applyID: 'b2f5a1c93e',
  status: 'FAILED',
  startedAt: '2024-12-01T10:00:00Z',
  endedAt: '2024-12-01T10:11:00Z',
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
      operation: 'disconnect',
      dependencies: [8],
    },
    {
      operationID: 10,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      operation: 'connect',
      dependencies: [9],
    },
  ],
  result: [
    {
      operationID: 1,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 500,
      startedAt: '2024-12-01T10:01:00Z',
      endedAt: '2024-12-01T10:01:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      // unknown shape: nested object with custom keys
      responseBody: {
        detail: {
          reason: 'internal_error',
          hint: 'retry_later',
        },
      },
    },
    {
      operationID: 2,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 422,
      startedAt: '2024-12-01T10:02:00Z',
      endedAt: '2024-12-01T10:02:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      },
      // unknown shape: message is object (not string/array)
      responseBody: {
        code: 'X-2001',
        message: {
          text: 'unexpected object payload',
        },
      },
    },
    {
      operationID: 3,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 404,
      startedAt: '2024-12-01T10:03:00Z',
      endedAt: '2024-12-01T10:03:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      },
      // unknown shape: errorInfo exists but is not an array
      responseBody: {
        errorInfo: {
          errorCode: 'X-3001',
          errorMessage: 'errorInfo is object, not array',
        },
      },
    },
    {
      operationID: 4,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 422,
      startedAt: '2024-12-01T10:04:00Z',
      endedAt: '2024-12-01T10:04:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      // unknown shape: message array is empty
      responseBody: {
        code: 'X-4001',
        message: [],
      },
    },
    {
      operationID: 5,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 422,
      startedAt: '2024-12-01T10:05:00Z',
      endedAt: '2024-12-01T10:05:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      },
      // unknown shape: message array has no msg field
      responseBody: {
        code: 'X-5001',
        message: [
          {
            type: 'validation_error',
            description: 'msg key is missing',
          },
        ],
      },
    },
    {
      operationID: 6,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 500,
      startedAt: '2024-12-01T10:06:00Z',
      endedAt: '2024-12-01T10:06:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      },
      // unknown shape: array itself as responseBody
      responseBody: [
        {
          key: 'unexpected_array_root',
          value: 1,
        },
      ],
    },
    {
      operationID: 7,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 409,
      startedAt: '2024-12-01T10:07:00Z',
      endedAt: '2024-12-01T10:07:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      // unknown shape: getInformation-like structure in main responseBody
      responseBody: {
        powerState: 'ON',
        info: 'this shape is not format1/2/3 for main responseBody',
      },
    },
    {
      operationID: 8,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 500,
      startedAt: '2024-12-01T10:08:00Z',
      endedAt: '2024-12-01T10:08:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
      },
      // unknown shape: isOSBoot/getInformation also set to unknown objects
      isOSBoot: {
        uri: 'http://192.168.1.11:8007/redfish/v1/Systems/1',
        method: 'GET',
        statusCode: 500,
        responseBody: {
          bootResult: {
            state: 'unknown',
            reasonCode: 901,
          },
        },
      },
      getInformation: {
        responseBody: {
          telemetry: {
            observedAt: '2024-12-01T10:08:20Z',
            values: [1, 2, 3],
          },
        },
      },
    },
    {
      operationID: 9,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 500,
      startedAt: '2024-12-01T10:09:00Z',
      endedAt: '2024-12-01T10:09:30Z',
      requestBody: {
        action: 'disconnect',
        destinationDeviceID: 'aa58210b-a007-4fc8-9795-1b37907a87b8',
      },
      // empty object pattern
      responseBody: {},
    },
    {
      operationID: 10,
      status: 'FAILED',
      uri: 'http://192.168.1.11:8007/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      statusCode: 500,
      startedAt: '2024-12-01T10:10:00Z',
      endedAt: '2024-12-01T10:10:30Z',
      requestBody: {
        action: 'connect',
        destinationDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
      },
      // missing responseBody pattern
    },
  ],
};
