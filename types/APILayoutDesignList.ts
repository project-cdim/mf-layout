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

/** Design status */
export const DesignStatuses = ['IN_PROGRESS', 'FAILED', 'COMPLETED', 'CANCELING', 'CANCELED'] as const;
export type DesignStatus = (typeof DesignStatuses)[number];
export type DesignStatusLabelJa = '設計中' | '設計失敗' | '設計完了' | '設計中止中' | '設計中止';
export type DesignStatusLabelKey = 'In Progress' | 'Failed' | 'Completed' | 'Canceling' | 'Canceled';

/** Type definition for the response of GET /layout-designs to retrieve the design result list */
export type APILayoutDesignList = {
  count: number;
  designs: APIDesignItem[];
};

type APIDesignItem = {
  id: string;
  status: DesignStatus;
  requestID: string;
  startedAt: string;
  endedAt: string;
  design: {
    nodes?: APINode[];
  };
  conditions: APIConditions;
  procedures: APIProcedure[];
};

type APINode = {
  services: {
    id: string;
    requestInstanceID: string;
  }[];
  device: {
    cpu: APIDeviceIDs;
    memory: APIDeviceIDs;
    storage: APIDeviceIDs;
    gpu: APIDeviceIDs;
    fpga: APIDeviceIDs;
    networkInterface: APIDeviceIDs;
    virtualMedia: APIDeviceIDs;
    graphicController: APIDeviceIDs;
    accelerator: APIDeviceIDs;
    dsp: APIDeviceIDs;
  };
};

type APIDeviceIDs = {
  deviceIDs: string[];
};

type APIConditions = {
  toleranceCriteria?: {
    cpu: {
      deviceIDs: string[];
      limit: { averageUseRate: number };
    }[];
    memory: {
      deviceIDs: string[];
      limit: { averageUseBytes: number };
    }[];
  };
  energyCriteria?: number;
};

type APIProcedure = {
  operationID: number;
  operation: string;
  targetCPUID: string;
  targetDeviceID: string;
  dependencies: number[];
};
