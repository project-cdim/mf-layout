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

import {
  APIDeviceTypeLowerCamel,
  APIHardwareConnection,
  APIPolicies,
  APIPolicyError,
  APIPostPolicy,
  APIPutPolicy,
  APIUseThreshold,
  APPPolicies,
  ModalMode,
} from '@/types';
import { useDisclosure } from '@mantine/hooks';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
export const usePolicyModal = ({
  data,
  setSuccessInfo,
  mutate,
}: {
  data: APIPolicies | undefined;
  setSuccessInfo: React.Dispatch<React.SetStateAction<{ id: string; title: string; operation: string } | undefined>>;
  mutate: () => void;
}) => {
  const t = useTranslations();
  /** Modal open/close */
  const [modalOpened, { open: setModalOpen, close: setModalClose }] = useDisclosure(false);
  /** Modal mode */
  const [modalMode, setModalMode] = useState<ModalMode>(undefined);
  const [category, setCategory] = useState<'nodeConfigurationPolicy' | 'systemOperationPolicy' | undefined>(undefined);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [submitFunc, setSubmitFunc] = useState<{ fn: CallableFunction | undefined }>({ fn: undefined });
  const [modalError, setModalError] = useState<AxiosError<APIPolicyError> | undefined>(undefined);
  const [inputStatus, setInputStatus] = useState<APPPolicies | undefined>(undefined);
  const changeModalMode = (mode: ModalMode) => {
    setModalMode(mode);
    setInputStatus(undefined);
    setModalError(undefined);
    switch (mode) {
      case 'delete':
        setModalTitle(t('Delete'));
        setSubmitFunc({ fn: submitDelete });
        break;
      case 'enable':
        setModalTitle(t('Enable'));
        setSubmitFunc({ fn: submitChangeEnabled });
        break;
      case 'disable':
        setModalTitle(t('Disable'));
        setSubmitFunc({ fn: submitChangeEnabled });
        break;
      case 'edit':
        setModalTitle(t('Edit'));
        setSubmitFunc({ fn: submitEdit });
        break;
      case 'add':
        setModalTitle(t('Add'));
        setSubmitFunc({ fn: submitAdd });
        break;
      default:
        setModalTitle('');
        break;
    }
  };
  const findPolicy = (id: string) => data?.policies.find((policy) => policy.policyID === id);

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
    switch (category) {
      case 'nodeConfigurationPolicy':
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
      case 'systemOperationPolicy':
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

  return [
    {
      modalOpened,
      modalMode,
      category,
      selectedPolicyId,
      policyTitle: selectedPolicyId ? findPolicy(selectedPolicyId)?.title : undefined,
      modalTitle,
      submitFunc: submitFunc.fn,
      inputStatus,
      modalError,
      data,
    },
    {
      changeModalMode,
      setCategory,
      setSelectedPolicyId,
      setModalOpen,
      setModalClose,
    },
  ] as const;
};
