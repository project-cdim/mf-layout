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

import { useLayoutApplyDetail } from '@/utils/hooks';

// Apply : In Progress + Resume Requested
export const dummyUseLayoutApplyDetail: ReturnType<typeof useLayoutApplyDetail> = {
  data: {
    applyID: '6aeccff6be',
    apply: {
      status: 'IN_PROGRESS',
      startedAt: new Date('2024-07-31T06:50:16.000Z'),
      resumedAt: new Date('2024-07-31T06:51:34.000Z'),
    },
  },
  error: {
    layout: undefined,
    resource: undefined,
  },
  isValidating: {
    layout: false,
    resource: false,
  },
  mutate: () => {},
};
