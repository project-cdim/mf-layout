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

import { STATUS_TO_LABEL } from '@/utils/constant';

describe('STATUS_TO_LABEL', () => {
  test('Correctly converts status to label', () => {
    expect(STATUS_TO_LABEL['IN_PROGRESS']).toBe('In Progress');
    expect(STATUS_TO_LABEL['FAILED']).toBe('Failed');
    expect(STATUS_TO_LABEL['COMPLETED']).toBe('Completed');
    expect(STATUS_TO_LABEL['CANCELING']).toBe('Canceling');
    expect(STATUS_TO_LABEL['CANCELED']).toBe('Canceled.completed');
    expect(STATUS_TO_LABEL['SUSPENDED']).toBe('Suspended.status');
  });
});
