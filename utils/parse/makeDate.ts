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

import { dateParse } from '@/utils/parse';

/**
 * Props for makeDate
 */
type StepStatus = {
  status: string;
  startDate: string;
  endDate?: string;
  durationSec: number;
};

/**
 * Returns a string of the start date or end date
 *
 * @param statusStep - Information about the status
 * @param currentLocale - The locale string used for date formatting.
 * @returns A string of the date
 */
export const makeDate = (statusStep: StepStatus | undefined, currentLocale: string): string => {
  if (!statusStep) return '';

  let date = '';
  // Possible statuses for design or apply
  const designApplyStatuses = ['IN_PROGRESS', 'CANCELING', 'FAILED', 'CANCELED', 'COMPLETED'];
  // Possible statuses for active
  const activeStatuses = ['ACTIVE', 'INACTIVE'];
  if (designApplyStatuses.includes(statusStep.status)) {
    if (statusStep.status === 'IN_PROGRESS' || statusStep.status === 'CANCELING') {
      date = dateParse(statusStep.startDate, currentLocale) + ' -';
    } else if (statusStep.endDate) {
      date = dateParse(statusStep.endDate, currentLocale);
    }
  } else if (activeStatuses.includes(statusStep.status)) {
    if (statusStep.status === 'ACTIVE') {
      date = dateParse(statusStep.startDate, currentLocale) + ' -';
    } else if (statusStep.endDate) {
      date = dateParse(statusStep.endDate, currentLocale);
    }
  }
  return date;
};
