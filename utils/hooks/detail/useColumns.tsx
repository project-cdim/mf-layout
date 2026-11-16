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

import { PageLink } from '@/shared-modules/components';

import { APPProcedure } from '@/types';

/**
 * Constructs columns for the configuration history list of the overall summary.
 *
 * @returns Column information
 */
export const useColumns = (): DataTableColumn<APPProcedure>[] => {
  const t = useTranslations();
  const defaultCol: DataTableColumn<APPProcedure>[] = [
    {
      accessor: 'operationID',
      title: t('ID'),
      sortable: true,
    },
    {
      accessor: 'operation',
      title: t('Operation Type'),
      sortable: true,
    },
    {
      accessor: 'hostCpuID',
      title: t('Host CPU ID'),
      sortable: true,
      render: ({ hostCpuID }) => {
        return (
          <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id: hostCpuID }}>
            {hostCpuID}
          </PageLink>
        );
      },
    },
    {
      accessor: 'targetDeviceID',
      title: t('Device ID'),
      sortable: true,
      render: ({ targetDeviceID }) => {
        return (
          <PageLink title={t('Resource Details')} path='/cdim/res-resource-detail' query={{ id: targetDeviceID }}>
            {targetDeviceID}
          </PageLink>
        );
      },
    },
    {
      accessor: 'dependencies',
      title: t('Dependency ID'),
      sortable: true,
    },
    {
      /** Execution result status (endDate) */
      accessor: 'result',
      title: t('Result.normal'),
      sortable: true,
    },
  ];

  return defaultCol;
};
