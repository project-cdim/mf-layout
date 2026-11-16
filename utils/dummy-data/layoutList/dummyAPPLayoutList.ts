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

import { APPLayoutList } from '@/types';

export const dummyAPPLayoutList: APPLayoutList[] = [
  {
    id: 'afoi8ds0-sfa1-rskg',
    status: 'IN_PROGRESS',
    startedAt: new Date('2024/03/02 11:11:11'),
    endedAt: undefined,
  },
  {
    id: 'bfoi8ds0-sfa1-rskg',
    status: 'IN_PROGRESS',
    startedAt: new Date('2024/03/02 18:31:14'),
    endedAt: undefined,
  },
  {
    id: 'bifo123s-sfja-2131',
    status: 'FAILED',
    startedAt: new Date('2024/03/03 12:00:01'),
    endedAt: new Date('2024/03/04 17:24:28'),
  },
  {
    id: 'c131sijf-2122-dfa',
    status: 'COMPLETED',
    startedAt: new Date('2024/03/03 11:23:22'),
    endedAt: new Date('2024/03/23 13:24:28'),
  },
  {
    id: 'diso123s-sfja-2131',
    status: 'CANCELING',
    startedAt: new Date('2024/03/03 12:00:01'),
    endedAt: new Date('2024/03/23 19:29:28'),
  },
  {
    id: 'eif1123s-sfja-2131',
    status: 'CANCELED',
    startedAt: new Date('2024/03/03 12:00:01'),
    endedAt: new Date('2024/03/23 21:24:28'),
  },
];
