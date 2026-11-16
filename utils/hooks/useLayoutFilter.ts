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

import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';
import { useTranslations } from 'next-intl';

import { DateRange } from '@/shared-modules/types';

import { APPLayoutList, DesignStatus, DesignStatusLabelJa, DesignStatusLabelKey, DesignStatuses } from '@/types';

import { isDateInRange, isSelected, isAllStringIncluded } from '@/shared-modules/utils';
import { STATUS_TO_LABEL } from '@/utils/constant';

// Remove id from APPLayoutList and add id
export type APPLayoutListQuery = Omit<APPLayoutList, 'status' | 'startedAt' | 'endedAt'> & {
  status: DesignStatus[];
  startedAt: DateRange;
  endedAt: DateRange;
};

type APPLayoutListSetQuery = {
  id: Dispatch<SetStateAction<string>>;
  status: Dispatch<SetStateAction<DesignStatus[]>>;
  startedAt: Dispatch<SetStateAction<DateRange>>;
  endedAt: Dispatch<SetStateAction<DateRange>>;
};

export type LayoutFilter = {
  /** Filtered records */
  filteredRecords: APPLayoutList[];
  /** Filter values */
  query: APPLayoutListQuery;
  /** Set functions */
  setQuery: APPLayoutListSetQuery;
  /** MultiSelect options */
  selectOptions: { status: { value: DesignStatus; label: DesignStatusLabelJa | DesignStatusLabelKey }[] };
};

type LayoutFilterHook = (
  records: APPLayoutList[] // All records
) => LayoutFilter;

/**
 * Custom hook for layout filter
 *
 * @param records All records
 * @returns Filtered records, filter information
 */
export const useLayoutFilter: LayoutFilterHook = (records) => {
  const WAIT_MS = 200;

  const t = useTranslations();

  const [idQuery, setIdQuery] = useState('');
  const [debouncedIdQuery] = useDebouncedValue(idQuery, WAIT_MS);
  const [statusQuery, setStatusQuery] = useState<DesignStatus[]>([]);
  const [startedAtQuery, setStartedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [endedAtQuery, setEndedAtQuery] = useState<DateRange>([undefined, undefined]);
  const statusOptions = DesignStatuses.map((status) => {
    return {
      value: status,
      label: t(STATUS_TO_LABEL[status]) as DesignStatusLabelJa | DesignStatusLabelKey,
    };
  });

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.id, debouncedIdQuery) &&
        isSelected(record.status, statusQuery) &&
        isDateInRange(record.startedAt, startedAtQuery) &&
        isDateInRange(record.endedAt, endedAtQuery)
    );
  }, [records, debouncedIdQuery, startedAtQuery, endedAtQuery, statusQuery]);

  return {
    filteredRecords,
    query: {
      id: idQuery,
      startedAt: startedAtQuery,
      endedAt: endedAtQuery,
      status: statusQuery,
    },
    setQuery: {
      id: setIdQuery,
      startedAt: setStartedAtQuery,
      endedAt: setEndedAtQuery,
      status: setStatusQuery,
    },
    selectOptions: { status: statusOptions },
  };
};
