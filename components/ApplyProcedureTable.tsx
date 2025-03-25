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

import { useState } from 'react';

import { Box, Checkbox, Group, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { CustomDataTable } from '@/shared-modules/components';
import { useColorStyles } from '@/shared-modules/styles/styles';
import { useLoading } from '@/shared-modules/utils/hooks';

import { APPProcedureWithResult } from '@/types';

import { useLayoutApplyDetail } from '@/utils/hooks';
import { useColumns, useFilter } from '@/utils/hooks/procedure';

/**
 * Layout Applies Procedure Table.
 *
 * @returns Table component which shows the migration steps.
 */
export const ApplyProcedureTable = () => {
  const color = useColorStyles();
  const t = useTranslations();

  const filter = useFilter();
  const [displayColumns, setDisplayColumns] = useState<string[]>(['targetCPUID', 'targetDevice', 'apply', 'rollback']);
  const { isGroupNecessary, defaultCol: columnGroups, commonColumns } = useColumns(filter, displayColumns);

  const { isValidating } = useLayoutApplyDetail();
  const loading = useLoading(isValidating.layout || isValidating.resource);

  const hasError = (record: APPProcedureWithResult): boolean => {
    return record.apply.status === 'FAILED' || record.rollback?.status === 'FAILED';
  };

  return (
    <>
      <Title order={2} fz='lg'>
        {t('Migration Steps')}
      </Title>

      <Stack gap='xl'>
        <Group align='center' wrap='nowrap' gap='xl'>
          <Text fz='xs' style={{ flex: '0 0 auto' }}>
            {t('Visible')}
          </Text>
          <Checkbox.Group value={displayColumns} onChange={setDisplayColumns}>
            <Group>
              {/* every columns in common group except operationID column */}
              {columnGroups[0].columns.slice(1).map((column) => (
                <Checkbox key={column.accessor} value={column.accessor} label={column.title} />
              ))}
              {/* apply and rollback column groups */}
              {columnGroups.slice(1).map((group) => (
                <Checkbox key={group.id} value={group.id} label={group.title} />
              ))}
            </Group>
          </Checkbox.Group>
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
              content: ({ record }) => (
                <Box bg={color.red.backgroundColor} p={5}>
                  {record.apply.status === 'FAILED' && (
                    <>
                      <Group gap={5} align='center'>
                        <IconAlertCircleFilled size={20} style={{ color: color.red.color }} />
                        <Text fz='sm'>{t('{action} Failed', { action: t('Apply') })}</Text>
                      </Group>
                      <Text fz='sm'>{`${t('Error Code')} : ${record.apply.error?.code ?? '-'}`}</Text>
                      <Text fz='sm'>{`${t('Message')} : ${record.apply.error?.message ?? '-'}`}</Text>
                    </>
                  )}
                  {record.rollback?.status === 'FAILED' && (
                    <>
                      <Group gap={5} align='center'>
                        <IconAlertCircleFilled size={20} style={{ color: color.red.color }} />
                        <Text fz='sm'>{t('{action} Failed', { action: t('Rollback') })}</Text>
                      </Group>
                      <Text fz='sm'>{`${t('Error Code')} : ${record.rollback.error?.code ?? '-'}`}</Text>
                      <Text fz='sm'>{`${t('Message')} : ${record.rollback.error?.message ?? '-'}`}</Text>
                    </>
                  )}
                </Box>
              ),
            },
            // https://icflorescu.github.io/mantine-datatable/examples/non-standard-record-ids/
            idAccessor: 'operationID',
          }}
          defaultSortColumn={'operationID'}
          loading={loading}
        />
      </Stack>
    </>
  );
};
