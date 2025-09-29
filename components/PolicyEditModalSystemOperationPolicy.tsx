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

import { Button, Checkbox, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
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
  APPSystemOperationPolicy,
  ModalMode,
  isAPIDeviceTypeLC,
  isAPPUseThreshold,
} from '@/types';

import { deviceTypes } from '@/utils/define';
import { initialValues } from '@/utils/policy';
import { changeToAPPCase } from '@/utils/parse';

/**
 * Component that displays a form for adding/editing policy conditions
 * @param props
 * @returns
 */

export const PolicyEditModalSystemOperationPolicy = (props: {
  modalMode: Extract<ModalMode, 'add' | 'edit'>;
  selectedPolicyId?: string;
  policyTitle?: string;
  modalClose: () => void;
  submit: CallableFunction | undefined;
  inputStatus: APPSystemOperationPolicy | undefined;
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
    value: (value: number | '', values: APPSystemOperationPolicy) =>
      values.policies[deviceType].enabled &&
      (value === '' ||
        (value === MIN_USAGE_THRESHOLD && values.policies[deviceType].comparison === 'lt') ||
        (value === MAX_USAGE_THRESHOLD && values.policies[deviceType].comparison === 'gt'))
        ? t('Specify a range from 0 to 100')
        : null,
    comparison: (value: string, values: APPSystemOperationPolicy) =>
      values.policies[deviceType].enabled &&
      ((values.policies[deviceType].value === MIN_USAGE_THRESHOLD && value === 'lt') ||
        (values.policies[deviceType].value === MAX_USAGE_THRESHOLD && value === 'gt'))
        ? t('Specify a range from 0 to 100')
        : null,
  });

  const policies = deviceTypes.reduce(
    (acc, deviceType) => {
      acc[deviceType] = createValidationRules(deviceType);
      return acc;
    },
    {} as { [key in APIDeviceTypeLowerCamel]: Record<never, never> }
  );

  // for edit
  const currentPolicy = data?.policies.find((policiy) => policiy.policyID === selectedPolicyId) as APIPolicy;
  // for edit
  const makeAPPPolicy = (APIPolicy: APIPolicy): APPSystemOperationPolicy | undefined => {
    if (APIPolicy.category === 'systemOperationPolicy') {
      const { title, category } = APIPolicy;
      const returnValue = _.cloneDeep(initialValues[category]);
      returnValue.title = title;
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

      return returnValue;
    }
  };

  const form = useForm<APPSystemOperationPolicy>({
    initialValues:
      inputStatus || (modalMode === 'add' ? initialValues.systemOperationPolicy : makeAPPPolicy(currentPolicy)), // add: initial value is node configuration policy
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
    edit: t('Update'),
    add: t('Add'),
  };
  const defaultValue = [];
  for (const key in form.values.policies) {
    if (isAPIDeviceTypeLC(key)) {
      form.values.policies[key].enabled && defaultValue.push(key);
    }
  }

  const operation = policyModalMode[modalMode];
  return (
    <form
      onSubmit={form.onSubmit((values) =>
        modalMode === 'add' ? submit && submit(values) : submit && submit(selectedPolicyId, values)
      )}
    >
      <Stack gap={20}>
        {error && (
          <MessageBox
            type='error'
            title={t('Failed to {operation} policy', { operation: operation.toLowerCase() })}
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
        <TextInput
          label={t('Title (100 or less)')}
          placeholder={t('Title')}
          withAsterisk
          {...form.getInputProps('title')}
        />
        <Checkbox.Group
          value={defaultValue}
          label={t('Usage Threshold')}
          withAsterisk
          error={form.errors['_checkboxes']}
          onChange={(value: string[]) => {
            form.setFieldValue('_checkboxes', value.length !== 0);
            deviceTypes.forEach((type) => {
              form.setFieldValue(`policies.${type}.enabled`, value.includes(type));
            });
          }}
        >
          <Stack gap={5}>
            {deviceTypes.map((item) => (
              <Group justify='space-between' key={item} mih={30} wrap='nowrap'>
                <Checkbox
                  label={changeToAPPCase(item)}
                  value={item}
                  error={form.errors['_checkboxes'] != null ? true : false}
                />
                {form.values.policies[item].enabled && (
                  <Group gap={5} wrap='nowrap' align='flex-start'>
                    <Select
                      defaultValue='le'
                      w={100}
                      size='xs'
                      allowDeselect={false}
                      styles={{
                        section: { pointerEvents: 'none' },
                      }}
                      data={[
                        { label: '>', value: 'gt' },
                        { label: '<', value: 'lt' },
                        { label: '≥', value: 'ge' },
                        { label: '≤', value: 'le' },
                      ]}
                      {...form.getInputProps(`policies.${item}.comparison`)}
                      onChange={(e) => {
                        form.getInputProps(`policies.${item}.comparison`).onChange(e);
                        form.clearFieldError(`policies.${item}.value`);
                      }}
                    ></Select>
                    <NumberInput
                      defaultValue={100}
                      min={0}
                      max={100}
                      w={100}
                      size='xs'
                      {...form.getInputProps(`policies.${item}.value`)}
                      onChange={(e) => {
                        form.getInputProps(`policies.${item}.value`).onChange(e);
                        form.clearFieldError(`policies.${item}.comparison`);
                      }}
                    />
                    <Select
                      defaultValue='percent'
                      w={100}
                      size='xs'
                      allowDeselect={false}
                      styles={{
                        section: { pointerEvents: 'none' },
                      }}
                      data={[{ label: '%', value: 'percent' }]}
                      {...form.getInputProps(`policies.${item}.unit`)}
                    ></Select>
                  </Group>
                )}
              </Group>
            ))}
          </Stack>
        </Checkbox.Group>
        <Group gap={10} justify='end'>
          <Button variant='outline' color='dark' onClick={modalClose}>
            {t('Cancel')}
          </Button>
          <Button type='submit'>{t('Save')}</Button>
        </Group>
      </Stack>
    </form>
  );
};
