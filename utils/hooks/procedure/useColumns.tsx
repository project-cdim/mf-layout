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
import _ from 'lodash';
import { DataTableColumnGroup, DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import {
  MultiSelectForTableFilter,
  NumberRangeForTableFilter,
  PageLink,
  TextInputForTableFilter,
} from '@/shared-modules/components';
import { ApplyProcedureStatus } from '@/shared-modules/types';

import { APPProcedureWithResult } from '@/types';

import { RESULT_TO_LABEL } from '@/utils/constant';
import { StatusToIcon } from '@/components/StatusToIcon';

import { ApplyProcedureFilter } from './useFilter';

/**
 * Constructs columns for procedure step table
 * @params filter - Filter object
 * @params displayColumns - Array of column accessors or column groups id to display
 * @returns Column information
 */
export const useColumns = (filter: ApplyProcedureFilter, displayColumns: (string | null)[]) => {
  const t = useTranslations();
  const isGroupNecessary = displayColumns.some((word) => word === 'apply' || word === 'rollback');
  const commonColumns: DataTableColumn<APPProcedureWithResult>[] = [
    {
      accessor: 'operationID',
      title: t('ID'),
      sortable: true,
      filter: <NumberRangeForTableFilter values={filter.query.ID} setValues={filter.setQuery.ID} />,
      filtering: filter.query.ID.some((val) => val !== undefined),
    },
    {
      accessor: 'targetCPUID',
      title: t('Host CPU ID'),
      hidden: !displayColumns.includes('targetCPUID'),
      render: ({ targetCPUID }) => {
        return <ResourceIdWithPageLink id={targetCPUID} />;
      },
      filter: (
        <>
          <TextInputForTableFilter
            label={t('Host CPU ID')}
            value={filter.query.targetCPUID}
            setValue={filter.setQuery.targetCPUID}
          />
        </>
      ),
      filtering: filter.query.targetCPUID !== '',
    },
    {
      accessor: 'targetDevice',
      title: t('Target Device'),
      hidden: !displayColumns.includes('targetDevice'),
      render: ({ targetDevice }) => {
        return <ResourceIdWithPageLink id={targetDevice} />;
      },
      filter: (
        <>
          <TextInputForTableFilter
            label={t('Target Device')}
            value={filter.query.targetDeviceID}
            setValue={filter.setQuery.targetDeviceID}
          />
        </>
      ),
      filtering: filter.query.targetDeviceID !== '',
    },
  ];
  const defaultCol: DataTableColumnGroup<APPProcedureWithResult>[] = [
    {
      id: 'common',
      title: <></>,
      columns: commonColumns,
    },
    {
      id: 'apply',
      title: t('Apply'),
      columns: displayColumns.includes('apply')
        ? [
            {
              accessor: 'operation',
              title: t('Operation Type'),
              render: ({ apply: { operation } }) => <>{t(_.capitalize(operation))}</>,
              filter: (
                <MultiSelectForTableFilter
                  label={t('Operation Type')}
                  options={filter.selectOptions.operation}
                  value={filter.query.operation}
                  setValue={filter.setQuery.operation as (p: string[]) => void}
                />
              ),
              filtering: filter.query.operation.length > 0,
            },
            {
              accessor: 'dependencies',
              title: t('Dependency ID'),
              render: ({ apply: { dependencies } }) => <>{dependencies.join(', ')}</>,
              filter: (
                <NumberRangeForTableFilter
                  values={filter.query.dependencies}
                  setValues={filter.setQuery.dependencies}
                />
              ),
              filtering: filter.query.dependencies.some((val) => val !== undefined),
            },

            {
              accessor: 'result',
              title: t('Result.execution'),
              render: ({ apply: { status } }) => (status ? <ResultWithIcon status={status} /> : null),
              filter: (
                <MultiSelectForTableFilter
                  label={t('Result.execution')}
                  options={filter.selectOptions.status}
                  value={filter.query.status}
                  setValue={filter.setQuery.status as (p: string[]) => void}
                />
              ),
              filtering: filter.query.status.length > 0,
            },
          ]
        : [],
    },
    {
      id: 'rollback',
      title: t('Rollback'),
      columns: displayColumns.includes('rollback')
        ? [
            {
              accessor: 'rollbackOperation',
              title: t('Operation Type'),
              render: ({ rollback }) => (rollback?.operation ? <>{t(_.capitalize(rollback.operation))}</> : null),
              filter: (
                <MultiSelectForTableFilter
                  label={t('Operation Type')}
                  options={filter.selectOptions.rollbackOperation}
                  value={filter.query.rollbackOperation}
                  setValue={filter.setQuery.rollbackOperation as (p: string[]) => void}
                />
              ),
              filtering: filter.query.rollbackOperation.length > 0,
            },
            {
              accessor: 'rollbackDependencies',
              title: t('Dependency ID'),
              render: ({ rollback }) => (rollback?.dependencies ? <>{rollback.dependencies.join(', ')}</> : null),
              filter: (
                <NumberRangeForTableFilter
                  values={filter.query.rollbackDependencies}
                  setValues={filter.setQuery.rollbackDependencies}
                />
              ),
              filtering: filter.query.rollbackDependencies.some((val) => val !== undefined),
            },
            {
              accessor: 'rollbackResult',
              title: t('Result.execution'),
              render: ({ rollback }) => (rollback?.status ? <ResultWithIcon status={rollback.status} /> : null),
              filter: (
                <MultiSelectForTableFilter
                  label={t('Result.execution')}
                  options={filter.selectOptions.rollbackStatus}
                  value={filter.query.rollbackStatus}
                  setValue={filter.setQuery.rollbackStatus as (p: string[]) => void}
                />
              ),
              filtering: filter.query.rollbackStatus.length > 0,
            },
          ]
        : [],
    },
  ];

  return { isGroupNecessary, defaultCol, commonColumns };
};

const ResourceIdWithPageLink = ({ id }: { id: string | undefined }) => {
  const t = useTranslations();

  if (!id) return null;
  // id format is 'DeviceType(id)' or 'id'. Extract the ID part.
  const match = id.match(/\((.*)\)/)?.[1] ?? id;

  return (
    <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id: match }}>
      {id}
    </PageLink>
  );
};

const ResultWithIcon = ({ status }: { status: ApplyProcedureStatus }) => {
  const t = useTranslations();
  return (
    <Group gap={5}>
      <StatusToIcon status={status} target='Operation' />
      {t(RESULT_TO_LABEL[status])}
    </Group>
  );
};
