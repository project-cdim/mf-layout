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

import _ from 'lodash';
import useSWRImmutable from 'swr/immutable';

import { useQuery } from '@/shared-modules/utils/hooks';
import { APIresource, APIresources } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils/';

import { APILayoutDesign, APPLayoutDesignDetail } from '@/types';
import { KIB } from '@/shared-modules/constant';

/**
 * Custom hook for fetching layout design detail data.
 *
 * @returns An object containing the layout design detail data, error information, validation status, and a mutate function.
 */
export const useLayoutDesignDetail = () => {
  // const mswInitializing = useMSW();
  const mswInitializing = false;
  const { id } = useQuery();

  // Fetch design data
  const layoutSWRResponse = useSWRImmutable<APILayoutDesign>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_DESIGN}/layout-designs/${id}`,
    fetcher
  );

  // Fetch resource data
  const resourceSWRResponse = useSWRImmutable<APIresources>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`, // Get all resource list (when search conditions are implemented, get by deviceID)
    fetcher
  );

  // Map deviceID to device type for quick lookup
  const deviceObjectMap = useMemo(() => {
    if (!resourceSWRResponse.data) return {};
    return resourceSWRResponse.data.resources.reduce(
      (map, resource) => {
        map[resource.device.deviceID] = resource.device;
        return map;
      },
      {} as Record<string, APIresource['device']>
    );
  }, [resourceSWRResponse.data]);

  // Map deviceID to device type for quick lookup
  const getDeviceByID = (deviceID: string): APIresource['device'] | undefined => {
    return deviceObjectMap[deviceID];
  };
  // Get device with its type
  const getDeviceWithType = (deviceID: string): string => {
    const type = getDeviceByID(deviceID)?.type;
    return type ? `${_.upperFirst(type)}(${deviceID})` : deviceID;
  };
  // Get device cores and capacity
  const getCoresByDeviceID = (deviceID: string): number | undefined => {
    return getDeviceByID(deviceID)?.totalCores;
  };
  // Get device capacity in bytes
  const getCapacityByDeviceID = (deviceID: string): number | undefined => {
    const capacity = getDeviceByID(deviceID)?.capacityMiB;
    return capacity != undefined ? capacity * KIB * KIB : undefined; // Convert MiB to Bytes
  };

  // Convert data to APPLayoutDesignDetail
  // eslint-disable-next-line complexity
  const layoutApplyDetail: APPLayoutDesignDetail | undefined = useMemo(() => {
    const { data } = layoutSWRResponse;
    if (!data) return undefined;
    return {
      designID: data.designID,
      status: data.status,
      cause: data.cause,
      startedAt: new Date(data.startedAt),
      endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      nodes: data.design?.nodes,
      procedures: data.procedures?.map((procedure) => ({
        operationID: procedure.operationID,
        operation: procedure.operation,
        targetCPUID: procedure.targetCPUID,
        targetDevice: getDeviceWithType(procedure.targetDeviceID),
        dependencies: procedure.dependencies,
      })),
      conditions:
        data.conditions && Object.keys(data.conditions).length !== 0
          ? {
              energyCriteria: data.conditions.energyCriteria,
              toleranceCriteria: {
                cpu:
                  data.conditions.toleranceCriteria?.cpu?.map((cpu) => ({
                    devices: cpu.deviceIDs.map((id, index) => ({
                      id: id,
                      weights: cpu.limit.weights.length > index ? cpu.limit.weights[index] : undefined,
                      cores: getCoresByDeviceID(id),
                    })),
                    limit: { averageUseRate: cpu.limit.averageUseRate },
                  })) || [],
                memory:
                  data.conditions.toleranceCriteria?.memory?.map((memory) => ({
                    devices: memory.deviceIDs.map((id) => ({
                      id: id,
                      capacity: getCapacityByDeviceID(id),
                    })),
                    limit: { averageUseBytes: memory.limit.averageUseBytes },
                  })) || [],
              },
            }
          : undefined,
    };
  }, [layoutSWRResponse.data, deviceObjectMap]);

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
    getDeviceByID,
  };
};
