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

// import { useMSW } from '@/shared-modules/utils/hooks';
import { APIApplyIDGetResponse, APILayoutApplyList, APPLayoutApplyList } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils/';

/**
 * Custom hook for DataTable
 *
 * Manages values for DataTable records and pagination
 * @param data All records
 * @returns Props for DataTable
 */
export const useLayoutApplyList = () => {
  // const mswInitializing = useMSW();
  const mswInitializing = false;

  const defaultVal = useMemo<{ applyResults: APIApplyIDGetResponse[] }>(
    () => ({
      applyResults: [] as APIApplyIDGetResponse[],
    }),
    []
  );
  const {
    data = defaultVal,
    error,
    isValidating,
    mutate,
  } = useSWRImmutable<APILayoutApplyList>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply?limit=1000`,
    fetcher
  );

  const parsedLayoutsData: APPLayoutApplyList[] = useMemo(
    () =>
      data.applyResults.map((applyResult) => ({
        id: applyResult.applyID,
        status: applyResult.status,
        startedAt: new Date(applyResult.startedAt),
        endedAt: applyResult.endedAt ? new Date(applyResult.endedAt) : undefined,
        rollbackStatus: applyResult.rollbackStatus ?? undefined,
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
