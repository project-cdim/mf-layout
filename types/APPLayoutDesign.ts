/*
 * Copyright 2025-2026 NEC Corporation.
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

import { APIresource, ProcedureOperation } from '@/shared-modules/types';
import { APINode, DesignStatus } from '.';

/** Device information for the node layout, including resource-level detection and maintenance state */
export type APPLayoutDesignDevice = APIresource['device'] & {
  /** Whether the device is detected (from APIresource.detected) */
  detected: boolean;
  /** Whether the device is available, i.e. not under maintenance (from APIresource.deviceUnit.annotation.systemItems.available) */
  available: boolean;
};

/** Response body for retrieving the layout design status by ID */
export type APPLayoutDesignDetail = {
  designID: string;
  status: DesignStatus;
  cause?: string;
  startedAt: Date;
  endedAt?: Date;
  // Node configuration
  // nodedata: // { nodes, edges }
  nodes?: APINode[];
  /** Migration procedure */
  procedures?: APPProcedure[];
  /** Migration conditions */
  conditions?: APPConditions;
};

type APPConditions = {
  energyCriteria?: number;
  toleranceCriteria?: {
    cpu: {
      limit: { averageUseRate: number };
      devices: APPToleranceCriteriaCPUList[];
    }[];
    memory: {
      limit: { averageUseBytes: number };
      devices: APPToleranceCriteriaMemoryList[];
    }[];
  };
};

/** Migration procedure */
export type APPProcedure = {
  operationID: number;
  operation: ProcedureOperation;
  targetCPUID?: string;
  targetDevice?: string;
  dependencies: number[];
};

/** Type definition of CPU tolerance criteria table for layout design details */
export type APPToleranceCriteriaCPUList = {
  id: string;
  weights?: number;
  cores?: number;
};

/** Type definition of Memory tolerance criteria table for layout design details */
export type APPToleranceCriteriaMemoryList = {
  id: string;
  capacity?: number;
};
