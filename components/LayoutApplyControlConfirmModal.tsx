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

import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { MessageBox } from '@/shared-modules/components';

import { useLayoutApplyControlConfirmModal } from '@/utils/hooks';

export const LayoutApplyControlConfirmModal = (
  props: Omit<
    ReturnType<typeof useLayoutApplyControlConfirmModal>,
    'open' | 'setAction' | 'setSubmitFunction' | 'setError' | 'successMessage' | 'setResponse' | 'response'
  >
) => {
  const {
    close,
    submitFunction,
    id,
    isOpen,
    confirmTitle,
    confirmMessage,
    submitButtonLabel,
    cancelButtonLabel,
    errorTitle,
    error,
  } = props.modalProps;
  return (
    <Modal
      opened={isOpen}
      onClose={close}
      lockScroll={false}
      title={<ModalTitle id={id} title={confirmTitle} />}
      size={550}
    >
      <Stack>
        {error && (
          <MessageBox
            type='error'
            title={errorTitle}
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
        )}
        <Text py={5}>{confirmMessage}</Text>
        <Group gap={10} justify='end'>
          <Button variant='outline' color='dark' onClick={close}>
            {cancelButtonLabel}
          </Button>
          <Button onClick={submitFunction}>{submitButtonLabel}</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const ModalTitle = ({ id, title }: { id: string; title: string }) => {
  const t = useTranslations();

  return (
    <Group>
      <Title order={3} fz='lg' fw={700}>
        {title}
      </Title>
      {id && (
        <Group gap={5} fz='sm' c='gray.7'>
          <Text>{t('ID')}</Text>
          <Text>:</Text>
          <Text>{id}</Text>
        </Group>
      )}
    </Group>
  );
};
