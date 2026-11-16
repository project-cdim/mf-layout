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

import { APPLayoutDesignDetail } from '@/types';

export const dummyAPPLayoutDesignDetail: APPLayoutDesignDetail = {
  designID: '100000000000000000000001',
  status: 'COMPLETED',
  startedAt: new Date('2024-04-14T03:34:56.789Z'),
  endedAt: new Date('2024-04-14T03:54:32.123Z'),
  nodes: [
    {
      services: [
        {
          id: 'service_A',
          requestInstanceID: 'request_instance_1',
        },
      ],
      device: {
        cpu: {
          deviceIDs: ['res10102'],
        },
        memory: {
          deviceIDs: ['res10203'],
        },
        storage: {
          deviceIDs: ['res10302'],
        },
        networkInterface: {
          deviceIDs: ['res10401'],
        },
      },
    },
    {
      services: [
        {
          id: 'service_B',
          requestInstanceID: 'request_instance_2',
        },
      ],
      device: {
        cpu: {
          deviceIDs: ['res11102'],
        },
        memory: {
          deviceIDs: ['res11203'],
        },
        storage: {
          deviceIDs: ['res11302'],
        },
        networkInterface: {
          deviceIDs: ['res11401'],
        },
      },
    },
  ],
  procedures: [
    {
      operationID: 1,
      operation: 'shutdown',
      dependencies: [],
      targetDevice: 'CPU(res10102)',
    },
    {
      operationID: 2,
      operation: 'disconnect',
      dependencies: [1],
      targetCPUID: 'res10102',
      targetDevice: 'Storage(res10302)',
    },
    {
      operationID: 3,
      operation: 'connect',
      dependencies: [1],
      targetCPUID: 'res10102',
      targetDevice: 'NetworkInterface(res10401)',
    },
    {
      operationID: 4,
      operation: 'boot',
      dependencies: [1, 2, 3],
      targetDevice: 'CPU(res10102)',
    },
  ],
  conditions: {
    energyCriteria: 6000,
    toleranceCriteria: {
      cpu: [
        {
          limit: { averageUseRate: 33.0 },
          devices: [
            { id: '0001', weights: 1.0, cores: 4 },
            { id: 'res10102', weights: 0.8, cores: 8 },
          ],
        },
        {
          limit: { averageUseRate: 55.000000000000256 },
          devices: [
            { id: '0001', weights: 1.0, cores: 4 },
            { id: '0011', weights: 1.2, cores: 2 },
            { id: '0021', weights: 0.5, cores: 16 },
            { id: 'res10101', weights: 0.75, cores: 6 },
            { id: 'res10109', weights: 0.25, cores: 12 },
            { id: 'res10110', weights: 0.1, cores: 4 },
            { id: 'res10111', weights: 0.05, cores: 8 },
            { id: 'res10112', weights: 0.01, cores: 2 },
            { id: 'res1101', weights: 1.25, cores: 24 },
            { id: 'res1102', weights: 1.5, cores: 16 },
            { id: 'res1103', weights: 0.2, cores: 8 },
          ],
        },
      ],
      memory: [
        {
          limit: { averageUseBytes: 4294967296.0 },
          devices: [
            { id: '1011', capacity: 8589934592 },
            { id: 'res10203', capacity: 4294967296 },
          ],
        },
        {
          limit: { averageUseBytes: 8589934592.0 },
          devices: [
            { id: '1011', capacity: 8589934592 },
            { id: '1021', capacity: 17179869184 },
            { id: 'res10201', capacity: 4294967296 },
            { id: 'res10202', capacity: 8589934592 },
            { id: 'res10203', capacity: 4294967296 },
            { id: 'res10204', capacity: 2147483648 },
            { id: 'res10205', capacity: 16777216 },
            { id: 'res10206', capacity: 33554432 },
            { id: 'res10207', capacity: 67108864 },
            { id: 'res10208', capacity: 134217728 },
            { id: 'res11201', capacity: 268435456 },
          ],
        },
      ],
    },
  },
};
