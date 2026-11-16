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

import { Group, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { CardLoading, DatetimeString, HorizontalTable, MessageBox, PageHeader } from '@/shared-modules/components';
import { useLoading, useQuery } from '@/shared-modules/utils/hooks';

import { useLayoutDesignDetail } from '@/utils/hooks';
import { StatusToIcon } from '@/components/StatusToIcon';
import { STATUS_TO_LABEL } from '@/utils/constant';
import { APPLayoutDesignDetail } from '@/types';
import { DesignProcedureTable, NodeLayout } from '@/components';
import { MigrationConditions } from '@/components/MigrationConditions';

/**
 * Layout Design Detail Page.
 *
 * @returns Page content
 */

const LayoutDesignDetail = () => {
  const MAX_CARD_WIDTH = '32em';
  const t = useTranslations();
  const { id } = useQuery();
  const breadcrumbs = [
    { title: t('Layout Management') },
    { title: t('Layout Designs'), href: '/cdim/lay-layout-design-list' },
    { title: `${t('Layout Design Details')} <${id}>` },
  ];

  // Get the returns of SWR which fetch layout design data
  const { data, error, isValidating, mutate, getDeviceByID } = useLayoutDesignDetail();
  const loading = useLoading(isValidating.resource || isValidating.layout);
  const loadingLayout = useLoading(isValidating.layout);
  const tableData = getTableData(t, data);
  return (
    <>
      <Stack>
        <PageHeader pageTitle={t('Layout Design Details')} items={breadcrumbs} mutate={mutate} loading={loading} />
        <Message error={error} />
        <CardLoading withBorder maw={MAX_CARD_WIDTH} loading={loadingLayout}>
          <Text fz='sm'>{t('Design ID')}</Text>
          <Text fz='lg' fw={500}>
            {data?.designID}
          </Text>
        </CardLoading>
        <HorizontalTable tableData={tableData} loading={loadingLayout} />
        <NodeLayout nodes={data?.nodes || []} getDeviceByID={getDeviceByID} loading={loadingLayout} />
        <DesignProcedureTable />
        <MigrationConditions />
      </Stack>
    </>
  );
};

const getTableData = (t: any, data: APPLayoutDesignDetail | undefined) => [
  {
    columnName: t('Design Status'),
    value: (
      <Group gap={5}>
        <StatusToIcon status={data?.status} target={'Design'} />
        {data?.status ? t(STATUS_TO_LABEL[data.status]) : ''}
      </Group>
    ),
  },
  { columnName: t('Causes of failure'), value: data?.cause, hide: data?.status !== 'FAILED' },
  { columnName: t('Started'), value: <DatetimeString date={data?.startedAt} /> },
  { columnName: t('Ended'), value: <DatetimeString date={data?.endedAt} /> },
];

const Message = (props: { error: { layout: any; resource: any } }) => {
  const { error } = props;
  return (
    <>
      {Object.entries(error).map(
        ([key, err]) =>
          err && <MessageBox key={key} type='error' title={err.message} message={err.response?.data.message || ''} />
      )}
    </>
  );
};

export default LayoutDesignDetail;
