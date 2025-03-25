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

import { useMemo } from 'react';

import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/shared-modules/utils/fetcher';

import { APILayoutDesignList, APPLayoutList } from '@/types';

/**
 * Custom hook for DataTable
 *
 * Manages values for DataTable records and pagination
 * @param data All records
 * @returns Props for DataTable
 */
export const useLayoutList = () => {
  const defaultVal = useMemo<{ designs: APPLayoutList[] }>(
    () => ({
      designs: [] as APPLayoutList[],
    }),
    []
  );
  const {
    data = defaultVal,
    error,
    isValidating,
    mutate,
  } = useSWRImmutable<APILayoutDesignList>(
    `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_DESIGN}/layout-designs?limit=1000`,
    fetcher
  );

  const parsedLayoutsData: APPLayoutList[] = useMemo(
    () =>
      data.designs.map((design) => ({
        id: design.id,
        status: design.status,
        startedAt: new Date(design.startedAt),
        endedAt:
          design.endedAt != undefined && design.endedAt != '' && design.endedAt != null
            ? new Date(design.endedAt)
            : undefined,
      })),
    [data]
  );

  return {
    data: parsedLayoutsData,
    error,
    isValidating,
    mutate,
  };
};
