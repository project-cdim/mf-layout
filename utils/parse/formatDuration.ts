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

/**
 * Converts the number of elapsed seconds into a format of days, hours, minutes, and seconds.
 *
 * @remarks
 * The representation of days, hours, minutes, and seconds is limited to two units. Example: (12d34h), (3h41m)
 * Zero is displayed if it's not the leading unit. Example: (35m0s)
 *
 * @param seconds The number of elapsed seconds
 * @returns The converted string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds === 0) {
    return '(0s)';
  }
  // Units and their corresponding values in seconds
  const SECOND_OF_MINUTE = 60;
  const MINUTE_OF_HOUR = 60;
  const HOUR_OF_DAY = 24;
  const SECOND_OF_HOUR = MINUTE_OF_HOUR * SECOND_OF_MINUTE;
  const SECOND_OF_DAY = HOUR_OF_DAY * SECOND_OF_HOUR;
  const units = [
    { label: 'd', value: SECOND_OF_DAY },
    { label: 'h', value: SECOND_OF_HOUR },
    { label: 'm', value: 60 },
    { label: 's', value: 1 },
  ] as const;

  let remaining = seconds;
  const results: string[] = [];

  for (const unit of units) {
    const value = Math.floor(remaining / unit.value);
    if (value > 0 || results.length > 0) {
      // Do not push 0 at the beginning
      results.push(`${value}${unit.label}`);
      remaining -= value * unit.value;
    }
    if (results.length >= 2) {
      // Exit after obtaining two results
      break;
    }
  }
  return `(${results.join('')})`;
};
