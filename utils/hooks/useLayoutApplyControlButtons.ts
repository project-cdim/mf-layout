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

import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

import { MANAGE_LAYOUT } from '@/shared-modules/constant';
import { ApplyStatus, ApplyStatusLabelKey, RollbackStatus, RollbackStatusLabelKey } from '@/shared-modules/types';
import { usePermission } from '@/shared-modules/utils/hooks';

import { ApplyAction } from '@/types';

import { STATUS_TO_LABEL } from '../constant';

type DisplayParts = {
  phaseText: 'Apply' | 'Rollback' | '';
  statusText: 'In Progress' | 'Completed' | 'Failed' | 'Suspended.status' | 'Canceling' | 'Canceled.completed' | '';
  activeButtons: ApplyAction[];
};

export const useLayoutApplyControlButtons = (props: {
  status: ApplyStatus | undefined;
  rollbackStatus: RollbackStatus | undefined;
  applyID: string;
  pageReload: () => void;
  setFunction: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
  setAction: React.Dispatch<React.SetStateAction<ApplyAction | undefined>>;
  openModal: () => void;
  closeModal: () => void;
  setError: React.Dispatch<React.SetStateAction<AxiosError<{ code: string; message: string }> | undefined>>;
  setResponse: React.Dispatch<React.SetStateAction<AxiosResponse<{ status: string }> | undefined>>;
}) => {
  const hasPermission = usePermission(MANAGE_LAYOUT);

  const getDisplayParts = (
    status: ApplyStatus | undefined,
    rollbackStatus: RollbackStatus | undefined
  ): DisplayParts => {
    if (status === undefined) {
      return { phaseText: '', statusText: '', activeButtons: [] };
    }
    const phaseText = rollbackStatus ? 'Rollback' : 'Apply';
    const currentStatus = rollbackStatus || status;
    const statusText = STATUS_TO_LABEL[currentStatus] as ApplyStatusLabelKey | RollbackStatusLabelKey;

    const activeButtons: ApplyAction[] = (() => {
      if (hasPermission === false) return [];
      switch (currentStatus) {
        case 'IN_PROGRESS':
          return rollbackStatus ? ['Forced Termination'] : ['Cancel', 'Rollback'];
        case 'SUSPENDED':
          return ['Forced Termination', 'Resume'];
        default:
          return [];
      }
    })();

    return { phaseText, statusText, activeButtons };
  };

  const createHandle = (actionText: ApplyAction, queryParams: string) => {
    return () => {
      props.setError(undefined);
      props.setResponse(undefined);
      props.openModal();
      props.setAction(actionText);
      props.setFunction(() => () => {
        axios
          .put(`${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply/${props.applyID}?${queryParams}`)
          .then((res) => {
            props.closeModal();
            props.setResponse(res);
            props.pageReload();
          })
          .catch((error) => {
            props.setError(error);
          });
      });
    };
  };

  return {
    ...getDisplayParts(props.status, props.rollbackStatus),
    handleCancel: createHandle('Cancel', 'action=cancel'),
    handleRollback: createHandle('Rollback', 'action=cancel&rollbackOnCancel=true'),
    handleFailed: createHandle('Forced Termination', 'action=cancel'),
    handleResume: createHandle('Resume', 'action=resume'),
  };
};
