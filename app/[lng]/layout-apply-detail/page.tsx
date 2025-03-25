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

import { Box, Group, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { CardLoading, MessageBox, PageHeader } from '@/shared-modules/components';
import { useLoading, useQuery } from '@/shared-modules/utils/hooks';

import {
  ApplyProcedureTable,
  LayoutApplyControlButtons,
  LayoutApplyControlConfirmModal,
  StatusTables,
} from '@/components';

import { useLayoutApplyControlButtons, useLayoutApplyDetail } from '@/utils/hooks';
import { useLayoutApplyControlConfirmModal } from '@/utils/hooks/useLayoutApplyControlConfirmModal';
import { AxiosResponse } from 'axios';

/**
 * Layout Applies Page.
 *
 * @returns Page content
 */
const LayoutApplyDetail = () => {
  const t = useTranslations();
  const { id } = useQuery();
  const breadcrumbs = [
    { title: t('Layout Management') },
    { title: t('LayoutApplies.list'), href: '/cdim/lay-layout-apply-list' },
    { title: `${t('Layout Apply Details')} <${id}>` },
  ];

  // Get the returns of SWR which fetch layout apply data
  const { data, error, isValidating, mutate } = useLayoutApplyDetail();
  const loading = useLoading(isValidating.resource || isValidating.layout);
  const loadingLayout = useLoading(isValidating.layout);
  const {
    open: openModal,
    setSubmitFunction,
    setAction,
    setError,
    response,
    setResponse,
    successMessage,
    modalProps,
  } = useLayoutApplyControlConfirmModal({ id: data?.applyID || '' });
  const layoutApplyControlButtonsProps = useLayoutApplyControlButtons({
    status: data?.apply.status,
    rollbackStatus: data?.rollback?.status,
    applyID: data?.applyID || '',
    pageReload: mutate,
    setFunction: setSubmitFunction,
    setAction,
    openModal,
    closeModal: modalProps.close,
    setResponse,
    setError,
  });
  const reload = () => {
    mutate();
    setResponse(undefined);
  };
  return (
    <>
      <Stack>
        <PageHeader pageTitle={t('Layout Apply Details')} items={breadcrumbs} mutate={reload} loading={loading} />
        <Message error={error} response={response} successMessage={successMessage} setResponse={setResponse} />
        <CardLoading withBorder w='fit-content' loading={loadingLayout}>
          <Group gap={30}>
            <Box>
              <Text fz='sm'>{t('Layout Apply ID')}</Text>
              <Text fz='lg' fw={500}>
                {data?.applyID}
              </Text>
            </Box>
            {/** Display buttons according to each situation */}
            <LayoutApplyControlButtons {...layoutApplyControlButtonsProps} />
          </Group>
        </CardLoading>
        <StatusTables />
        <ApplyProcedureTable />
      </Stack>
      <LayoutApplyControlConfirmModal modalProps={modalProps} />
    </>
  );
};

const Message = (props: {
  error: { layout: any; resource: any };
  response: AxiosResponse | undefined;
  successMessage: string;
  setResponse: (response: undefined) => void;
}) => {
  const { error, response, successMessage, setResponse } = props;
  return (
    <>
      {response && (
        <MessageBox type='success' title={successMessage} message={''} close={() => setResponse(undefined)} />
      )}
      {Object.entries(error).map(
        ([key, err]) =>
          err && <MessageBox key={key} type='error' title={err.message} message={err.response?.data.message || ''} />
      )}
    </>
  );
};

export default LayoutApplyDetail;
