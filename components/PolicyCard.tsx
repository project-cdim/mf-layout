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

import React, { ReactNode } from 'react';

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconBan, IconCheck, IconPencil, IconTrash } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';

import { CardLoading } from '@/shared-modules/components';
import { MANAGE_LAYOUT } from '@/shared-modules/constant';
import { usePermission } from '@/shared-modules/utils/hooks';

import { APINodePolicy, APIPolicy, APISystemPolicy, isAPIDeviceTypeLC } from '@/types';

import { changeToAPPCase, dateParse, policyComparison, policyUnit } from '@/utils/parse';

/**
 * Props for the PolicyCard component
 */
type PolicyCardProps = {
  /** loading */
  loading: boolean;

  policy: APIPolicy;
  functions: {
    deletePolicy: CallableFunction;
    enablePolicy: CallableFunction;
    disablePolicy: CallableFunction;
    editPolicy: CallableFunction;
  };
};

/**
 * Renders a policy card component.
 * @param props - The props for the PolicyCard component.
 * @returns The rendered PolicyCard component.
 */
export const PolicyCard = (props: PolicyCardProps) => {
  const hasPermission = usePermission(MANAGE_LAYOUT);
  const t = useTranslations();
  const currentLocale = useLocale();
  const { loading, policy } = props;
  const { deletePolicy, enablePolicy, disablePolicy, editPolicy } = props.functions;

  return (
    <CardLoading withBorder padding={32} loading={loading}>
      <Stack gap={20}>
        <Group justify='space-between' align='center'>
          {policy.enabled ? (
            <Tooltip
              label={t('Policy is enabled')}
              openDelay={300}
              closeDelay={200}
              withArrow
              color='green'
              multiline={false}
              maw={400}
            >
              {/* color="#228BE6" */}
              <ThemeIcon color='green' radius={16.5} size={33}>
                <IconCheck />
              </ThemeIcon>
            </Tooltip>
          ) : (
            <Tooltip
              label={t('Policy is disabled')}
              openDelay={300}
              closeDelay={200}
              withArrow
              color='red'
              multiline={false}
              maw={400}
            >
              <Box lh={0}>
                {/* color="#FA5252" */}
                <IconBan color='red' size={33} />
              </Box>
            </Tooltip>
          )}
          <Group gap='xs'>
            {policy.enabled ? (
              <>
                {/* <Group gap={2}>
                  <Check color='#228BE6' />
                  <Text component='label' size={'sm'} fw={700}>
                    {t('Enabled')}
                  </Text>
                </Group> */}
                <Button
                  size='xs'
                  variant='outline'
                  color='dark'
                  onClick={() => {
                    disablePolicy(policy.policyID);
                  }}
                  disabled={!hasPermission}
                >
                  <Text size={'sm'} fw={700}>
                    {t('Disable')}
                  </Text>
                </Button>
                <Divider orientation='vertical' />
                <ActionIcon disabled={true} size={30} title={t('Edit')}>
                  <IconPencil />
                </ActionIcon>
                <ActionIcon disabled={true} size={30} title={t('Delete')}>
                  <IconTrash />
                </ActionIcon>
              </>
            ) : (
              <>
                {/* <Group gap={2}>
                  <X color='#FA5252' />
                  <Text component='label' size={'sm'} fw={700}>
                    {t('Disabled')}
                  </Text>
                </Group> */}
                <Button
                  size='xs'
                  variant='outline'
                  color='dark'
                  onClick={() => {
                    enablePolicy(policy.policyID);
                  }}
                  disabled={!hasPermission}
                >
                  <Text size={'sm'} fw={700}>
                    {t('Enable')}
                  </Text>
                </Button>
                <Divider orientation='vertical' />
                <ActionIcon
                  variant='outline'
                  color='blue.6'
                  size={30}
                  title={t('Edit')}
                  onClick={() => {
                    editPolicy(policy.policyID);
                  }}
                  disabled={!hasPermission}
                >
                  <IconPencil />
                </ActionIcon>
                <ActionIcon
                  variant='outline'
                  color='red.6'
                  size={30}
                  title={t('Delete')}
                  onClick={() => {
                    deletePolicy(policy.policyID);
                  }}
                  disabled={!hasPermission}
                >
                  <IconTrash />
                </ActionIcon>
              </>
            )}
          </Group>
        </Group>
        <Title order={4} fz='lg' fw={700}>
          {policy.title}
        </Title>
        <Stack gap={8}>
          <Title order={4} fw={700} fz={16}>
            {t('Details')}
          </Title>
          <Stack gap={8} p={20} bg={'#F5F5F5'}>
            {policy.category === 'nodeConfigurationPolicy' ? (
              <>
                <Title order={5} fz='md' fw='normal'>
                  {t('Hardware Connections Limit')}
                </Title>
                <HwConnectLimit hardwareConnectionsLimit={policy.policy.hardwareConnectionsLimit} />
              </>
            ) : (
              <>
                <Title order={5} fz='md' fw='normal'>
                  {t('Usage Threshold')}
                </Title>
                <UseThreshold useThreshold={policy.policy.useThreshold} />
              </>
            )}
          </Stack>
        </Stack>
        <Stack gap={5}>
          <Group justify='end' gap={16}>
            <Group gap={5}>
              <Title order={4} fz={12} fw='normal'>
                {t('Created')}
              </Title>
              <Text fz={12}>:</Text>
              <Box component='time' fz={12}>
                {dateParse(policy.createdAt, currentLocale)}
              </Box>
            </Group>
            <Group gap={5}>
              <Title order={4} fz={12} fw='normal'>
                {t('Updated')}
              </Title>
              <Text fz={12}>:</Text>
              <Box component='time' fz={12}>
                {dateParse(policy.updatedAt, currentLocale)}
              </Box>
            </Group>
          </Group>
          <Group gap={5} justify='flex-end' c='gray' fz={11} fw='normal'>
            <Title order={3} fw='inherit' fz='inherit' c='inherit'>
              {t('ID')}
            </Title>
            <Text fw='inherit' fz='inherit' c='inherit'>
              :
            </Text>
            <Text fw='inherit' fz='inherit' c='inherit'>
              {policy.policyID}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </CardLoading>
  );
};

