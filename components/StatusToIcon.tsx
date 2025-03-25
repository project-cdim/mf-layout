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

import { useTranslations } from 'next-intl';

import { IconWithInfo } from '@/shared-modules/components';
import { ApplyProcedureStatus, ApplyStatus, RollbackStatus } from '@/shared-modules/types';

import { DesignStatus } from '@/types';

type Operate = 'Design' | 'Apply' | 'Rollback' | 'Operation';

/**
 * Converts a design status to an icon component.
 *
 * @param status - The design status.
 * @returns The corresponding icon component based on the design status.
 */
export const StatusToIcon = (props: {
  status: DesignStatus | ApplyStatus | RollbackStatus | ApplyProcedureStatus | undefined;
  target: Operate;
}) => {
  const t = useTranslations();
  const action = t(props.target);
  switch (props.status) {
    case 'IN_PROGRESS':
      return <IconWithInfo type='in_progress' label={t('{action} is currently in progress', { action })} />;
    case 'FAILED':
      return <IconWithInfo type='critical' label={t('{action} failed', { action })} />;
    case 'COMPLETED':
      return <IconWithInfo type='check' label={t('{action} completed', { action })} />;
    case 'CANCELING':
      return <IconWithInfo type='canceling' label={t('{action} is being canceled', { action })} />;
    case 'CANCELED':
      return <IconWithInfo type='canceled' label={t('{action} canceled', { action })} />;
    case 'SUSPENDED':
      return <IconWithInfo type='suspended' label={t('{action} suspended', { action })} />;
    case 'SKIPPED':
      return <IconWithInfo type='skipped' label={t('{action} skipped', { action })} />;
    default:
      return null;
  }
};
