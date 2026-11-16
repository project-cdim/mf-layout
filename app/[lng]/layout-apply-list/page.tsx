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

import { useLayoutApplyColumns, useLayoutApplyFilter, useLayoutApplyList } from '@/utils/hooks';

/**
 * Relationship
 *
 * LayoutApplyList
 *    -> useRecordsAndColumns
 *        -> useLayoutApplyFilter
 *            -> useLayoutApplyList
 *        -> useLayoutApplyColumns
 */

/**
 * Layout Applies Page.
 *
 * @returns Page content
 */
const LayoutApplyList = () => {
  const t = useTranslations();
  const breadcrumbs = [{ title: t('Layout Management') }, { title: t('LayoutApplies.list') }];

  /** records and columns for DataTable */
  const { records, columns } = useRecordsAndColumns();

  // Get the returns of SWR which fetch layout apply data
  const { error, isValidating, mutate } = useLayoutApplyList();
  const loading = useLoading(isValidating);

  return (
    <Stack gap='xl'>
      <PageHeader pageTitle={t('LayoutApplies.list')} items={breadcrumbs} mutate={mutate} loading={loading} />
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

const useRecordsAndColumns = () => {
  const layoutApplyFilter = useLayoutApplyFilter();

  // if you do not pass the above hook returns, the table filtering does not work because of manipulating other states each other
  const columns = useLayoutApplyColumns(layoutApplyFilter);

  return {
    columns,
    records: layoutApplyFilter.filteredRecords,
  };
};

export default LayoutApplyList;
