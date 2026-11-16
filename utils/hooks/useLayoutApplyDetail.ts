/*
 * Copyright 2025-2026 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { useMemo } from 'react';

import _ from 'lodash';
import useSWRImmutable from 'swr/immutable';

// import { useMSW } from '@/shared-modules/utils/hooks';
import {
  APIApplyIDGetResponse,
  APIResult,
  APIresourcesSummary,
  APIResultResponseBody1,
  APIResultResponseBody2,
  APIResultResponseBody3,
} from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils/';
import { useQuery } from '@/shared-modules/utils/hooks';
import { useTranslations } from 'next-intl';

import { APPLayoutApplyDetail } from '@/types';

/**
 * Custom hook for fetching layout apply detail data.
 *
 * @returns An object containing the layout apply detail data, error information, validation status, and a mutate function.
 */
export const useLayoutApplyDetail = () => {
  const t = useTranslations();
  const { id } = useQuery();

  // Fetch apply data
  const layoutSWRResponse = useSWRImmutable<APIApplyIDGetResponse>(
    `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply/${id}`,
    fetcher
  );

  // Fetch resource data
  const resourceSWRResponse = useSWRImmutable<APIresourcesSummary>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=false`,
    fetcher
  );

  // Map deviceID to device type for quick lookup
  const deviceTypeMap = useMemo(() => {
    if (!resourceSWRResponse.data) return {};
    return resourceSWRResponse.data.resources.reduce(
      (map, resource) => {
        map[resource.device.deviceID] = resource.device.type;
        return map;
      },
      {} as Record<string, string>
    );
  }, [resourceSWRResponse.data]);

  // Get device with its type
  const getDeviceWithType = (deviceID: string | undefined): string => {
    if (deviceID === undefined) return '';
    const type = deviceTypeMap[deviceID];
    return type ? `${_.upperFirst(type)}(${deviceID})` : deviceID;
  };

  const getLastResult = (resultList: APIResult[] | undefined, operationID: number): APIResult | undefined => {
    return resultList?.findLast((item) => item.operationID === operationID);
  };

  const getErrorByResult = (result: APIResult | undefined): { code: string; message: string } | undefined => {
    if (!result || result.status !== 'FAILED') return undefined;

    // eslint-disable-next-line complexity
    const extractError = (rb: unknown): { code: string; message: string } | undefined => {
      if (typeof rb !== 'object' || rb === null) return undefined;

      // pattern1: { code, message: string }
      if ('code' in rb && 'message' in rb && typeof (rb as { message: unknown }).message === 'string') {
        const { code, message } = rb as APIResultResponseBody1;
        return { code: String(code), message };
      }

      // pattern2: { errorInfo: [{ errorCode, errorMessage }] }
      if (
        'errorInfo' in rb &&
        Array.isArray((rb as { errorInfo: unknown }).errorInfo) &&
        (rb as { errorInfo: unknown[] }).errorInfo.length > 0
      ) {
        const { errorInfo } = rb as APIResultResponseBody2;
        const { errorCode, errorMessage } = errorInfo[0] ?? {};
        if (errorCode !== undefined && errorMessage !== undefined) {
          return { code: errorCode, message: errorMessage };
        }
      }

      // pattern3: { code, message: Array<{ msg, ... }> }
      if (
        'code' in rb &&
        'message' in rb &&
        Array.isArray((rb as { message: unknown }).message) &&
        (rb as { message: unknown[] }).message.length > 0
      ) {
        const { code, message } = rb as APIResultResponseBody3;
        const msg = message[0]?.msg;
        if (msg !== undefined) return { code: String(code), message: msg };
      }

      return { code: t('Unknown'), message: t('If the problem persists, please contact your administrator') };
    };

    const responseBodies = [result.responseBody, result.isOSBoot?.responseBody, result.getInformation?.responseBody];
    for (const rb of responseBodies) {
      const error = extractError(rb);
      if (error) return error;
    }
    return undefined;
  };

  // Convert data to APPLayoutApplyDetail
  // eslint-disable-next-line complexity
  const layoutApplyDetail: APPLayoutApplyDetail | undefined = useMemo(() => {
    const { data } = layoutSWRResponse;
    if (!data) return undefined;

    return {
      applyID: data.applyID,
      apply: {
        status: data.status,
        startedAt: new Date(data.startedAt),
        suspendedAt: data.suspendedAt ? new Date(data.suspendedAt) : undefined,
        resumedAt: data.resumedAt ? new Date(data.resumedAt) : undefined,
        canceledAt: data.canceledAt ? new Date(data.canceledAt) : undefined,
        endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      },
      rollback: data.rollback
        ? {
            status: data.rollback.status ?? undefined,
            startedAt: data.rollback.startedAt ? new Date(data.rollback.startedAt) : undefined,
            suspendedAt: data.rollback.suspendedAt ? new Date(data.rollback.suspendedAt) : undefined,
            resumedAt: data.rollback.resumedAt ? new Date(data.rollback.resumedAt) : undefined,
            endedAt: data.rollback.endedAt ? new Date(data.rollback.endedAt) : undefined,
          }
        : undefined,
      // eslint-disable-next-line complexity
      procedures: data.procedures?.map((procedure) => {
        const rollbackProcedures = data.rollbackProcedures ?? data.rollback?.procedures;
        const rollbackProcedure = rollbackProcedures?.find((rp) => rp.operationID === procedure.operationID);
        const applyResult = getLastResult(data.result, procedure.operationID);
        const rollbackResult = rollbackProcedure
          ? getLastResult(data.rollback?.result, rollbackProcedure.operationID)
          : undefined;
        return {
          operationID: procedure.operationID,
          targetCPUID: procedure.targetCPUID,
          targetDevice: getDeviceWithType(procedure.targetDeviceID),
          apply: {
            operation: procedure.operation,
            dependencies: procedure.dependencies,
            status: applyResult?.status,
            error: getErrorByResult(applyResult),
            startedAt: applyResult?.startedAt ? new Date(applyResult.startedAt) : undefined,
            endedAt: applyResult?.endedAt ? new Date(applyResult.endedAt) : undefined,
          },
          rollback: rollbackProcedure
            ? {
                operation: rollbackProcedure.operation,
                dependencies: rollbackProcedure.dependencies,
                status: rollbackResult?.status,
                error: getErrorByResult(rollbackResult),
                startedAt: rollbackResult?.startedAt ? new Date(rollbackResult.startedAt) : undefined,
                endedAt: rollbackResult?.endedAt ? new Date(rollbackResult.endedAt) : undefined,
              }
            : undefined,
        };
      }),
    };
  }, [layoutSWRResponse.data, deviceTypeMap]);

  return {
    data: layoutApplyDetail,
    error: {
      layout: layoutSWRResponse.error,
      resource: resourceSWRResponse.error,
    },
    isValidating: {
      layout: layoutSWRResponse.isValidating,
      resource: resourceSWRResponse.isValidating,
    },
    mutate: () => {
      layoutSWRResponse.mutate();
      resourceSWRResponse.mutate();
    },
  };
};
