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

/**
 * Policy-related constant values
 */

/**
 * Node Configuration Policy related limits
 * Used for hardware connection constraints
 */
export const NODE_CONFIGURATION_POLICY = {
  /** Minimum length for policy title */
  TITLE_MIN_LENGTH: 1,
  /** Maximum length for policy title */
  TITLE_MAX_LENGTH: 100,
  /** Minimum hardware connection limit */
  HARDWARE_CONNECTION_MIN_LIMIT: 1,
  /** Maximum hardware connection limit */
  HARDWARE_CONNECTION_MAX_LIMIT: 1000,
} as const;

/**
 * System Operation Policy related limits
 * Used for resource usage threshold constraints
 */
export const SYSTEM_OPERATION_POLICY = {
  /** Minimum length for policy title */
  TITLE_MIN_LENGTH: 1,
  /** Maximum length for policy title */
  TITLE_MAX_LENGTH: 100,
  /** Minimum usage threshold percentage */
  USAGE_THRESHOLD_MIN_PERCENTAGE: 0,
  /** Maximum usage threshold percentage */
  USAGE_THRESHOLD_MAX_PERCENTAGE: 100,
} as const;