/**
 * `PolicyCards` component is used to display policy cards.
 * This component accepts any children components and displays them as policy cards.
 *
 * @param props - The properties passed to the component.
 * @returns The React component displaying the policy cards.
 */
export const PolicyCards = (props: { children?: ReactNode }) => {
  const { children } = props;
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing={{ base: 'sm', sm: 'md', lg: 'lg' }}
      verticalSpacing={{ base: 'sm', sm: 'md', lg: 'lg' }}
    >
      {children}
    </SimpleGrid>
  );
};

/**
 * Renders a list of hardware connection limits based on the provided APINodePolicy.
 * @param props - The APINodePolicy object containing the hardware connection limits.
 * @returns A React component that renders a list of hardware connection limits.
 */
const HwConnectLimit = (props: APINodePolicy) => {
  // type HardwareKey = keyof APINodePolicy['hardwareConnectionsLimit'];
  const list = [];
  for (const key in props.hardwareConnectionsLimit) {
    if (isAPIDeviceTypeLC(key)) {
      const hardwareConnectionsLimit = props.hardwareConnectionsLimit[key];
      if (hardwareConnectionsLimit) {
        list.push(
          <List.Item key={key}>
            {changeToAPPCase(key)}
            {': '}
            {hardwareConnectionsLimit.minNum}
            {' - '}
            {hardwareConnectionsLimit.maxNum}
          </List.Item>
        );
      }
    }
  }
  return <List>{list}</List>;
};

const UseThreshold = (props: APISystemPolicy) => {
  const t = useTranslations();
  // type UseThresholdKey = keyof APISystemPolicy['useThreshold'];
  const list = [];
  for (const key in props.useThreshold) {
    if (isAPIDeviceTypeLC(key)) {
      const threshold = props.useThreshold[key];
      if (threshold) {
        list.push(
          <List.Item key={key}>
            {changeToAPPCase(key)}
            {': '}
            {t(policyComparison[threshold.comparison], { number: `${threshold.value}${policyUnit[threshold.unit]}` })}
          </List.Item>
        );
      }
    }
  }
  return <List>{list}</List>;
};
