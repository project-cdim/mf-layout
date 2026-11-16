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

'use client';

import { useEffect, useMemo } from 'react';

import { Box, Group, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

// import { ColumnVisibilityButton } from '@/shared-modules/components/ColumnVisibilityButton';
import { CustomDataTable } from '@/shared-modules/components';
import { useColorStyles } from '@/shared-modules/styles/styles';
import { useLoading, useTableSettings } from '@/shared-modules/utils/hooks';

import { APPProcedureWithResult } from '@/types';

import { useLayoutApplyDetail } from '@/utils/hooks';
import { useColumns, useFilter } from '@/utils/hooks/procedure';

/**
 * Layout Applies Procedure Table.
 *
 * @returns Table component which shows the migration steps.
 */
export const ApplyProcedureTable = ({ onStorageError }: { onStorageError?: (error: Error | undefined) => void }) => {
  const color = useColorStyles();
  const t = useTranslations();

  const filter = useFilter();

  /** Default accessors for columns */
  const defaultAccessors = useMemo(() => ['id', 'targetCPUID', 'targetDevice', 'apply', 'rollback'], []);

  /** Key for storing column settings */
  const storeColumnsKey = 'layout-apply-detail.apply-procedure-table';

  // Column definitions with labels
  const columnDefinitions = useMemo(
    () => [
      { id: 'id', label: t('ID'), fixed: true },
      { id: 'targetCPUID', label: t('Host CPU ID'), fixed: false },
      { id: 'targetDevice', label: t('Target Device'), fixed: false },
      { id: 'apply', label: t('Apply'), fixed: false },
      { id: 'rollback', label: t('Rollback'), fixed: false },
    ],
    [t]
  );

  const { columns, defaultColumns, selectedAccessors, handleSaveTableSettings, storageError } = useTableSettings(
    columnDefinitions,
    defaultAccessors,
    storeColumnsKey
  );

  const { isGroupNecessary, defaultCol: columnGroups, commonColumns } = useColumns(filter, selectedAccessors);

  const { isValidating } = useLayoutApplyDetail();
  const loading = useLoading(isValidating.layout || isValidating.resource);

  const hasError = (record: APPProcedureWithResult): boolean => {
    return record.apply.status === 'FAILED' || record.rollback?.status === 'FAILED';
  };

  const renderApplyError = (record: APPProcedureWithResult) => {
    if (record.apply.status !== 'FAILED') return null;
    return (
      <>
        <Group gap={5} align='center'>
          <IconAlertCircleFilled size={20} style={{ color: color.red.color }} />
          <Text fz='sm'>{t('{action} Failed', { action: t('Apply') })}</Text>
        </Group>
        <Text fz='sm'>{`${t('Error Code')} : ${record.apply.error?.code ?? '-'}`}</Text>
        <Text fz='sm'>{`${t('Message')} : ${record.apply.error?.message ?? '-'}`}</Text>
      </>
    );
  };

  const renderRollbackError = (record: APPProcedureWithResult) => {
    if (record.rollback?.status !== 'FAILED') return null;
    return (
      <>
        <Group gap={5} align='center'>
          <IconAlertCircleFilled size={20} style={{ color: color.red.color }} />
          <Text fz='sm'>{t('{action} Failed', { action: t('Rollback') })}</Text>
        </Group>
        <Text fz='sm'>{`${t('Error Code')} : ${record.rollback.error?.code ?? '-'}`}</Text>
        <Text fz='sm'>{`${t('Message')} : ${record.rollback.error?.message ?? '-'}`}</Text>
      </>
    );
  };
  const renderErrorContent = (record: APPProcedureWithResult) => (
    <Box bg={color.red.backgroundColor} p={5}>
      {renderApplyError(record)}
      {renderRollbackError(record)}
    </Box>
  );

  // Notify parent component of storage errors
  useEffect(() => {
    if (onStorageError) {
      onStorageError(storageError);
    }
  }, [storageError, onStorageError]);

  return (
    <Stack gap='md'>
      <Group>
        <Title order={2} fz='lg'>
          {t('Migration Steps')}
        </Title>
        {/* <ColumnVisibilityButton
          tableName={t('Migration Steps')}
          columns={columns}
          defaultColumns={defaultColumns}
          onSave={handleSaveColumnVisibility}
        /> */}
      </Group>

      <CustomDataTable
        records={filter.filteredRecords}
        {...(isGroupNecessary ? { groups: columnGroups } : { columns: commonColumns })}
        otherTableProps={{
          // Note that rowBackgroundColor property does not work, because of a conflict with striped property
          rowStyle: (record: APPProcedureWithResult) => {
            if (hasError(record)) return { backgroundColor: color.red.backgroundColor };
          },
          rowExpansion: {
            allowMultiple: true,
            expandable: ({ record }) => hasError(record),
            content: ({ record }) => renderErrorContent(record),
          },
          // https://icflorescu.github.io/mantine-datatable/examples/non-standard-record-ids/
          idAccessor: 'operationID',
        }}
        defaultSortColumn={'operationID'}
        loading={loading}
        showSettingsButton={true}
        tableName={t('Migration Steps')}
        settingsColumns={columns}
        defaultColumns={defaultColumns}
        onSaveTableSettings={handleSaveTableSettings}
      />
    </Stack>
  );
};
