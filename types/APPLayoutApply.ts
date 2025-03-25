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

import { ApplyProcedureStatus, ApplyStatus, ProcedureOperation, RollbackStatus } from '@/shared-modules/types';

export type ApplyAction = 'Cancel' | 'Rollback' | 'Forced Termination' | 'Resume';

/** Response body for retrieving the layout apply status by ID */
export type APPLayoutApplyDetail = {
  applyID: string;
  apply: {
    status: ApplyStatus;
    startedAt: Date;
    suspendedAt?: Date;
    resumedAt?: Date;
    canceledAt?: Date;
    endedAt?: Date;
  };
  rollback?: {
    status?: RollbackStatus;
    startedAt?: Date;
    suspendedAt?: Date;
    resumedAt?: Date;
    canceledAt?: Date;
    endedAt?: Date;
  };
  procedures?: APPProcedureWithResult[];
};

/** Migration procedure */
export type APPProcedureWithResult = {
  operationID: number;
  targetCPUID?: string;
  targetDevice: string;
  apply: ProcedureExecution;
  rollback?: ProcedureExecution;
};
export type ProcedureExecution = {
  operation: ProcedureOperation;
  dependencies: number[];
  status?: ApplyProcedureStatus;
  error?: {
    code: string | number;
    message: string;
  };
};
