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

import { APILayoutDetail, APILayoutStatus } from '@/types';

// If the status is not COMPLETED,
// (an empty object is returned for design and conditions,
// and an empty list is returned for procedures)

const LayoutStatus: APILayoutStatus = {
  currentStep: 'end',
  // Design
  design: {
    status: 'IN_PROGRESS',
    startDate: '2023-07-29T00:09:18.000Z',
    durationSec: 20 * 60,
  },
};

/**
 * APILayoutDetail
 * Type definition for the response of GET /layout-detail?/{designID}
 */
export const LayoutDetail: APILayoutDetail = {
  designID: '636ddde1ba39547845db0628',
  status: LayoutStatus,
  design: {},
  /** Constraints */
  conditions: {},
  /** Migration procedures */
  procedure: [],
};
