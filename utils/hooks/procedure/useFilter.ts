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

import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';
import _ from 'lodash';
import { useTranslations } from 'next-intl';

import { NumberRange } from '@/shared-modules/components';
import {
  DateRange,
  APPLY_PROCEDURE_STATUS,
  ApplyProcedureOperationLabelJa,
  ApplyProcedureOperationLabelKey,
  ApplyProcedureStatus,
  ApplyProcedureStatusLabelJa,
  ApplyProcedureStatusLabelKey,
  PROCEDURE_OPERATION,
  ProcedureOperation,
} from '@/shared-modules/types';

import { APPProcedureWithResult } from '@/types';

import {
  isAllStringIncluded,
  isNumberInRange,
  isNumbersInRange,
  isSelected,
  isDateInRange,
} from '@/shared-modules/utils';
import { RESULT_TO_LABEL } from '@/utils/constant';
import { useLayoutApplyDetail } from '@/utils/hooks';

type ProcedureQuery = {
  ID: NumberRange;
  targetCPUID: string;
  targetDeviceID: string;
  operation: ProcedureOperation[];
  dependencies: NumberRange;
  status: ApplyProcedureStatus[];
  startedAt: DateRange;
  endedAt: DateRange;
  rollbackOperation: ProcedureOperation[];
  rollbackDependencies: NumberRange;
  rollbackStatus: ApplyProcedureStatus[];
  rollbackStartedAt: DateRange;
  rollbackEndedAt: DateRange;
};

type ProcedureSetQuery = {
  ID: Dispatch<SetStateAction<NumberRange>>;
  targetCPUID: Dispatch<SetStateAction<string>>;
  targetDeviceID: Dispatch<SetStateAction<string>>;
  operation: Dispatch<SetStateAction<ProcedureOperation[]>>;
  dependencies: Dispatch<SetStateAction<NumberRange>>;
  status: Dispatch<SetStateAction<ApplyProcedureStatus[]>>;
  startedAt: Dispatch<SetStateAction<DateRange>>;
  endedAt: Dispatch<SetStateAction<DateRange>>;
  rollbackOperation: Dispatch<SetStateAction<ProcedureOperation[]>>;
  rollbackDependencies: Dispatch<SetStateAction<NumberRange>>;
  rollbackStatus: Dispatch<SetStateAction<ApplyProcedureStatus[]>>;
  rollbackStartedAt: Dispatch<SetStateAction<DateRange>>;
  rollbackEndedAt: Dispatch<SetStateAction<DateRange>>;
};

export type ApplyProcedureFilter = {
  /** Filtered records */
  filteredRecords: APPProcedureWithResult[];
  /** Filter values */
  query: ProcedureQuery;
  /** Set functions */
  setQuery: ProcedureSetQuery;
  /** MultiSelect options */
  selectOptions: {
    status: { value: ApplyProcedureStatus; label: ApplyProcedureStatusLabelJa | ApplyProcedureStatusLabelKey }[];
    operation: { value: ProcedureOperation; label: ApplyProcedureOperationLabelJa | ApplyProcedureOperationLabelKey }[];
    rollbackStatus: {
      value: ApplyProcedureStatus;
      label: ApplyProcedureStatusLabelJa | ApplyProcedureStatusLabelKey;
    }[];
    rollbackOperation: {
      value: ProcedureOperation;
      label: ApplyProcedureOperationLabelJa | ApplyProcedureOperationLabelKey;
    }[];
  };
};

/**
 * Constructs filter object for procedure step table
 *
 * @returns Filtered records and filter information {@link ApplyProcedureFilter}
 */
