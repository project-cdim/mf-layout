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

import { makeDate } from '@/utils/parse';

describe('makeDate', () => {
  const baseDate = new Date('2023-08-14T10:00:00');
  const endDate = new Date('2023-08-20T12:00:00');

  test('Within designApplyStatuses, if the status is IN_PROGRESS or CANCELING, it returns the start date + "-"', () => {
    const locale = 'en-US';
    expect(
      makeDate(
        {
          status: 'IN_PROGRESS',
          startDate: `${baseDate.toISOString()}`,
          durationSec: 0,
        },
        locale
      )
    ).toBe(`${baseDate.toLocaleString(locale)} -`);
    expect(
      makeDate(
        {
          status: 'CANCELING',
          startDate: `${baseDate.toISOString()}`,
          durationSec: 0,
        },
        locale
      )
    ).toBe(`${baseDate.toLocaleString(locale)} -`);
  });

  test('Within designApplyStatuses, if the end date exists, it returns the end date', () => {
    const locale = 'ja-JP';
    expect(
      makeDate(
        {
          status: 'COMPLETED',
          startDate: `${baseDate.toISOString()}`,
          endDate: `${endDate.toISOString()}`,
          durationSec: 0,
        },
        locale
      )
    ).toBe(endDate.toLocaleString(locale));
  });

  test('Within activeStatuses, if the status is ACTIVE, it returns the start date + "-"', () => {
    const locale = 'fr-FR';
    expect(
      makeDate(
        {
          status: 'ACTIVE',
          startDate: `${baseDate.toISOString()}`,
          durationSec: 0,
        },
        locale
      )
    ).toBe(`${baseDate.toLocaleString(locale)} -`);
  });

  test('Within activeStatuses, if the end date exists, it returns the end date', () => {
    const locale = 'de-DE';
    expect(
      makeDate(
        {
          status: 'INACTIVE',
          startDate: `${baseDate.toISOString()}`,
          endDate: `${endDate.toISOString()}`,
          durationSec: 0,
        },
        locale
      )
    ).toBe(endDate.toLocaleString(locale));
  });

  test('For other statuses, it returns an empty string', () => {
    expect(
      makeDate(
        {
          status: 'UNKNOWN_STATUS',
          startDate: `${baseDate.toISOString()}`,
          durationSec: 0,
        },
        'en-US'
      )
    ).toBe('');
  });

  test('When passed undefined, it returns an empty string', () => {
    expect(makeDate(undefined, 'en-US')).toBe('');
  });
});
