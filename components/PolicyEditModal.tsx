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

import { Button, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AxiosError } from 'axios';
import _ from 'lodash';
import { useTranslations } from 'next-intl';

import { MessageBox } from '@/shared-modules/components';

import {
  APIDeviceTypeLowerCamel,
  APIPolicies,
  APIPolicy,
  APIPolicyError,
  APPPolicies,
  ModalMode,
  isAPIDeviceTypeLC,
  isAPPHardwareConnection,
  isAPPUseThreshold,
} from '@/types';

import { PolicyInputSet } from '@/components';

import { deviceTypes } from '@/utils/define';
import { initialValues } from '@/utils/policy';

/**
 * Component that displays a form for adding/editing policy conditions
 * @param props
 * @returns
 */
export const PolicyEditModal = (props: {
  modalMode: ModalMode;
  selectedPolicyId?: string;
  policyTitle?: string;
  modalClose: () => void;
  submit: CallableFunction;
  inputStatus: APPPolicies | undefined;
  error: AxiosError<APIPolicyError> | undefined;
  data?: APIPolicies;
}) => {
  const t = useTranslations();
  const { selectedPolicyId, modalMode, modalClose, submit, inputStatus, error, data } = props;
  const MIN_TITLE_LENGTH = 1;
  const MAX_TITLE_LENGTH = 100;
  const MIN_USAGE_THRESHOLD = 0;
  const MAX_USAGE_THRESHOLD = 100;
  const createValidationRules = (deviceType: APIDeviceTypeLowerCamel) => ({
    minNum: (value: number | '', values: APPPolicies) =>
      values.category === 'nodeConfigurationPolicy' &&
      values.policies[deviceType].enabled &&
      (value === '' || value > values.policies[deviceType].maxNum)
        ? t('Specify a minimum value')
        : null,
    maxNum: (value: number | '', values: APPPolicies) =>
      values.category === 'nodeConfigurationPolicy' &&
      values.policies[deviceType].enabled &&
      (value === '' || value < values.policies[deviceType].minNum)
        ? t('Specify a maximum value')
        : null,
    value: (value: number | '', values: APPPolicies) =>
      values.category === 'systemOperationPolicy' &&
      values.policies[deviceType].enabled &&
      (value === '' ||
        (value === MIN_USAGE_THRESHOLD && values.policies[deviceType].comparison === 'lt') ||
        (value === MAX_USAGE_THRESHOLD && values.policies[deviceType].comparison === 'gt'))
        ? t('Specify a range from 0 to 100')
        : null,
    comparison: (value: string, values: APPPolicies) =>
      values.category === 'systemOperationPolicy' &&
      values.policies[deviceType].enabled &&
      ((values.policies[deviceType].value === MIN_USAGE_THRESHOLD && value === 'lt') ||
        (values.policies[deviceType].value === MAX_USAGE_THRESHOLD && value === 'gt'))
        ? t('Specify a range from 0 to 100')
        : null,
  });

  const policies = deviceTypes.reduce((acc, deviceType) => {
    acc[deviceType] = createValidationRules(deviceType);
    return acc;
  }, {} as { [key in APIDeviceTypeLowerCamel]: Record<never, never> });

  // for edit
  const currentPolicy = data?.policies.find((policiy) => policiy.policyID === selectedPolicyId) as APIPolicy;

  // for edit
  // eslint-disable-next-line complexity
  const makeAPPPolicy = (APIPolicy: APIPolicy): APPPolicies => {
    const { title, category } = APIPolicy;
    const returnValue = _.cloneDeep(initialValues[category]);
    returnValue.title = title;
    returnValue.category = category;
    if (category === 'nodeConfigurationPolicy' && returnValue.category === 'nodeConfigurationPolicy') {
      for (const key in APIPolicy.policy.hardwareConnectionsLimit) {
        if (isAPIDeviceTypeLC(key) && isAPPHardwareConnection(returnValue.policies[key])) {
          const hardwareConnectionsLimit = APIPolicy.policy.hardwareConnectionsLimit[key];
          if (hardwareConnectionsLimit) {
            returnValue.policies[key].minNum = hardwareConnectionsLimit.minNum;
            returnValue.policies[key].maxNum = hardwareConnectionsLimit.maxNum;
          }
          returnValue.policies[key].enabled = true;
          returnValue._checkboxes = true;
        }
      }
    } else if (category === 'systemOperationPolicy' && returnValue.category === 'systemOperationPolicy') {
      for (const key in APIPolicy.policy.useThreshold) {
        if (isAPIDeviceTypeLC(key) && isAPPUseThreshold(returnValue.policies[key])) {
          const useThreshold = APIPolicy.policy.useThreshold[key];
          if (useThreshold) {
            returnValue.policies[key].value = useThreshold.value;
            returnValue.policies[key].unit = useThreshold.unit;
            returnValue.policies[key].comparison = useThreshold.comparison;
          }
          returnValue.policies[key].enabled = true;
          returnValue._checkboxes = true;
        }
      }
    }
    return returnValue;
  };

  const form = useForm<APPPolicies>({
    initialValues:
      inputStatus || (modalMode === 'add' ? initialValues.nodeConfigurationPolicy : makeAPPPolicy(currentPolicy)), // add: initial value is node configuration policy
    validateInputOnChange: true,
    validate: {
      _checkboxes: (values) => {
        return values ? null : t('Check at least one');
      },
      title: (value) =>
        value.length < MIN_TITLE_LENGTH || value.length > MAX_TITLE_LENGTH
          ? t('Enter between 1 and 100 characters')
          : null,
      policies: policies,
    },
  });
  const policyModalMode = {
    delete: t('Delete'),
    enable: t('Enable'),
    disable: t('Disable'),
    edit: t('Update'),
    add: t('Add'),
  };

  const operation = modalMode && policyModalMode[modalMode];
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => (modalMode === 'add' ? submit(values) : submit(selectedPolicyId, values)))}
      >
        <Stack gap={20}>
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
          <TextInput
            label={t('Title (100 or less)')}
            placeholder={t('Title')}
            withAsterisk
            {...form.getInputProps('title')}
          />
          <Select
            label={t('Category')}
            data={[
              { label: t('Node Layout Policy'), value: 'nodeConfigurationPolicy' },
              { label: t('System Operation Policy'), value: 'systemOperationPolicy' },
            ]}
            {...form.getInputProps('category')}
            onChange={(e) => {
              form.getInputProps('category').onChange(e);
              form.setValues((e) => {
                if (e.category === 'nodeConfigurationPolicy') {
                  return { ...initialValues.nodeConfigurationPolicy, title: form.values.title };
                } else {
                  return { ...initialValues.systemOperationPolicy, title: form.values.title };
                }
              });
            }}
            withAsterisk
            disabled={modalMode === 'edit'}
          ></Select>
          <PolicyInputSet form={form} />
          <Group gap={10} justify='end'>
            <Button variant='outline' color='dark' onClick={modalClose}>
              {t('Cancel')}
            </Button>
            <Button type='submit'>{t('Save')}</Button>
          </Group>
        </Stack>
      </form>
    </>
  );
};
