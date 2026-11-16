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

import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { MessageBox, PageHeader } from '@/shared-modules/components';
import { MANAGE_LAYOUT } from '@/shared-modules/constant';
import { fetcher } from '@/shared-modules/utils/fetcher';
import {
  useLoading,
  /* useMSW, */
  usePermission,
} from '@/shared-modules/utils/hooks';

import { APIPolicies } from '@/types';

import { PolicyCard, PolicyCards, PolicyModal } from '@/components';
import { usePolicyModal } from '@/utils/hooks';

/**
 * Policy page
 *
 * @returns Page content
 */
const Policy = () => {
  const hasPermission = usePermission(MANAGE_LAYOUT);
  const t = useTranslations();
  const items = [{ title: t('Layout Management') }, { title: t('Policies') }];

  // Policy information for displaying messages
  const [successInfo, setSuccessInfo] = useState<{ id: string; title: string; operation: string } | undefined>(
    undefined
  );

  // const mswInitializing = useMSW();
  const mswInitializing = false;
  const { data, error, /* isLoading, */ isValidating, mutate } = useSWRImmutable<APIPolicies>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies?sortBy=createdAt&orderBy=desc`,
    fetcher
  );
  const loading = useLoading(isValidating || mswInitializing);

  const policyModalProps = usePolicyModal({ data, setSuccessInfo, mutate });
  const { changeModalMode, setCategory, setSelectedPolicyId, setModalOpen } = policyModalProps[1];

  // handlers
  /** Functions passed to PolicyCard */
  const policyCardFunctions = {
    deletePolicy: (id: string, category: 'nodeConfigurationPolicy' | 'systemOperationPolicy') => {
      changeModalMode('delete');
      setCategory(category);
      setSelectedPolicyId(id);
      setModalOpen();
    },
    enablePolicy: (id: string, category: 'nodeConfigurationPolicy' | 'systemOperationPolicy') => {
      changeModalMode('enable');
      setCategory(category);
      setSelectedPolicyId(id);
      setModalOpen();
    },
    disablePolicy: (id: string, category: 'nodeConfigurationPolicy' | 'systemOperationPolicy') => {
      changeModalMode('disable');
      setCategory(category);
      setSelectedPolicyId(id);
      setModalOpen();
    },
    editPolicy: (id: string, category: 'nodeConfigurationPolicy' | 'systemOperationPolicy') => {
      changeModalMode('edit');
      setCategory(category);
      setSelectedPolicyId(id);
      setModalOpen();
    },
  };

  const addPolicy = (category: 'nodeConfigurationPolicy' | 'systemOperationPolicy') => {
    changeModalMode('add');
    setCategory(category);
    setSelectedPolicyId(undefined);
    setModalOpen();
  };
  // /handlers

  return (
    <>
      <Stack gap='xl'>
        <PageHeader pageTitle={t('Policies')} items={items} mutate={mutate} loading={loading} />

        {successInfo && (
          <MessageBox
            type='success'
            title={t('The policy has been successfully {operation}', {
              operation: successInfo.operation.toLowerCase(),
            })}
            message={
              <Stack gap={0}>
                <Text>
                  {t('ID')} : {successInfo.id}
                </Text>
                <Text>
                  {t('Title')} : {successInfo.title}
                </Text>
              </Stack>
            }
            close={() => setSuccessInfo(undefined)}
          />
        )}
        {error && <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />}

        <Stack gap='md'>
          <Group>
            <Title order={2} fz='lg' fw={700}>
              {t('Node Layout Policy')}
            </Title>
            <Button
              size='xs'
              variant='outline'
              color='black'
              disabled={!hasPermission}
              onClick={() => addPolicy('nodeConfigurationPolicy')}
              title={`${t('Node Layout Policy')} ${t('Add')}`}
            >
              {t('Add')}
            </Button>
          </Group>
          <PolicyCards>
            {data?.policies
              .filter((policy) => policy.category === 'nodeConfigurationPolicy')
              .map((policy, index) => (
                <PolicyCard policy={policy} loading={loading} key={`node_${index}`} functions={policyCardFunctions} />
              ))}
          </PolicyCards>
        </Stack>

        <Stack gap='md'>
          <Group>
            <Title order={2} fz='lg' fw={700}>
              {t('System Operation Policy')}
            </Title>
            <Button
              size='xs'
              variant='outline'
              color='black'
              disabled={!hasPermission}
              onClick={() => addPolicy('systemOperationPolicy')}
              title={`${t('System Operation Policy')} ${t('Add')}`}
            >
              {t('Add')}
            </Button>
          </Group>
          <PolicyCards>
            {data?.policies
              .filter((policy) => policy.category === 'systemOperationPolicy')
              .map((policy, index) => (
                <PolicyCard policy={policy} loading={loading} key={`sys_${index}`} functions={policyCardFunctions} />
              ))}
          </PolicyCards>
        </Stack>
      </Stack>
      <PolicyModal {...{ ...policyModalProps[0], setModalClose: policyModalProps[1].setModalClose }} />
    </>
  );
};

export default Policy;
