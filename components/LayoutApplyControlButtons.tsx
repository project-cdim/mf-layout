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

import { Button, Group, Text } from '@mantine/core';
import { IconAlertCircle, IconHistory, IconPlayerPlayFilled, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useColorStyles } from '@/shared-modules/styles/styles';

import { useLayoutApplyControlButtons } from '@/utils/hooks';

export const LayoutApplyControlButtons = (props: ReturnType<typeof useLayoutApplyControlButtons>) => {
  const t = useTranslations();
  const { red, gray, green } = useColorStyles();
  const { phaseText, statusText, activeButtons, handleCancel, handleRollback, handleFailed, handleResume } = props;
  const buttonsDesignProps = {
    size: 'xs',
    variant: 'default',
    bd: '1px solid dark',
  };
  return (
    <Group align='center' gap='xs' bg='#f0f0f0' p='xs' w='fit-content'>
      <Text c='dimmed' px='xs'>
        {t(phaseText)} : {t(statusText)}
      </Text>
      {/* ANCHOR cancel */}
      <Button
        {...buttonsDesignProps}
        leftSection={<IconX size={20} color={activeButtons.includes('Cancel') ? gray.color : undefined} />}
        disabled={!activeButtons.includes('Cancel')}
        onClick={handleCancel}
      >
        {t('Apply Cancel')}
      </Button>
      {/* ANCHOR cancel and rollback */}
      <Button
        {...buttonsDesignProps}
        leftSection={<IconHistory size={20} color={activeButtons.includes('Rollback') ? gray.color : undefined} />}
        disabled={!activeButtons.includes('Rollback')}
        onClick={handleRollback}
      >
        {t('Rollback')}
      </Button>
      {/* ANCHOR forced termination */}
      <Button
        {...buttonsDesignProps}
        leftSection={
          <IconAlertCircle size={20} color={activeButtons.includes('Forced Termination') ? red.color : undefined} />
        }
        disabled={!activeButtons.includes('Forced Termination')}
        onClick={handleFailed}
      >
        {t('Forced Termination')}
      </Button>
      {/* ANCHOR resume */}
      <Button
        {...buttonsDesignProps}
        leftSection={
          <IconPlayerPlayFilled size={20} color={activeButtons.includes('Resume') ? green.color : undefined} />
        }
        disabled={!activeButtons.includes('Resume')}
        onClick={handleResume}
      >
        {t('Resume')}
      </Button>
    </Group>
  );
};
