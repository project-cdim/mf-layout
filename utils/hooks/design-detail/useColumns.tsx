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

import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

import {
  MultiSelectForTableFilter,
  NumberRangeForTableFilter,
  TextInputForTableFilter,
} from '@/shared-modules/components';

import { ResourceIdWithPageLink } from '@/components';
import { APPProcedure } from '@/types';
import _ from 'lodash';
import { DesignProcedureFilter } from './useFilter';

/**
 * Constructs columns for the procedure list of the design detail.
 *
 * @returns Column information
 */
export const useColumns = (filter: DesignProcedureFilter): DataTableColumn<APPProcedure>[] => {
  const t = useTranslations();
  const defaultCol: DataTableColumn<APPProcedure>[] = [
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
    {
      accessor: 'operation',
      title: t('Operation Type'),
      render: ({ operation }) => <>{t(_.capitalize(operation))}</>,
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
      render: ({ dependencies }) => <>{dependencies.join(', ')}</>,
      filter: <NumberRangeForTableFilter values={filter.query.dependencies} setValues={filter.setQuery.dependencies} />,
      filtering: filter.query.dependencies.some((val) => val !== undefined),
    },
  ];
  return defaultCol;
};
