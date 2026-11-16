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
  // Design Configuration
  {
    designID: '636ddde1ba39547845db0628',
    status: {
      currentStep: 'design',
      design: {
        status: 'IN_PROGRESS',
        startDate: '2023-07-29T00:00:00.000Z',
        durationSec: 23 * 60,
      },
    },
  },
  // Current Configuration
  {
    designID: 'testid11',
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
  // History 5 (Design Canceled)
  {
    designID: 'testid12',
    status: {
      currentStep: 'end',
      design: {
        status: 'CANCELED',
        startDate: '2023-07-20T10:00:00.000Z',
        endDate: '2023-07-20T12:20:12.000Z',
        durationSec: 2 * 60 * 60 + 20 * 60 + 12,
      },
    },
  },
  // History 4 (Apply Failed)
  {
    designID: 'testid13',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:00:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 3 (Used)
  {
    designID: 'testid14',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:00:00.000Z',
        endDate: '2023-05-30T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:20:30.000Z',
        endDate: '2023-05-30T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
      active: {
        status: 'INACTIVE',
        startDate: '2023-06-01T00:10:30.000Z',
        endDate: '2023-07-26T00:45:30.000Z',
        durationSec: 4754100,
      },
    },
  },
  // History 2 (Apply Canceled)
  {
    designID: 'testid15',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'CANCELED',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 1 (Design Failed)
  {
    designID: 'testid16',
    status: {
      currentStep: 'end',
      design: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-12-30T00:00:00.000Z',
        endDate: '2023-12-31T23:59:00.000Z',
        durationSec: 2 * 24 * 60 * 60 - 1 * 60 * 60 + 59,
      },
    },
  },
  // History 5 (Design Canceled)
  {
    designID: 'testid17',
    status: {
      currentStep: 'end',
      design: {
        status: 'CANCELED',
        startDate: '2023-07-20T10:00:00.000Z',
        endDate: '2023-07-20T12:20:12.000Z',
        durationSec: 2 * 60 * 60 + 20 * 60 + 12,
      },
    },
  },
  // History 4 (Apply Failed)
  {
    designID: 'testid18',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:00:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 3 (Used)
  {
    designID: 'testid19',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:00:00.000Z',
        endDate: '2023-05-30T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:20:30.000Z',
        endDate: '2023-05-30T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
      active: {
        status: 'INACTIVE',
        startDate: '2023-06-01T00:10:30.000Z',
        endDate: '2023-07-26T00:45:30.000Z',
        durationSec: 4754100,
      },
    },
  },
  // History 2 (Apply Canceled)
  {
    designID: 'testid20',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'CANCELED',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 1 (Design Failed)
  {
    designID: 'testid',
    status: {
      currentStep: 'end',
      design: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-12-30T00:00:00.000Z',
        endDate: '2023-12-31T23:59:00.000Z',
        durationSec: 2 * 24 * 60 * 60 - 1 * 60 * 60 + 59,
      },
    },
  },
  // History 5 (Design Canceled)
  {
    designID: 'testid1',
    status: {
      currentStep: 'end',
      design: {
        status: 'CANCELED',
        startDate: '2023-07-20T10:00:00.000Z',
        endDate: '2023-07-20T12:20:12.000Z',
        durationSec: 2 * 60 * 60 + 20 * 60 + 12,
      },
    },
  },
  // History 4 (Apply Failed)
  {
    designID: 'testid2',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:00:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 3 (Used)
  {
    designID: 'testid3',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:00:00.000Z',
        endDate: '2023-05-30T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:20:30.000Z',
        endDate: '2023-05-30T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
      active: {
        status: 'INACTIVE',
        startDate: '2023-06-01T00:10:30.000Z',
        endDate: '2023-07-26T00:45:30.000Z',
        durationSec: 4754100,
      },
    },
  },
  // History 2 (Apply Canceled)
  {
    designID: 'testid4',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'CANCELED',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 1 (Design Failed)
  {
    designID: 'testid5',
    status: {
      currentStep: 'end',
      design: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-12-30T00:00:00.000Z',
        endDate: '2023-12-31T23:59:00.000Z',
        durationSec: 2 * 24 * 60 * 60 - 1 * 60 * 60 + 59,
      },
    },
  },
  // History 5 (Design Canceled)
  {
    designID: 'testid6',
    status: {
      currentStep: 'end',
      design: {
        status: 'CANCELED',
        startDate: '2023-07-20T10:00:00.000Z',
        endDate: '2023-07-20T12:20:12.000Z',
        durationSec: 2 * 60 * 60 + 20 * 60 + 12,
      },
    },
  },
  // History 4 (Apply Failed)
  {
    designID: 'testid7',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:00:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 3 (Used)
  {
    designID: 'testid8',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:00:00.000Z',
        endDate: '2023-05-30T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'COMPLETED',
        startDate: '2023-05-30T00:20:30.000Z',
        endDate: '2023-05-30T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
      active: {
        status: 'INACTIVE',
        startDate: '2023-06-01T00:10:30.000Z',
        endDate: '2023-07-26T00:45:30.000Z',
        durationSec: 4754100,
      },
    },
  },
  // History 2 (Apply Canceled)
  {
    designID: 'testid9',
    status: {
      currentStep: 'end',
      design: {
        status: 'COMPLETED',
        startDate: '2023-07-22T00:00:00.000Z',
        endDate: '2023-07-22T00:20:00.000Z',
        durationSec: 20 * 60,
      },
      apply: {
        status: 'CANCELED',
        startDate: '2023-07-22T00:20:30.000Z',
        endDate: '2023-07-22T00:45:30.000Z',
        durationSec: (45 - 20) * 60,
      },
    },
  },
  // History 1 (Design Failed)
  {
    designID: 'testid10',
    status: {
      currentStep: 'end',
      design: {
        status: 'FAILED',
        code: 'E40005',
        message: 'Failed to execute LayoutApply',
        startDate: '2023-12-30T00:00:00.000Z',
        endDate: '2023-12-31T23:59:00.000Z',
        durationSec: 2 * 24 * 60 * 60 - 1 * 60 * 60 + 59,
      },
    },
  },
];
