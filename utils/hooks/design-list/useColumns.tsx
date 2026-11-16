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

import { Group } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import {
  DateRangePicker,
  DatetimeString,
  PageLink,
  TextInputForTableFilter,
  MultiSelectForTableFilter,
} from '@/shared-modules/components';

import { APPLayoutList, DesignStatus } from '@/types';

import { STATUS_TO_LABEL } from '@/utils/constant';
import { LayoutFilter } from '@/utils/hooks/useLayoutFilter';
import { StatusToIcon } from '@/components/StatusToIcon';

type DesignColumns = (layoutFilter: LayoutFilter) => DataTableColumn<APPLayoutList>[];

/**
 * * Construct columns for the layout list
 *
 * @param layoutFilter Filter information
 * @returns Column information
 */
export const useColumns: DesignColumns = (layoutFilter) => {
  const t = useTranslations();
  /** Generate default column information */
  const defaultCol: DataTableColumn<APPLayoutList>[] = [
    {
      accessor: 'id',
      title: t('ID'),
      sortable: true,
      filter: (
        <>
          <TextInputForTableFilter label={t('ID')} value={layoutFilter.query.id} setValue={layoutFilter.setQuery.id} />
        </>
      ),
      filtering: layoutFilter.query.id !== '',
      render: ({ id }) => {
        return (
          <PageLink title={t('Layout Design Details')} path='/cdim/lay-layout-design-detail' query={{ id: id }}>
            {id}
          </PageLink>
        );
      },
    },
    {
      accessor: 'status',
      title: t('Design Status'),
      sortable: true,
      render: ({ status }) => {
        return (
          <Group gap={5}>
            <StatusToIcon status={status} target='Design' />
            {t(STATUS_TO_LABEL[status])}
          </Group>
        );
      },
      filter: (
        <MultiSelectForTableFilter
          label={t('Design Status')}
          options={layoutFilter.selectOptions.status}
          value={layoutFilter.query.status}
          setValue={(value: string[]) => layoutFilter.setQuery.status(value as DesignStatus[])}
        />
      ),
      filtering: layoutFilter.query.status.length > 0,
    },
    {
      accessor: 'startedAt',
      title: t('Started'),
      sortable: true,
      render: ({ startedAt }) => <DatetimeString date={startedAt} />,
      filter: ({ close }) => (
        <DateRangePicker
          value={layoutFilter.query.startedAt}
          setValue={layoutFilter.setQuery.startedAt}
          close={close}
        />
      ),
      filtering: layoutFilter.query.startedAt.some((date) => Boolean(date)),
    },
    {
      accessor: 'endedAt',
      title: t('Ended'),
      sortable: true,
      render: ({ endedAt }) => <DatetimeString date={endedAt} />,
      filter: ({ close }) => (
        <DateRangePicker value={layoutFilter.query.endedAt} setValue={layoutFilter.setQuery.endedAt} close={close} />
      ),
      filtering: layoutFilter.query.endedAt.some((date) => Boolean(date)),
    },
  ];

  return defaultCol;
};
