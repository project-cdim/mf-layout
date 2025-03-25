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

import { Checkbox, Group, NumberInput, Select, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useTranslations } from 'next-intl';

import { APPPolicies, isAPIDeviceTypeLC } from '@/types';

import { deviceTypes } from '@/utils/define';
import { changeToAPPCase } from '@/utils/parse';

/**
 * Component to display input values for adding/editing constraint conditions in a form
 *
 * @param props - The component props.
 * @returns The rendered PolicyInputSet component.
 */
export const PolicyInputSet = (props: { form: UseFormReturnType<APPPolicies> }) => {
  const t = useTranslations();
  const { form } = props;
  const defaultValue = [];
  for (const key in form.values.policies) {
    if (isAPIDeviceTypeLC(key)) {
      form.values.policies[key].enabled && defaultValue.push(key);
    }
  }
  return (
    <>
      <Checkbox.Group
        value={defaultValue}
        label={
          form.values.category === 'nodeConfigurationPolicy' ? t('Hardware Connections Limit') : t('Usage Threshold')
        }
        withAsterisk
        error={form.errors['_checkboxes']}
        onChange={(value: string[]) => {
          form.setFieldValue('_checkboxes', value.length !== 0);
          deviceTypes.forEach((type) => {
            form.setFieldValue(`policies.${type}.enabled`, value.includes(type));
          });
        }}
      >
        {deviceTypes.map((item) => {
          switch (form.values.category) {
            case 'nodeConfigurationPolicy' /** Node Configuration Policy */:
              return (
                <Group justify='space-between' key={item} mih={30} wrap='nowrap'>
                  <Checkbox
                    label={changeToAPPCase(item)}
                    value={item}
                    error={form.errors['_checkboxes'] != null ? true : false}
                  />
                  {form.values.policies[item].enabled && (
                    <Group gap={5} wrap='nowrap' align='flex-start'>
                      <NumberInput
                        min={1}
                        max={1000}
                        w={130}
                        size='xs'
                        {...form.getInputProps(`policies.${item}.minNum`)}
                        onChange={(e) => {
                          form.getInputProps(`policies.${item}.minNum`).onChange(e);
                          form.clearFieldError(`policies.${item}.maxNum`);
                        }}
                      />
                      <Text>-</Text>
                      <NumberInput
                        min={1}
                        max={1000}
                        w={130}
                        size='xs'
                        {...form.getInputProps(`policies.${item}.maxNum`)}
                        onChange={(e) => {
                          form.getInputProps(`policies.${item}.maxNum`).onChange(e);
                          form.clearFieldError(`policies.${item}.minNum`);
                        }}
                      />
                    </Group>
                  )}
                </Group>
              );
            case 'systemOperationPolicy' /** System Operation Policy */:
              return (
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
                        data={[{ label: '%', value: 'percent' }]}
                        {...form.getInputProps(`policies.${item}.unit`)}
                      ></Select>
                    </Group>
                  )}
                </Group>
              );
          }
        })}
      </Checkbox.Group>
    </>
  );
};
