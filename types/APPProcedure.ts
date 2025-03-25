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

/** Type definition for a list of migration procedures */

export type Operation = 'boot' | 'shutdown' | 'connect' | 'disconnect';

export type APPProcedure = {
  /** Procedure ID */
  operationID: number;
  /** Operation type */
  operation: Operation;
  /** Host CPU ID */
  hostCpuID: string;
  /** Target device ID */
  targetDeviceID: string;
  /** List of procedure IDs that have dependencies (operationID, ...) */
  dependencies: string;
  /** Execution result (status, endDate) */
  result: string;
};
