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

import { Grid, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { HorizontalTable, DatetimeString } from '@/shared-modules/components';
import { ApplyStatus, RollbackStatus } from '@/shared-modules/types';
import { useLoading } from '@/shared-modules/utils/hooks';

import { STATUS_TO_LABEL } from '@/utils/constant';
import { useLayoutApplyDetail } from '@/utils/hooks';
import { StatusToIcon } from '@/components/StatusToIcon';

/**
 * Component that displays the status tables for both "Apply" and "Rollback" processes.
 *
 * @returns The rendered table components.
 */
export const StatusTables = () => {
  const t = useTranslations();
  const { data, isValidating } = useLayoutApplyDetail();
  const loading = useLoading(isValidating.layout);

  // Apply status
  const status = data?.apply.status;
  const startedAt = data?.apply.startedAt;
  const suspendedAt = data?.apply.suspendedAt;
  const resumedAt = data?.apply.resumedAt;
  const canceledAt = data?.apply.canceledAt;
  const endedAt = data?.apply.endedAt;

  const tableData = [
    {
      columnName: t('Status'),
      value: <StatusWithIcon status={status} type='Apply' />,
    },
    { columnName: t('Started'), value: <DatetimeString date={startedAt} /> },
    { columnName: t('Ended'), value: <DatetimeString date={endedAt} /> },
    { columnName: t('Suspended.at'), value: <DatetimeString date={suspendedAt} />, hide: suspendedAt === undefined },
    { columnName: t('Resume Requested'), value: <DatetimeString date={resumedAt} />, hide: resumedAt === undefined },
    { columnName: t('Cancel Requested'), value: <DatetimeString date={canceledAt} />, hide: canceledAt === undefined },
  ];

  // Rollback status
  const rollbackStatus = data?.rollback?.status;
  const rollbackStartedAt = data?.rollback?.startedAt;
  const rollbackSuspendedAt = data?.rollback?.suspendedAt;
  const rollbackResumedAt = data?.rollback?.resumedAt;
  const rollbackEndedAt = data?.rollback?.endedAt;

  const rollbackTableData = [
    {
      columnName: t('Status'),
      value: <StatusWithIcon status={rollbackStatus} type='Rollback' />,
    },
    { columnName: t('Started'), value: <DatetimeString date={rollbackStartedAt} /> },
    { columnName: t('Ended'), value: <DatetimeString date={rollbackEndedAt} /> },
    {
      columnName: t('Suspended.at'),
      value: <DatetimeString date={rollbackSuspendedAt} />,
      hide: rollbackSuspendedAt === undefined,
    },
    {
      columnName: t('Resume Requested'),
      value: <DatetimeString date={rollbackResumedAt} />,
      hide: rollbackResumedAt === undefined,
    },
  ];

  return (
    <Grid>
      <Grid.Col span={6}>
        <HorizontalTable title={t('Apply Status')} tableData={tableData} loading={loading} />
      </Grid.Col>
      <Grid.Col span={6}>
        <HorizontalTable title={t('Rollback Status')} tableData={rollbackTableData} loading={loading} />
      </Grid.Col>
    </Grid>
  );
};

const StatusWithIcon = ({
  status,
  type,
}: {
  status: ApplyStatus | RollbackStatus | undefined;
  type: 'Apply' | 'Rollback';
}) => {
  const t = useTranslations();
  return (
    <Group gap={5}>
      <StatusToIcon status={status} target={type} />
      {status ? t(STATUS_TO_LABEL[status]) : ''}
    </Group>
  );
};
