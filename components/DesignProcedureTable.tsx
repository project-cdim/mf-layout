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

import { Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { CustomDataTable } from '@/shared-modules/components';
import { useLoading } from '@/shared-modules/utils/hooks';

import { useLayoutDesignDetail } from '@/utils/hooks';
import { useFilter } from '@/utils/hooks/design-detail/useFilter';
import { useColumns } from '@/utils/hooks/design-detail/useColumns';

/**
 * Layout Design Procedure Table.
 *
 * @returns Table component which shows the migration steps.
 */
export const DesignProcedureTable = () => {
  const t = useTranslations();
  const { isValidating } = useLayoutDesignDetail();

  const loading = useLoading(isValidating.layout);

  /** Custom hook for filtering */
  const filter = useFilter();

  /** Column configuration */
  const columns = useColumns(filter);

  return (
    <>
      <Title order={2} fz='lg'>
        {t('Migration Steps')}
      </Title>
      <CustomDataTable
        records={filter.filteredRecords}
        columns={columns}
        defaultSortColumn='operationID'
        defaultSortDirection='asc'
        loading={loading}
        otherTableProps={{
          // unique ID property
          idAccessor: 'operationID',
        }}
      />
    </>
  );
};
