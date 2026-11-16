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
 * Parses the given API date string and returns a formatted date string based on the current locale.
 * @param apiDate - The API date string to parse.
 * @param currentLocale - The current locale to use for formatting the date.
 * @returns The formatted date string.
 */
export const dateParse = (apiDate: string | undefined, currentLocale: string): string => {
  if (!apiDate) return '';

  const date = new Date(Date.parse(apiDate));
  const displayDate = date.toLocaleString(currentLocale);
  return displayDate;
};
