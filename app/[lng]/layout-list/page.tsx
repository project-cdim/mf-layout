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

import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { CustomDataTable, MessageBox, PageHeader } from '@/shared-modules/components';
import { useLoading } from '@/shared-modules/utils/hooks';

import { useLayoutFilter, useLayoutList } from '@/utils/hooks';
import { useColumns } from '@/utils/hooks/layout-list/useColumns';
import { APPLayoutList } from '@/types';

/**
 * Layout List Page
 *
 * @returns Page content
 */
const LayoutList = () => {
  const t = useTranslations();
  // const mswInitializing = false;
  const breadcrumbs = [{ title: t('Layout Management') }, { title: t('Layout Designs') }];

  // Get the layout list
  const { data, error, isValidating, mutate } = useLayoutList();

  /** Custom hook for DataTable */
  const { records, columns } = useRecordsAndColumns(data);

  const loading = useLoading(isValidating);

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('Layout Designs')} items={breadcrumbs} mutate={mutate} loading={loading} />
      {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}
      <CustomDataTable
        records={records}
        columns={columns}
        defaultSortColumn='startedAt'
        defaultSortDirection='desc'
        loading={loading}
      />
    </Stack>
  );
};

const useRecordsAndColumns = (data: APPLayoutList[]) => {
  /** Custom hook for filtering */
  const layoutFilter = useLayoutFilter(data);

  /** Column configuration */
  const columns = useColumns(layoutFilter);

  return {
    columns,
    records: layoutFilter.filteredRecords,
  };
};

export default LayoutList;
