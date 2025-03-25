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

import { APPLayoutApplyList } from '@/shared-modules/types';

export const dummyAPPLayoutApplyList: APPLayoutApplyList[] = [
  {
    id: 'afoi8ds0-sfa1-rsky',
    status: 'IN_PROGRESS',
    startedAt: new Date('2024/03/02 11:11:11'),
    endedAt: undefined,
    rollbackStatus: undefined,
  },
  {
    id: 'bfoi8ds0-sfa1-rskg',
    status: 'IN_PROGRESS',
    startedAt: new Date('2024/03/02 18:31:14'),
    endedAt: undefined,
    rollbackStatus: undefined,
  },
  {
    id: 'bifo123s-sfja-213t',
    status: 'FAILED',
    startedAt: new Date('2024/03/03 12:03:01'),
    endedAt: new Date('2024/03/04 17:24:28'),
    rollbackStatus: undefined,
  },
  {
    id: 'c131sijf-2122-dfa',
    status: 'COMPLETED',
    startedAt: new Date('2024/03/03 11:23:22'),
    endedAt: new Date('2024/03/23 13:24:28'),
    rollbackStatus: undefined,
  },
  {
    id: 'diso123s-sfja-2131',
    status: 'CANCELING',
    startedAt: new Date('2024/03/03 13:00:01'),
    // endedAt: new Date('2024/03/23 19:29:28'),
    endedAt: undefined,
    rollbackStatus: undefined,
  },
  {
    id: 'eif1123s-sfja-213a',
    status: 'CANCELED',
    startedAt: new Date('2024/03/03 12:00:01'),
    endedAt: new Date('2024/03/23 21:24:28'),
    rollbackStatus: 'COMPLETED',
  },
  {
    id: 'eif1123s-sfja-2132',
    status: 'CANCELED',
    startedAt: new Date('2024/03/03 12:01:01'),
    endedAt: new Date('2024/03/23 21:24:28'),
    rollbackStatus: undefined,
  },
  {
    id: 'eif1123s-sfja-2137',
    status: 'SUSPENDED',
    startedAt: new Date('2024/03/03 12:02:01'),
    endedAt: undefined,
    rollbackStatus: undefined,
  },
  {
    id: 'afoi8ds0-sfa1-stl3',
    status: 'CANCELED',
    startedAt: new Date('2024/03/02 22:11:11'),
    endedAt: undefined,
    rollbackStatus: 'IN_PROGRESS',
  },
  {
    id: 'bfoi8ds0-sfa1-stl6',
    status: 'CANCELED',
    startedAt: new Date('2024/03/02 19:32:15'),
    endedAt: undefined,
    rollbackStatus: 'SUSPENDED',
  },
  {
    id: 'cfoi8ds0-sfa1-stl8',
    status: 'CANCELED',
    startedAt: new Date('2024/03/02 19:32:15'),
    endedAt: undefined,
    rollbackStatus: 'FAILED',
  },
];
