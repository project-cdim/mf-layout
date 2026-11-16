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

import { formatDuration } from '@/utils/parse';

describe('formatDuration', () => {
  test('When 0 seconds, returns (0s)', () => {
    expect(formatDuration(0)).toBe('(0s)');
  });

  test('When only seconds, it formats correctly', () => {
    expect(formatDuration(59)).toBe('(59s)');
  });

  test('Formats minutes and seconds correctly', () => {
    expect(formatDuration(61)).toBe('(1m1s)');
  });

  test('Formats hours and minutes correctly', () => {
    expect(formatDuration(60 * 60 + 60)).toBe('(1h1m)');
  });

  test('Formats days and hours correctly', () => {
    expect(formatDuration(24 * 60 * 60 + 60 * 60)).toBe('(1d1h)');
  });

  test('Formats 0 as the second value if it is not the first value', () => {
    expect(formatDuration(60 * 60)).toBe('(1h0m)');
  });

  test('Formats large durations correctly', () => {
    expect(formatDuration(1000000)).toBe('(11d13h)');
  });

  test('Ignores additional values beyond the first two units', () => {
    expect(formatDuration(90062)).toBe('(1d1h)');
  });
});
