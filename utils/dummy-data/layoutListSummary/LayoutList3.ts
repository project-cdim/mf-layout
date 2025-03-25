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

import { APILayoutListSummary } from '@/types';

// dummy data
export const layoutList: APILayoutListSummary = [
  // Design
  {
    designID: '636ddde1ba39547845db0628',
    status: {
      currentStep: 'apply',
      design: {
        status: 'CANCELING',
        startDate: '2023-07-22T00:00:00.000Z',
        durationSec: 20 * 60,
      },
    },
  },
  // Current configuration
  {
    designID: '786ddde1ba39547845db0628',
    status: {
      currentStep: 'active',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:00:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:00:00.000Z',
        durationSec: (45 - 20) * 60,
      },
      active: {
        status: 'ACTIVE',
        startDate: '2023-07-22T00:00:00.000Z',
        durationSec: 2 * 24 * 60 * 60,
      },
    },
  },
];
