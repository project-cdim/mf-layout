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
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { Box, Group, Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import {
  DateRangePicker,
  DatetimeString,
  LongSentences,
  MultiSelectForTableFilter,
  PageLink,
  TextInputForTableFilter,
} from '@/shared-modules/components';
import { APPLayoutApplyList } from '@/shared-modules/types';

import { STATUS_TO_LABEL } from '@/utils/constant';
import { LayoutApplyFilter } from '@/utils/hooks/useLayoutApplyFilter';
import { StatusToIcon } from '@/components/StatusToIcon';

type ApplyColumns = (filter: LayoutApplyFilter) => DataTableColumn<APPLayoutApplyList>[];

/**
 * * Construct columns for the layout list
 *
 * @param layoutFilter Filter information
 * @returns Column information
 */
export const useLayoutApplyColumns: ApplyColumns = (filter) => {
  const t = useTranslations();
  /** Generate default column information */
  const defaultCol: DataTableColumn<APPLayoutApplyList>[] = [
    {
      accessor: 'id',
      title: t('ID'),
      sortable: true,
      filter: <TextInputForTableFilter label={t('ID')} value={filter.query.id} setValue={filter.setQuery.id} />,
      filtering: filter.query.id !== '',
      render: ({ id }) => {
        return (
          <Stack gap={0}>
            <PageLink title={t('Layout Apply Details')} path='/cdim/lay-layout-apply-detail' query={{ id: id }}>
              <LongSentences text={id} />
            </PageLink>
          </Stack>
        );
      },
    },
    {
      accessor: 'status',
      title: t('Apply Status'),
      sortable: true,
      noWrap: true,
      render: ({ status }) => {
        return (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <StatusToIcon status={status} target='Apply' />
            </Box>
            {t(STATUS_TO_LABEL[status])}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Apply Status')}
          options={filter.selectOptions.status}
          value={filter.query.status}
          setValue={filter.setQuery.status as (p: string[]) => void}
        />
      ),
      filtering: filter.query.status.length > 0,
    },
    {
      accessor: 'startedAt',
      title: t('Started'),
      sortable: true,
      noWrap: true,
      render: ({ startedAt }) => <DatetimeString date={startedAt} />,
      filter: ({ close }) => (
        <DateRangePicker value={filter.query.startedAt} setValue={filter.setQuery.startedAt} close={close} />
      ),
      filtering: filter.query.startedAt.some((date) => Boolean(date)),
    },
    {
      accessor: 'endedAt',
      title: t('Ended'),
      sortable: true,
      noWrap: true,
      render: ({ endedAt }) => <DatetimeString date={endedAt} />,
      filter: ({ close }) => (
        <DateRangePicker value={filter.query.endedAt} setValue={filter.setQuery.endedAt} close={close} />
      ),
      filtering: filter.query.endedAt.some((date) => Boolean(date)),
    },
    {
      accessor: 'rollbackStatus',
      title: t('Rollback Status'),
      sortable: true,
      noWrap: true,
      render: ({ rollbackStatus }) => {
        return rollbackStatus ? (
          <Group gap={5} wrap='nowrap' style={{ whiteSpace: 'nowrap' }}>
            <Box style={{ flex: '0 0 auto', lineHeight: 0 }}>
              <StatusToIcon status={rollbackStatus} target='Rollback' />
            </Box>
            {t(STATUS_TO_LABEL[rollbackStatus])}
          </Group>
        ) : (
          <></>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Rollback Status')}
          options={filter.selectOptions.rollbackStatus}
          value={filter.query.rollbackStatus}
          setValue={filter.setQuery.rollbackStatus as (p: string[]) => void}
        />
      ),
      filtering: filter.query.rollbackStatus.length > 0,
    },
  ];

  return defaultCol;
};
