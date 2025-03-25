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

// Apply : COMPLETED, operations: 15
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
    {
      operation: 'connect',
      operationID: 2,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [1],
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
    },
    {
      operation: 'connect',
      operationID: 3,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [2],
      targetDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
    },
    {
      operation: 'connect',
      operationID: 4,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [3],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac51fc',
    },
    { operation: 'boot', operationID: 5, dependencies: [4], targetDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2' },
    {
      operation: 'shutdown',
      operationID: 6,
      dependencies: [5],
      targetDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
    },
    {
      operation: 'disconnect',
      operationID: 7,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [6],
      targetDeviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
    },
    {
      operation: 'disconnect',
      operationID: 8,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [7],
      targetDeviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
    },
    {
      operation: 'disconnect',
      operationID: 9,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [8],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac51fc',
    },
    {
      operation: 'disconnect',
      operationID: 10,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [9],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac5110',
    },
    {
      operation: 'disconnect',
      operationID: 11,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [10],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac5111',
    },
    {
      operation: 'disconnect',
      operationID: 12,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [11],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac5112',
    },
    {
      operation: 'disconnect',
      operationID: 13,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [12],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac5113',
    },
    {
      operation: 'disconnect',
      operationID: 14,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [13],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac5114',
    },
    {
      operation: 'disconnect',
      operationID: 15,
      targetCPUID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      dependencies: [14],
      targetDeviceID: '8190c071-3f5f-4862-b741-b42591ac5115',
    },
  ],
  applyID: 'dummy006',
  applyResult: [
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 1,
      requestBody: {
        action: 'connect',
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
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 2,
      requestBody: { action: 'connect', deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1' },
      responseBody: {
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
      getInformation: { responseBody: { powerState: 'On' } },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 3,
      requestBody: { action: 'connect', deviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2' },
      responseBody: {
        deviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
      getInformation: { responseBody: { powerState: 'On' } },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 4,
      requestBody: { action: 'connect', deviceID: '8190c071-3f5f-4862-b741-b42591ac51fc' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac51fc',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/devices/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/power',
      method: 'PUT',
      status: 'COMPLETED',
      isOSBoot: {
        uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/is-os-ready',
        method: 'GET',
        statusCode: 200,
        responseBody: { status: true, IPAddress: '192.168.122.11' },
        queryParameter: { timeOut: 2 },
      },
      statusCode: 200,
      operationID: 5,
      requestBody: { action: 'on' },
      responseBody: { deviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2' },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/os-shutdown',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 6,
      responseBody: { CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2' },
      getInformation: { responseBody: { powerState: 'Off' } },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 7,
      requestBody: { action: 'disconnect', deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1' },
      responseBody: {
        deviceID: '388e64e3-efa7-484c-b63c-28bf1709d6c1',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
      getInformation: { responseBody: { powerState: 'Off' } },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 8,
      requestBody: { action: 'disconnect', deviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2' },
      responseBody: {
        deviceID: '33f19666-68b3-4ed7-a9a8-d046f0879ff2',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
      getInformation: { responseBody: { powerState: 'Off' } },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 9,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac51fc' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac51fc',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 10,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac5110' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac5110',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 11,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac5111' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac5111',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 12,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac5112' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac5112',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 13,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac5113' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac5113',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 14,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac5114' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac5114',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
    {
      uri: 'http://10.26.196.219:8000/cdim/api/v1/cpu/b477ea1c-db3d-48b3-9725-b0ce6e25efc2/aggregations',
      method: 'PUT',
      status: 'COMPLETED',
      statusCode: 200,
      operationID: 15,
      requestBody: { action: 'disconnect', deviceID: '8190c071-3f5f-4862-b741-b42591ac5115' },
      responseBody: {
        deviceID: '8190c071-3f5f-4862-b741-b42591ac5115',
        CPUDeviceID: 'b477ea1c-db3d-48b3-9725-b0ce6e25efc2',
      },
    },
  ],
  startedAt: '2024-07-17T02:43:51Z',
  endedAt: '2024-07-17T02:45:45Z',
};
