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

import { ApplyStatus, ApplyStatusLabelKey, RollbackStatus, RollbackStatusLabelKey } from '@/shared-modules/types';

import { DesignStatus, DesignStatusLabelKey } from '@/types';

export const STATUS_TO_LABEL: {
  [key in DesignStatus | ApplyStatus | RollbackStatus]:
    | DesignStatusLabelKey
    | ApplyStatusLabelKey
    | RollbackStatusLabelKey;
} = {
  IN_PROGRESS: 'In Progress',
  FAILED: 'Failed',
  COMPLETED: 'Completed',
  CANCELING: 'Canceling',
  CANCELED: 'Canceled.completed',
  SUSPENDED: 'Suspended.status',
};
