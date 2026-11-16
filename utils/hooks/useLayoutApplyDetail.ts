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
  APIApplyResult,
  APIresourcesSummary,
  ApplyProcedureStatus,
} from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils/';
import { useQuery } from '@/shared-modules/utils/hooks';

import { APPLayoutApplyDetail } from '@/types';

/**
 * Custom hook for fetching layout apply detail data.
 *
 * @returns An object containing the layout apply detail data, error information, validation status, and a mutate function.
 */
export const useLayoutApplyDetail = () => {
  // const mswInitializing = useMSW();
  const mswInitializing = false;
  const { id } = useQuery();

  // Fetch apply data
  const layoutSWRResponse = useSWRImmutable<APIApplyIDGetResponse>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply/${id}`,
    fetcher
  );

  // Fetch resource data
  const resourceSWRResponse = useSWRImmutable<APIresourcesSummary>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=false`,
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
  const getDeviceWithType = (deviceID: string): string => {
    const type = deviceTypeMap[deviceID];
    return type ? `${_.upperFirst(type)}(${deviceID})` : deviceID;
  };

  const getProcedureResult = (
    data: APIApplyIDGetResponse,
    operationID: number,
    type: 'apply' | 'rollback'
  ): ApplyProcedureStatus | undefined => {
    const resultList = type === 'apply' ? data.applyResult : data.rollbackResult;
    if (shouldCheckResumeResult(data, type)) {
      const resumeStatus = data.resumeResult?.find((item) => item.operationID === operationID)?.status;
      if (resumeStatus !== undefined) {
        return resumeStatus;
      }
    }
    return resultList?.find((item) => item.operationID === operationID)?.status;
  };

  const getProcedureError = (
    data: APIApplyIDGetResponse,
    operationID: number,
    type: 'apply' | 'rollback'
  ):
    | {
        code: string;
        message: string;
      }
    | undefined => {
    const resultList = type === 'apply' ? data.applyResult : data.rollbackResult;
    if (shouldCheckResumeResult(data, type)) {
      // If there is no error in resume, it is completed and there is no need to look for apply/rollback errors
      return getErrorByResult(data.resumeResult?.find((item) => item.operationID === operationID));
    }
    return getErrorByResult(resultList?.find((item) => item.operationID === operationID));
  };

  const getProcedureTimestamp = (
    data: APIApplyIDGetResponse,
    operationID: number,
    type: 'apply' | 'rollback',
    timestampType: 'startedAt' | 'endedAt'
  ): Date | undefined => {
    const resultList = type === 'apply' ? data.applyResult : data.rollbackResult;
    if (shouldCheckResumeResult(data, type)) {
      const resumeItem = data.resumeResult?.find((item) => item.operationID === operationID);
      if (resumeItem?.[timestampType]) {
        return new Date(resumeItem[timestampType]);
      }
    }
    const resultItem = resultList?.find((item) => item.operationID === operationID);
    return resultItem?.[timestampType] ? new Date(resultItem[timestampType]) : undefined;
  };

  const shouldCheckResumeResult = (data: APIApplyIDGetResponse, type: 'apply' | 'rollback'): boolean => {
    if (data.resumedAt === undefined) return false;
    const isResumeAfterRollback =
      data.rollbackStartedAt !== undefined && new Date(data.rollbackStartedAt) < new Date(data.resumedAt);
    return (type === 'apply' && !isResumeAfterRollback) || (type === 'rollback' && isResumeAfterRollback);
  };

  const getErrorByResult = (result: APIApplyResult | undefined): { code: string; message: string } | undefined => {
    if (!result) return undefined;
    const responseBodies = [result.responseBody, result.isOSBoot?.responseBody, result.getInformation?.responseBody];
    return responseBodies.find(
      (rb): rb is { code: string; message: string } =>
        typeof rb === 'object' && rb !== null && 'code' in rb && 'message' in rb
    );
  };

  const getDate = (
    dateString: string | undefined,
    rollbackStartedAt: string | undefined,
    type: 'apply' | 'rollback'
  ): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    if (type === 'apply' && (!rollbackStartedAt || new Date(rollbackStartedAt) > date)) {
      return date;
    }
    if (type === 'rollback' && rollbackStartedAt && new Date(rollbackStartedAt) <= date) {
      return date;
    }
    return undefined;
  };

  // Convert data to APPLayoutApplyDetail
  const layoutApplyDetail: APPLayoutApplyDetail | undefined = useMemo(() => {
    const { data } = layoutSWRResponse;
    if (!data) return undefined;

    return {
      applyID: data.applyID,
      apply: {
        status: data.status,
        startedAt: new Date(data.startedAt),
        suspendedAt: getDate(data.suspendedAt, data.rollbackStartedAt, 'apply'),
        resumedAt: getDate(data.resumedAt, data.rollbackStartedAt, 'apply'),
        canceledAt: getDate(data.canceledAt, data.rollbackStartedAt, 'apply'),
        endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      },
      rollback: data.rollbackStartedAt
        ? {
            status: data.rollbackStatus ?? undefined,
            startedAt: new Date(data.rollbackStartedAt),
            suspendedAt: getDate(data.suspendedAt, data.rollbackStartedAt, 'rollback'),
            resumedAt: getDate(data.resumedAt, data.rollbackStartedAt, 'rollback'),
            canceledAt: getDate(data.canceledAt, data.rollbackStartedAt, 'rollback'),
            endedAt: data.rollbackEndedAt ? new Date(data.rollbackEndedAt) : undefined,
          }
        : undefined,
      procedures: data.procedures?.map((procedure) => {
        const rollbackProcedure = data.rollbackProcedures?.find((rp) => rp.operationID === procedure.operationID);
        return {
          operationID: procedure.operationID,
          targetCPUID: procedure.targetCPUID,
          targetDevice: getDeviceWithType(procedure.targetDeviceID),
          apply: {
            operation: procedure.operation,
            dependencies: procedure.dependencies,
            status: getProcedureResult(data, procedure.operationID, 'apply'),
            error: getProcedureError(data, procedure.operationID, 'apply'),
            startedAt: getProcedureTimestamp(data, procedure.operationID, 'apply', 'startedAt'),
            endedAt: getProcedureTimestamp(data, procedure.operationID, 'apply', 'endedAt'),
          },
          rollback: rollbackProcedure
            ? {
                operation: rollbackProcedure.operation,
                dependencies: rollbackProcedure.dependencies,
                status: getProcedureResult(data, rollbackProcedure.operationID, 'rollback'),
                error: getProcedureError(data, rollbackProcedure.operationID, 'rollback'),
                startedAt: getProcedureTimestamp(data, rollbackProcedure.operationID, 'rollback', 'startedAt'),
                endedAt: getProcedureTimestamp(data, rollbackProcedure.operationID, 'rollback', 'endedAt'),
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
      layout: layoutSWRResponse.isValidating || mswInitializing,
      resource: resourceSWRResponse.isValidating || mswInitializing,
    },
    mutate: () => {
      layoutSWRResponse.mutate();
      resourceSWRResponse.mutate();
    },
  };
};