export const useFilter = (): ApplyProcedureFilter => {
  const { data } = useLayoutApplyDetail();
  const selectOptions = useSelectOption(data?.procedures ?? []);

  const [idQuery, setIdQuery] = useState<NumberRange>([undefined, undefined]);
  const [targetCPUIDQuery, setTargetCPUIDQuery] = useState('');
  const [debouncedTargetCPUIDQuery] = useDebouncedValue(targetCPUIDQuery, 200);
  const [targetDeviceIDQuery, setTargetDeviceIDQuery] = useState('');
  const [debouncedtargetDeviceIDQuery] = useDebouncedValue(targetDeviceIDQuery, 200);
  const [operationQuery, setOperationQuery] = useState<ProcedureOperation[]>([]);
  const [dependenciesQuery, setDependenciesQuery] = useState<NumberRange>([undefined, undefined]);
  const [statusQuery, setStatusQuery] = useState<ApplyProcedureStatus[]>([]);
  const [startedAtQuery, setStartedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [endedAtQuery, setEndedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [rollbackOperationQuery, setRollbackOperationQuery] = useState<ProcedureOperation[]>([]);
  const [rollbackDependenciesQuery, setRollbackDependenciesQuery] = useState<NumberRange>([undefined, undefined]);
  const [rollbackStatusQuery, setRollbackStatusQuery] = useState<ApplyProcedureStatus[]>([]);
  const [rollbackStartedAtQuery, setRollbackStartedAtQuery] = useState<DateRange>([undefined, undefined]);
  const [rollbackEndedAtQuery, setRollbackEndedAtQuery] = useState<DateRange>([undefined, undefined]);

  const filteredRecords = useMemo(() => {
    return data?.procedures
      ? data.procedures.filter(
          (record) =>
            // common column group
            isNumberInRange(record.operationID, idQuery) &&
            isAllStringIncluded(record.targetCPUID, debouncedTargetCPUIDQuery) &&
            isAllStringIncluded(record.targetDevice, debouncedtargetDeviceIDQuery) &&
            // apply column group
            isSelected(record.apply.operation, operationQuery) &&
            isNumbersInRange(record.apply.dependencies, dependenciesQuery) &&
            isSelected(record.apply.status, statusQuery) &&
            isDateInRange(record.apply.startedAt, startedAtQuery) &&
            isDateInRange(record.apply.endedAt, endedAtQuery) &&
            // rollback column group
            isSelected(record.rollback?.operation, rollbackOperationQuery) &&
            isNumbersInRange(record.rollback?.dependencies, rollbackDependenciesQuery) &&
            isSelected(record.rollback?.status, rollbackStatusQuery) &&
            isDateInRange(record.rollback?.startedAt, rollbackStartedAtQuery) &&
            isDateInRange(record.rollback?.endedAt, rollbackEndedAtQuery)
        )
      : [];
  }, [
    data,
    idQuery,
    debouncedTargetCPUIDQuery,
    debouncedtargetDeviceIDQuery,
    operationQuery,
    dependenciesQuery,
    statusQuery,
    startedAtQuery,
    endedAtQuery,
    rollbackOperationQuery,
    rollbackDependenciesQuery,
    rollbackStatusQuery,
    rollbackStartedAtQuery,
    rollbackEndedAtQuery,
  ]);

  return {
    filteredRecords,
    query: {
      ID: idQuery,
      targetCPUID: targetCPUIDQuery,
      targetDeviceID: targetDeviceIDQuery,
      operation: operationQuery,
      dependencies: dependenciesQuery,
      status: statusQuery,
      startedAt: startedAtQuery,
      endedAt: endedAtQuery,
      rollbackOperation: rollbackOperationQuery,
      rollbackDependencies: rollbackDependenciesQuery,
      rollbackStatus: rollbackStatusQuery,
      rollbackStartedAt: rollbackStartedAtQuery,
      rollbackEndedAt: rollbackEndedAtQuery,
    },
    setQuery: {
      ID: setIdQuery,
      targetCPUID: setTargetCPUIDQuery,
      targetDeviceID: setTargetDeviceIDQuery,
      operation: setOperationQuery,
      dependencies: setDependenciesQuery,
      status: setStatusQuery,
      startedAt: setStartedAtQuery,
      endedAt: setEndedAtQuery,
      rollbackOperation: setRollbackOperationQuery,
      rollbackDependencies: setRollbackDependenciesQuery,
      rollbackStatus: setRollbackStatusQuery,
      rollbackStartedAt: setRollbackStartedAtQuery,
      rollbackEndedAt: setRollbackEndedAtQuery,
    },
    selectOptions,
  };
};

const useSelectOption = (records: APPProcedureWithResult[]): ApplyProcedureFilter['selectOptions'] => {
  const t = useTranslations();

  // Extract only values included in the record
  const statuses = APPLY_PROCEDURE_STATUS.filter((status) => records.some((record) => record.apply.status === status));
  const operations = PROCEDURE_OPERATION.filter((ope) => records.some((record) => record.apply.operation === ope));
  const rollbackStatuses = APPLY_PROCEDURE_STATUS.filter((status) =>
    records.some((record) => record.rollback?.status === status)
  );
  const rollbackOperations = PROCEDURE_OPERATION.filter((ope) =>
    records.some((record) => record.rollback?.operation === ope)
  );

  return {
    operation: operations.map((ope) => ({
      value: ope,
      label: t(_.capitalize(ope)) as ApplyProcedureOperationLabelJa | ApplyProcedureOperationLabelKey,
    })),
    status: statuses.map((status) => ({
      value: status,
      label: t(RESULT_TO_LABEL[status]) as ApplyProcedureStatusLabelJa | ApplyProcedureStatusLabelKey,
    })),
    rollbackOperation: rollbackOperations.map((ope) => ({
      value: ope,
      label: t(_.capitalize(ope)) as ApplyProcedureOperationLabelJa | ApplyProcedureOperationLabelKey,
    })),
    rollbackStatus: rollbackStatuses.map((status) => ({
      value: status,
      label: t(RESULT_TO_LABEL[status]) as ApplyProcedureStatusLabelJa | ApplyProcedureStatusLabelKey,
    })),
  };
};
