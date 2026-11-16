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

import { Group, Modal, Title, Text } from '@mantine/core';

import { APPNodeConfigurationPolicy, APPSystemOperationPolicy } from '@/types';
import { PolicyConfirmModal, PolicyEditModal } from '@/components';
import { usePolicyModal } from '@/utils/hooks';
import { useTranslations } from 'next-intl';

export const PolicyModal = (
  props: ReturnType<typeof usePolicyModal>[0] & Pick<ReturnType<typeof usePolicyModal>[1], 'setModalClose'>
) => {
  const t = useTranslations();
  const {
    data,
    modalOpened,
    modalMode,
    category,
    selectedPolicyId,
    policyTitle,
    modalTitle,
    submitFunc,
    inputStatus,
    modalError,
    setModalClose,
  } = props;

  const ModalInnerComponent = () => {
    switch (modalMode) {
      case 'delete':
      case 'enable':
      case 'disable': {
        const props = {
          modalMode,
          selectedPolicyId,
          policyTitle,
          modalClose: setModalClose,
          submit: submitFunc,
          error: modalError,
        };
        return <PolicyConfirmModal {...props} />;
      }
      case 'add':
      case 'edit': {
        const modalProps = {
          data,
          modalMode,
          selectedPolicyId,
          policyTitle,
          modalClose: setModalClose,
          submit: submitFunc,
          inputStatus,
          category,
          error: modalError,
        };
        if (modalProps.category === 'nodeConfigurationPolicy') {
          const props = {
            ...modalProps,
            category: 'nodeConfigurationPolicy',
            inputStatus: inputStatus as APPNodeConfigurationPolicy,
          } as const;
          return <PolicyEditModal {...props} />;
        } else if (modalProps.category === 'systemOperationPolicy') {
          const props = {
            ...modalProps,
            category: 'systemOperationPolicy',
            inputStatus: inputStatus as APPSystemOperationPolicy,
          } as const;
          return <PolicyEditModal {...props} />;
        }
      }
    }
  };
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'nodeConfigurationPolicy':
        return 'Node Layout Policy';
      case 'systemOperationPolicy':
        return 'System Operation Policy';
    }
  };
  return (
    <Modal
      opened={modalOpened}
      onClose={setModalClose}
      lockScroll={false}
      title={
        <>
          <Text size='xs'>{category && t(getCategoryName(category))}</Text>
          <Group>
            <Title order={3} fz='lg' fw={700}>
              {modalTitle}
            </Title>
            {selectedPolicyId && (
              <Group gap={5} fz='sm' c='gray.7'>
                <Text>{t('ID')}</Text>
                <Text>:</Text>
                <Text>{selectedPolicyId}</Text>
              </Group>
            )}
          </Group>
        </>
      }
      size={550}
    >
      <ModalInnerComponent />
    </Modal>
  );
};
