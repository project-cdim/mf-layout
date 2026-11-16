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

import { useState } from 'react';

import { useDisclosure } from '@mantine/hooks';
import type { AxiosError, AxiosResponse } from 'axios';
import { useTranslations } from 'next-intl';

import { ApplyAction } from '@/types';

import { useLayoutApplyDetail } from '.';

export const useLayoutApplyControlConfirmModal = (props: { id: string }) => {
  // props
  const { id } = props;
  // state
  const [isOpen, { open, close }] = useDisclosure(false);
  const [action, setAction] = useState<ApplyAction | undefined>(undefined);
  const [submitFunction, setSubmitFunction] = useState<(() => void) | undefined>(undefined);
  const [error, setError] = useState<AxiosError<{ code: string; message: string }> | undefined>(undefined);
  const [response, setResponse] = useState<AxiosResponse<{ status: string }> | undefined>(undefined);
  // const
  const t = useTranslations();
  const { data } = useLayoutApplyDetail();
  const isRollback = Boolean(data?.rollback?.status);
  const displayAction = action ? t(action) : '';
  const errorTitle = !isRollback
    ? t('Failed to "{action}" the layout apply', { action: displayAction })
    : t('Failed to "{action}" the rollback', { action: displayAction });
  const confirmMessage = !isRollback
    ? t('Do you want to "{action}" the layout apply?', { action: displayAction })
    : t('Do you want to "{action}" the rollback?', { action: displayAction });
  const successMessage = !isRollback
    ? t('Requested "{action}" the layout apply', { action: displayAction })
    : t('Requested "{action}" the rollback', { action: displayAction });
  return {
    open,
    setAction,
    setSubmitFunction,
    setError,
    response,
    setResponse,
    successMessage,
    modalProps: {
      close,
      submitFunction,
      id,
      isOpen,
      confirmTitle: displayAction,
      confirmMessage,
      submitButtonLabel: t('Yes'),
      cancelButtonLabel: t('No'),
      errorTitle,
      error,
    },
  };
};
