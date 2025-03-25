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

import { Button, Group, Stack, Text } from '@mantine/core';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';

import { MessageBox } from '@/shared-modules/components';

import { APIPolicies, APIPolicyError, ModalMode } from '@/types';

/**
 * Component that displays a confirmation for deleting/enabling/disabling a policy condition
 *
 * @param props - The component props.
 * @returns The PolicyConfirmModal component.
 */
export const PolicyConfirmModal = (props: {
  modalMode: ModalMode;
  selectedPolicyId?: string;
  policyTitle?: string;
  modalClose: () => void;
  submit: CallableFunction;
  error: AxiosError<APIPolicyError> | undefined;
  data?: APIPolicies;
}) => {
  const t = useTranslations();
  const { selectedPolicyId, modalMode, modalClose, policyTitle, submit, error } = props;
  const policyModalMode = {
    delete: t('Delete'),
    enable: t('Enable'),
    disable: t('Disable'),
    edit: t('Edit'),
    add: t('Add'),
  };
  const confirmMessage = (mode: typeof modalMode) => {
    switch (mode) {
      case 'delete':
        return t('Do you want to delete "{policyTitle}"?', { policyTitle });
      case 'enable':
        return t('Do you want to enable "{policyTitle}"?', { policyTitle });
      case 'disable':
        return t('Do you want to disable "{policyTitle}"?', { policyTitle });
    }
  };

  const operation = modalMode && policyModalMode[modalMode];

  return (
    <>
      <Stack>
        {error && (
          <>
            <MessageBox
              type='error'
              title={t('Failed to {operation} policy', { operation: operation?.toLowerCase() })}
              message={
                <>
                  <Text>{error.message}</Text>
                  {error.response && (
                    <Text>
                      {error.response.data.message} ({error.response.data.code})
                    </Text>
                  )}
                </>
              }
            />
          </>
        )}
        <Text py={5}>{confirmMessage(modalMode)}</Text>
        <Group gap={10} justify='end'>
          <Button variant='outline' color='dark' onClick={modalClose}>
            {t('No')}
          </Button>
          <Button
            color={modalMode === 'delete' ? 'red.6' : undefined}
            onClick={() => {
              modalMode === 'delete'
                ? submit(selectedPolicyId)
                : submit(selectedPolicyId, modalMode === 'enable' ? true : false);
            }}
          >
            {t('Yes')}
          </Button>
        </Group>
      </Stack>
    </>
  );
};
