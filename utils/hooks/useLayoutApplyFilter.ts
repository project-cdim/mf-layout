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
import { useQueryArrayObject } from '@/shared-modules/utils/hooks';

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

  const statusOptions = ApplyStatuses.map((status) => {
    return {
      value: status,
      label: t(STATUS_TO_LABEL[status]) as ApplyStatusLabelJa | ApplyStatusLabelKey,
    };
  });

  const rollbackStatusOptions = RollbackStatuses.map((rollbackStatus) => {
    return {
      value: rollbackStatus,
      label: t(STATUS_TO_LABEL[rollbackStatus]) as RollbackStatusLabelJa | RollbackStatusLabelKey,
    };
  });

  const queryObject = useQueryArrayObject();
  const formatToDateRange = (dateQuery: string[]): DateRange => {
    const returnDateRange: DateRange = [undefined, undefined];
    returnDateRange[0] = dateQuery[0] ? new Date(dateQuery[0]) : undefined;
    returnDateRange[1] = dateQuery[1] ? new Date(dateQuery[1]) : undefined;
    return returnDateRange;
  };
  useEffect(() => {
    setStatusQuery(queryObject.status as ApplyStatus[]);
    setRollbackStatusQuery(queryObject.rollbackStatus as RollbackStatus[]);
    setStartedAtQuery(formatToDateRange(queryObject.startedAt));
    setEndedAtQuery(formatToDateRange(queryObject.endedAt));
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
