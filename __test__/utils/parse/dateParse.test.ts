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

describe('dateParse', () => {
  test('Returns empty when undefined', () => {
    expect(dateParse(undefined, 'en')).toBe('');
  });

  test('Returns empty when empty', () => {
    expect(dateParse('', 'en')).toBe('');
  });

  test('That the date is parsed and a string is returned', () => {
    const mockDate = '2023-07-29T10:29:45.000Z';
    const parsedDate = new Date(Date.parse(mockDate));
    const expectedDateStr = parsedDate.toLocaleString();

    expect(dateParse(mockDate, 'en')).toBe(expectedDateStr);
  });
});
