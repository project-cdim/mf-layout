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

import { APIDeviceTypeLowerCamel } from './APIDeviceTypeLowerCamel';
import { APILayoutStatus } from './APILayoutListSummary';

/**
 * APILayoutDetail
 * Type definition for the response of GET /layout-detail?/{designID}
 */
export type APILayoutDetail = {
  designID: string;
  status: APILayoutStatus;
  design: {
    node?: {
      nodeID?: string;
      service: {
        serviceId: string;
        id: string;
      }[];
      device: Record<APIDeviceTypeLowerCamel, { deviceID: string[] }>;
    }[];
  };
  /** Policy */
  conditions?: {
    toleranceCriteria?: {
      cpu: {
        device: string[];
        limit: {
          averageUseRate: number;
        };
      }[];
      memory: {
        device: string[];
        limit: {
          averageUseBytes: number;
        };
      }[];
    };
    energyCriteria?: number;
  };
  /** Migration procedure */
  procedure: {
    operationId: number;
    operation: 'boot' | 'shutdown' | 'connect' | 'disconnect';
    targetCpuId: string; // Example: '3B4EBEEA-B6DD-45DA-8C8A-2CA2F8F728D6'
    targetDeviceId?: string; // Example: '895DFB43-68CD-41D6-8996-EAC8D1EA1E3F'
    dependencies: number[];
    applyResults?: {
      // Reference to the response of /layout-apply
      status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELED';
      endDate?: string; // Available for statuses other than IN_PROGRESS
      uri: string;
      method: string;
      queryParameter: string;
      requestBody: {
        hostCpuId: string;
        targetDeviceId: string;
      };
      statusCode: number; // HTTP status code
      responseBody: {
        description: string;
        code: string;
        message: string;
      };
    };
  }[];
  //   rollbackProcedure: any; // Used only for cancellation. Migration procedure to revert the executed steps to the previous state
};
