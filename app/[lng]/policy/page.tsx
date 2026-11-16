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

import { ActionIcon, Group, Modal, Space, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios';
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

import {
  APIDeviceTypeLowerCamel,
  APIHardwareConnection, // APINodePolicy,
  APIPolicies,
  APIPolicyError,
  APIPutPolicy, // APISystemPolicy,
  APIUseThreshold,
  APPPolicies,
  ModalMode, // ModalTitle,
} from '@/types';
import { APIPostPolicy } from '@/types/APIPostPolicies';

import { PolicyCard, PolicyCards, PolicyConfirmModal, PolicyEditModal } from '@/components';

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

  /** Functions passed to PolicyCard */
  const functions = {
    deletePolicy: (id: string) => {
      setModalMode('delete');
      setSelectedPolicyId(id);
      setModalOpen();
    },
    enablePolicy: (id: string) => {
      setModalMode('enable');
      setSelectedPolicyId(id);
      setModalOpen();
    },
    disablePolicy: (id: string) => {
      setModalMode('disable');
      setSelectedPolicyId(id);
      setModalOpen();
    },
    editPolicy: (id: string) => {
      setModalMode('edit');
      setSelectedPolicyId(id);
      setModalOpen();
    },
  };
  const addPolicy = () => {
    setModalMode('add');
    setSelectedPolicyId(undefined);
    setModalOpen();
  };

  /** Function called on submit */
  const submitDelete = (policyId: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies/${policyId}`)
      .then(() => {
        setModalClose();
        // Display API request success message
        setSuccessInfo({ id: policyId, title: findPolicy(policyId)?.title as string, operation: t('Delete') });
        // Fetch again
        mutate();
        return;
      })
      .catch((error) => {
        setModalError(error);
      });
  };
  const submitChangeEnabled = (policyId: string, enabled: boolean) => {
    const data = enabled ? { enableIDList: [policyId] } : { disableIDList: [policyId] };
    axios
      .put(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies/change-enabled`, data)
      .then(() => {
        setModalClose();
        // Display API request success message
        setSuccessInfo({
          id: policyId,
          title: findPolicy(policyId)?.title as string,
          operation: enabled ? t('Enable') : t('Disable'),
        });
        // Fetch again
        mutate();
        return;
      })
      .catch((error) => {
        setModalError(error);
      });
  };

  const makeAPIPolicy = (APPPolicies: APPPolicies) => {
    const { policies, category } = APPPolicies;
    if (category === 'nodeConfigurationPolicy') {
      return {
        hardwareConnectionsLimit: Object.keys(policies)
          .filter((key) => policies[key as APIDeviceTypeLowerCamel].enabled)
          .reduce<Record<string, APIHardwareConnection | APIUseThreshold>>((acc, key) => {
            acc[key] = {
              minNum: policies[key as APIDeviceTypeLowerCamel].minNum,
              maxNum: policies[key as APIDeviceTypeLowerCamel].maxNum,
            };
            return acc;
          }, {}),
      };
    } else {
      return {
        useThreshold: Object.keys(policies)
          .filter((key) => policies[key as APIDeviceTypeLowerCamel].enabled)
          .reduce<Record<string, APIHardwareConnection | APIUseThreshold>>((acc, key) => {
            acc[key] = {
              value: policies[key as APIDeviceTypeLowerCamel].value,
              unit: policies[key as APIDeviceTypeLowerCamel].unit,
              comparison: policies[key as APIDeviceTypeLowerCamel].comparison,
            };
            return acc;
          }, {}),
      };
    }
  };

  const submitEdit = (policyId: string, policies: APPPolicies) => {
    const putData: APIPutPolicy = {
      category: policies.category,
      title: policies.title,
      policy: makeAPIPolicy(policies),
    } as APIPutPolicy;
    axios
      .put(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies/${policyId}`, putData)
      .then(() => {
        setModalClose();
        // Display API request success message
        setSuccessInfo({
          id: policyId,
          title: policies.title,
          operation: t('Update'),
        });
        // Fetch again
        mutate();
        return;
      })
      .catch((error) => {
        setInputStatus(policies);
        setModalError(error);
      });
  };

  const submitAdd = (policies: APPPolicies) => {
    const postData: APIPostPolicy = {
      category: policies.category,
      title: policies.title,
      policy: makeAPIPolicy(policies),
      enabled: false,
    } as APIPostPolicy;
    axios
      .post(`${process.env.NEXT_PUBLIC_URL_BE_POLICY_MANAGER}/policies`, postData)
      .then((res) => {
        setModalClose();
        // Display API request success message
        setSuccessInfo({
          id: res.data.policyID,
          title: policies.title,
          operation: t('Add'),
        });
        // Fetch again
        mutate();
        return;
      })
      .catch((error) => {
        setInputStatus(policies);
        setModalError(error);
      });
  };

  const useModal = (): [
    {
      modalOpened: boolean;
      modalMode: ModalMode;
      selectedPolicyId: string | undefined;
      modalTitle: string;
      submitFunc: CallableFunction;
      inputStatus: APPPolicies | undefined;
      modalError: AxiosError<APIPolicyError> | undefined;
    },
    {
      setModalMode: CallableFunction;
      setSelectedPolicyId: CallableFunction;
      setModalOpen: () => void;
      setModalClose: () => void;
      setInputStatus: CallableFunction;
      setModalError: CallableFunction;
    },
  ] => {
    /** Modal open/close */
    const [modalOpened, { open: setModalOpen, close: setModalClose }] = useDisclosure(false);
    /** Modal mode */
    const [modalMode, changeModalMode] = useState<ModalMode>(undefined);
    const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const [submitFunc, setSubmitFunc] = useState<CallableFunction>(() => undefined);
    const [modalError, setModalError] = useState<AxiosError<APIPolicyError> | undefined>(undefined);
    const [inputStatus, setInputStatus] = useState<APPPolicies | undefined>(undefined);
    const setModalMode = (mode: ModalMode) => {
      changeModalMode(mode);
      setInputStatus(undefined);
      setModalError(undefined);
      switch (mode) {
        case 'delete':
          setModalTitle(t('Delete'));
          setSubmitFunc(() => submitDelete);
          break;
        case 'enable':
          setModalTitle(t('Enable'));
          setSubmitFunc(() => submitChangeEnabled);
          break;
        case 'disable':
          setModalTitle(t('Disable'));
          setSubmitFunc(() => submitChangeEnabled);
          break;
        case 'edit':
          setModalTitle(t('Edit'));
          setSubmitFunc(() => submitEdit);
          break;
        case 'add':
          setModalTitle(t('Add'));
          setSubmitFunc(() => submitAdd);
          break;
        // istanbul ignore next
        default:
          setModalTitle('');
          break;
      }
    };
    return [
      { modalOpened, modalMode, selectedPolicyId, modalTitle, submitFunc, inputStatus, modalError },
      { setModalMode, setSelectedPolicyId, setModalOpen, setModalClose, setInputStatus, setModalError },
    ];
  };

  const [
    { modalOpened, modalMode, selectedPolicyId, modalTitle, submitFunc, inputStatus, modalError },
    { setModalMode, setSelectedPolicyId, setModalOpen, setModalClose, setInputStatus, setModalError },
  ] = useModal();

  const findPolicy = (id: string) => data?.policies.find((policy) => policy.policyID === id);
  const ModalComponent = (props: { modalMode: ModalMode }) => {
    const modalProps = {
      modalMode: props.modalMode,
      selectedPolicyId: selectedPolicyId,
      policyTitle: selectedPolicyId && findPolicy(selectedPolicyId)?.title,
      modalClose: setModalClose,
      submit: submitFunc,
      inputStatus: inputStatus,
      error: modalError,
      data: data,
    };
    switch (modalMode) {
      case 'delete':
      case 'enable':
      case 'disable':
        return <PolicyConfirmModal {...modalProps} />;
      case 'add':
      case 'edit':
        return <PolicyEditModal {...modalProps} />;
      // istanbul ignore next
      default:
        break;
    }
    // istanbul ignore next
    return <></>;
  };

  return (
    <>
      <Group justify='space-between' align='end'>
        <PageHeader pageTitle={t('Policies')} items={items} mutate={mutate} loading={loading} />
        <ActionIcon
          disabled={!hasPermission}
          variant='outline'
          color='blue.6'
          size={30}
          title={t('Add')}
          onClick={addPolicy}
        >
          <IconPlus />
        </ActionIcon>
      </Group>

      {successInfo && (
        <>
          <Space h='xl' />
          <MessageBox
            type='success'
            title={t('The policy has been successfully {operation}', {
              operation: successInfo.operation.toLowerCase(),
            })}
            message={
              <>
                <Text>
                  {t('ID')} : {successInfo.id}
                </Text>
                <Text>
                  {t('Title')} : {successInfo.title}
                </Text>
              </>
            }
            close={() => setSuccessInfo(undefined)}
          />
        </>
      )}
      {error && (
        <>
          <Space h='xl' />
          <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />
        </>
      )}
      <Space h='xl' />
      <Title order={2} fz='lg' fw={700}>
        {t('Node Layout Policy')}
      </Title>
      <Space h={20} />
      <PolicyCards>
        {data?.policies
          .filter((policy) => policy.category === 'nodeConfigurationPolicy')
          .map((policy, index) => (
            <PolicyCard policy={policy} loading={loading} key={`node_${index}`} functions={functions} />
          ))}
      </PolicyCards>
      <Space h='xl' />
      <Title order={2} fz='lg' fw={700}>
        {t('System Operation Policy')}
      </Title>
      <Space h={20} />
      <PolicyCards>
        {data?.policies
          .filter((policy) => policy.category === 'systemOperationPolicy')
          .map((policy, index) => (
            <PolicyCard policy={policy} loading={loading} key={`sys_${index}`} functions={functions} />
          ))}
      </PolicyCards>

      <Modal
        opened={modalOpened}
        onClose={setModalClose}
        lockScroll={false}
        title={
          <>
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
        <ModalComponent modalMode={modalMode} />
      </Modal>
    </>
  );
};

export default Policy;
