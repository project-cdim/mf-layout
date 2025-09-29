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

import { CustomDataTable } from '@/shared-modules/components';
import { PAGE_SIZES } from '@/shared-modules/constant';
import { List, Stack, Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { InfoCard } from '.';

type ToleranceCriteriaSectionProps = {
  title: string;
  data?: {
    limit: {
      averageUseRate?: number;
      averageUseBytes?: number;
    };
    devices: any[];
  }[];
  columns: DataTableColumn<any>[];
  infoCardProps: {
    title: string;
    infoLabel: string;
  };
  valueExtractor: (limit: { averageUseRate?: number; averageUseBytes?: number }) => string;
  loading: boolean;
};

/**
 * Renders a tolerance criteria section.
 *
 * This component displays a title and, based on the provided data, either a
 * "No data" message or a list of tolerance criteria items.
 *
 * @param title - The title to display above the section.
 * @param data - An array of tolerance criteria items. Each item should contain a `limit`
 * and a list of `devices`.
 * @param columns - Definitions for the columns used in the CustomDataTable component.
 * @param infoCardProps - Props to be passed to the InfoCard component.
 * @param loading - A flag indicating whether data is still loading.
 * @param valueExtractor - A function to extract the display value from the item's `limit`.
 *
 * @returns A JSX element representing the rendered tolerance criteria section.
 */
export const ToleranceCriteriaSection = ({
  title,
  data,
  columns,
  infoCardProps,
  loading,
  valueExtractor,
}: ToleranceCriteriaSectionProps) => {
  const t = useTranslations();

  if (!data || data.length === 0) {
    return (
      <>
        <Text fw={600}>{title}</Text>
        <Text>{t('No data')}</Text>
      </>
    );
  }

  return (
    <>
      <Text fw={600}>{title}</Text>
      <List spacing='lg'>
        {data.map((item, index) => (
          <List.Item key={index}>
            <Stack gap='sm'>
              <Text fw={600}>
                {t('Tolerance Criteria')} {index + 1}
              </Text>
              <InfoCard {...infoCardProps} value={valueExtractor(item.limit)} loading={loading} />
              <CustomDataTable
                records={item.devices}
                columns={columns}
                defaultSortColumn='id'
                loading={loading}
                noPagination={item.devices.length <= PAGE_SIZES[0]}
              />
            </Stack>
          </List.Item>
        ))}
      </List>
    </>
  );
};
