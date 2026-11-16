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

'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';
import { useTranslations } from 'next-intl';

import { ApplyStatuses, RollbackStatuses } from '@/shared-modules/constant';
import {
  APPLayoutApplyList,
  ApplyStatus,
  ApplyStatusLabelJa,
  ApplyStatusLabelKey,
  DateRange,
  RollbackStatus,
  RollbackStatusLabelJa,
  RollbackStatusLabelKey,
} from '@/shared-modules/types';
import { useQuery } from '@/shared-modules/utils/hooks';

import { STATUS_TO_LABEL } from '@/utils/constant';
import { useLayoutApplyList } from '@/utils/hooks';

import { isDateInRange, isAllStringIncluded, isSelected } from '@/shared-modules/utils';

// Define a new type for queries based on APPLayoutApplyList
export type APPLayoutApplyListQuery = Omit<
  APPLayoutApplyList,
  'status' | 'startedAt' | 'endedAt' | 'rollbackStatus'
> & {
  status: ApplyStatus[];
  startedAt: DateRange;
  endedAt: DateRange;
  rollbackStatus: RollbackStatus[];
};

type APPLayoutApplyListSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  status: Dispatch<SetStateAction<ApplyStatus[]>>;
  startedAt: Dispatch<SetStateAction<DateRange>>;
  endedAt: Dispatch<SetStateAction<DateRange>>;
  rollbackStatus: Dispatch<SetStateAction<RollbackStatus[]>>;
};

export type LayoutApplyFilter = {
  /** Filtered records */
  filteredRecords: APPLayoutApplyList[];
  /** Filter values */
  query: APPLayoutApplyListQuery;
  /** Set functions */
  setQuery: APPLayoutApplyListSetQuery;
  /** MultiSelect options */
  selectOptions: {
    status: { value: ApplyStatus; label: ApplyStatusLabelJa | ApplyStatusLabelKey }[];
    rollbackStatus: { value: RollbackStatus; label: RollbackStatusLabelJa | RollbackStatusLabelKey }[];
  };
};

type LayoutApplyListQuery = {
  status?: ApplyStatus[];
  startedAt?: DateRange;
  endedAt?: DateRange;
  rollbackStatus?: RollbackStatus[];
};

const useLayoutApplyListQuery = (): Required<LayoutApplyListQuery> => {
  const query = useQuery();

  const formatToDateRange = (dateQuery: string | string[] | undefined): DateRange => {
    const returnDateRange: DateRange = [undefined, undefined];
    const parsedQuerys = dateQuery !== undefined ? [splitAndFlatQueryString(dateQuery)].flat(2) : [];
    returnDateRange[0] = parsedQuerys[0] ? new Date(parsedQuerys[0]) : undefined;
    returnDateRange[1] = parsedQuerys[1] ? new Date(parsedQuerys[1]) : undefined;
    return returnDateRange;
  };
  return useMemo(
    () => ({
      status: query.status !== undefined ? ([splitAndFlatQueryString(query.status)].flat(2) as ApplyStatus[]) : [],
      startedAt: formatToDateRange(query.startedAt),
      endedAt: formatToDateRange(query.endedAt),
      rollbackStatus:
        query.rollbackStatus !== undefined
          ? ([splitAndFlatQueryString(query.rollbackStatus)].flat(2) as RollbackStatus[])
          : [],
    }),
    [query]
  );
};

/**
 * Custom hook for layout filter
 *
 * @returns Filtered records and filter information {@link LayoutApplyFilter}
 */
export const useLayoutApplyFilter = (): LayoutApplyFilter => {
  const t = useTranslations();

  const { data: records }: { data: APPLayoutApplyList[] } = useLayoutApplyList();

  const [idQuery, setIdQuery] = useState('');
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [statusQuery, setStatusQuery] = useState<ApplyStatus[]>([]);
  const [rollbackStatusQuery, setRollbackStatusQuery] = useState<RollbackStatus[]>([]);
  const [startedAtQuery, setStartedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [endedAtQuery, setEndedAtQuery] = useState<DateRange>([undefined, undefined]);
  const applyStatusInRecords = Array.from(new Set(records.map((record) => record.status)));
  const rollbackStatusInRecords = Array.from(new Set(records.map((record) => record.rollbackStatus)));

  const statusOptions = ApplyStatuses.filter((item: ApplyStatus) => applyStatusInRecords.includes(item)).map(
    (status) => {
      return {
        value: status,
        label: t(STATUS_TO_LABEL[status]) as ApplyStatusLabelJa | ApplyStatusLabelKey,
      };
    }
  );

  const rollbackStatusOptions = RollbackStatuses.filter((item: RollbackStatus) =>
    rollbackStatusInRecords.includes(item)
  ).map((rollbackStatus) => {
    return {
      value: rollbackStatus,
      label: t(STATUS_TO_LABEL[rollbackStatus]) as RollbackStatusLabelJa | RollbackStatusLabelKey,
    };
  });

  const queryObject = useLayoutApplyListQuery();
  useEffect(() => {
    setStatusQuery(queryObject.status);
    setRollbackStatusQuery(queryObject.rollbackStatus);
    setStartedAtQuery(queryObject.startedAt);
    setEndedAtQuery(queryObject.endedAt);
  }, [queryObject]);

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isSelected(record.status, statusQuery) &&
        isSelected(record.rollbackStatus, rollbackStatusQuery) &&
        isDateInRange(record.startedAt, startedAtQuery) &&
        isDateInRange(record.endedAt, endedAtQuery)
    );
  }, [records, debouncedIdQuery, startedAtQuery, endedAtQuery, statusQuery, rollbackStatusQuery]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      startedAt: startedAtQuery,
      endedAt: endedAtQuery,
      status: statusQuery,
      rollbackStatus: rollbackStatusQuery,
    },
    setQuery: {
      id: setIdQuery,
      startedAt: setStartedAtQuery,
      endedAt: setEndedAtQuery,
      status: setStatusQuery,
      rollbackStatus: setRollbackStatusQuery,
    },
    selectOptions: { status: statusOptions, rollbackStatus: rollbackStatusOptions },
  };
};

/**
 * Splits a string or an array of strings with ',', filters empty string and flattens the result.
 *
 * @param q - The string or array of strings to split and flatten.
 * @returns An array of strings after splitting and flattening the input.
 */
const splitAndFlatQueryString = (q: string | string[]): string[] => {
  if (Array.isArray(q)) return q.map(splitString).flat();

  return splitString(q);
};

const splitString = (s: string): string[] => {
  // regex to split by comma and remove empty strings in longest match
  const separator = /,\s*/;
  return s.split(separator).filter((item) => item !== '');
};
