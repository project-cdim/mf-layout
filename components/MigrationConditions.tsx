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

import {
  formatEnergyValue,
  formatPercentValue,
  formatBytesValue,
  formatBytes,
  bytesToUnit,
} from '@/shared-modules/utils';
import { APPToleranceCriteriaMemoryList } from '@/types';
import { Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { InfoCard, ResourceIdWithPageLink, ToleranceCriteriaSection } from '@/components';
import { DataTableColumn } from 'mantine-datatable';
import { useLayoutDesignDetail } from '@/utils/hooks';
import { useLoading } from '@/shared-modules/utils/hooks';
import { useMemo } from 'react';

/**
 * MigrationConditions component for displaying migration conditions details.
 *
 * @returns {JSX.Element} A React element representing the migration conditions view.
 */
export const MigrationConditions = () => {
  const t = useTranslations();
  const { data, isValidating } = useLayoutDesignDetail();
  const loading = useLoading(isValidating.layout);
  const conditions = data?.conditions;

  /**
   * Memoized minimum memory capacity unit
   */
  const minMemoryCapacityUnit = useMemo((): string | undefined => {
    if (!data?.conditions?.toleranceCriteria?.memory || data.conditions.toleranceCriteria.memory.length === 0) {
      return undefined;
    }
    const allMemoryDevices = data.conditions.toleranceCriteria.memory.flatMap((memory) => memory.devices);
    // Extract capacity values that are not undefined
    const validCapacities = allMemoryDevices
      .map((device) => device.capacity)
      .filter((capacity): capacity is number => capacity !== undefined);
    // Return undefined if there are no valid capacity values
    if (validCapacities.length === 0) return undefined;
    const minValue = Math.min(...validCapacities);
    return bytesToUnit(minValue);
  }, [data?.conditions?.toleranceCriteria?.memory]);

  if (!conditions) {
    return (
      <>
        <Title order={2} fz='lg'>
          {t('Migration Conditions')}
        </Title>
        <Text>{t('No data')}</Text>
      </>
    );
  }

  const cpuColumns: DataTableColumn<APPToleranceCriteriaMemoryList>[] = [
    {
      accessor: 'id',
      title: t('Device ID'),
      sortable: true,
      render: ({ id }) => {
        return <ResourceIdWithPageLink id={id} />;
      },
    },
    { accessor: 'weights', title: t('Weight for CPU'), sortable: true },
    { accessor: 'cores', title: t('Cores'), sortable: true },
  ];

  const memoryColumns: DataTableColumn<APPToleranceCriteriaMemoryList>[] = [
    {
      accessor: 'id',
      title: t('Device ID'),
      sortable: true,
      render: ({ id }) => {
        return <ResourceIdWithPageLink id={id} />;
      },
    },
    {
      accessor: 'capacity',
      title: t('Capacity') + (minMemoryCapacityUnit ? `(${minMemoryCapacityUnit})` : ''),
      sortable: true,
      render: ({ capacity }) =>
        capacity === undefined ? undefined : formatBytes(capacity, minMemoryCapacityUnit || ''),
    },
  ];

  return (
    <>
      <Title order={2} fz='lg'>
        {t('Migration Conditions')}
      </Title>
      <Text fw={600}>{t('Power Consumption')}</Text>
      <InfoCard
        title={t('Power Consumption Limit')}
        infoLabel={t('Upper bound of system estimated average power consumption')}
        value={formatEnergyValue(conditions.energyCriteria)}
        loading={loading}
      />
      <ToleranceCriteriaSection
        title={t('CPU')}
        data={conditions.toleranceCriteria?.cpu}
        columns={cpuColumns}
        infoCardProps={{
          title: t('Ceiling of CPU usage'),
          infoLabel: t(
            'The value obtained by summing the upper limits of the estimated average usage rates of the target CPUs, with the upper limit of a single CPU usage set to 100%'
          ),
        }}
        valueExtractor={(limit) => formatPercentValue(limit.averageUseRate)}
        loading={loading}
      />
      <ToleranceCriteriaSection
        title={t('Memory')}
        data={conditions.toleranceCriteria?.memory}
        columns={memoryColumns}
        infoCardProps={{
          title: t('Ceiling for RAM Usage'),
          infoLabel: t(
            'The value obtained by summing the upper limits of the estimated average memory usage of the target memory'
          ),
        }}
        valueExtractor={(limit) => formatBytesValue(limit.averageUseBytes)}
        loading={loading}
      />
    </>
  );
};
