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

import { APILayoutDesignList } from '@/types';

export const dummyAPILayoutDesignList: APILayoutDesignList = {
  count: 6,
  totalCount: 10,
  designs: [
    {
      id: 'afoi8ds0-sfa1-rskg',
      status: 'IN_PROGRESS',
      requestID: '1-8',
      startedAt: '2024/03/02 11:11:11',
      endedAt: '',
      design: {},
      conditions: {},
      procedures: [],
    },
    {
      id: 'bfoi8ds0-sfa1-rskg',
      status: 'IN_PROGRESS',
      requestID: '1-8',
      startedAt: '2024/03/02 18:31:14',
      endedAt: '',
      design: {},
      conditions: {},
      procedures: [],
    },
    {
      id: 'bifo123s-sfja-2131',
      status: 'FAILED',
      requestID: '1-10',
      startedAt: '2024/03/03 12:00:01',
      endedAt: '2024/03/04 17:24:28',
      design: {},
      conditions: {},
      procedures: [],
    },
    {
      id: 'c131sijf-2122-dfa',
      status: 'COMPLETED',
      requestID: '2-1',
      startedAt: '2024/03/03 11:23:22',
      endedAt: '2024/03/23 13:24:28',
      design: {},
      conditions: {},
      procedures: [],
    },
    {
      id: 'diso123s-sfja-2131',
      status: 'CANCELING',
      requestID: '2-2',
      startedAt: '2024/03/03 12:00:01',
      endedAt: '2024/03/23 19:29:28',
      design: {},
      conditions: {},
      procedures: [],
    },
    {
      id: 'eif1123s-sfja-2131',
      status: 'CANCELED',
      requestID: '2-3',
      startedAt: '2024/03/03 12:00:01',
      endedAt: '2024/03/23 21:24:28',
      design: {},
      conditions: {},
      procedures: [],
    },
  ],
};
