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
import { PROCEDURE_OPERATION, ProcedureOperation } from '@/shared-modules/types';

import { APPProcedure } from '@/types';

import { isAllStringIncluded, isNumberInRange, isNumbersInRange, isSelected } from '@/shared-modules/utils';
import { useLayoutDesignDetail } from '@/utils/hooks';

type ProcedureQuery = {
  ID: NumberRange;
  targetCPUID: string;
  targetDeviceID: string;
  operation: ProcedureOperation[];
  dependencies: NumberRange;
};

type ProcedureSetQuery = {
  ID: Dispatch<SetStateAction<NumberRange>>;
  targetCPUID: Dispatch<SetStateAction<string>>;
  targetDeviceID: Dispatch<SetStateAction<string>>;
  operation: Dispatch<SetStateAction<ProcedureOperation[]>>;
  dependencies: Dispatch<SetStateAction<NumberRange>>;
};

export type DesignProcedureFilter = {
  /** Filtered records */
  filteredRecords: APPProcedure[];
  /** Filter values */
  query: ProcedureQuery;
  /** Set functions */
  setQuery: ProcedureSetQuery;
  /** MultiSelect options */
  selectOptions: {
    operation: { value: ProcedureOperation; label: string }[];
  };
};

/**
 * Constructs filter object for procedure step table
 *
 * @returns Filtered records and filter information {@link DesignProcedureFilter}
 */
export const useFilter = (): DesignProcedureFilter => {
  const { data } = useLayoutDesignDetail();
  const selectOptions = useSelectOption(data?.procedures ?? []);

  const [idQuery, setIdQuery] = useState<NumberRange>([undefined, undefined]);
  const [targetCPUIDQuery, setTargetCPUIDQuery] = useState('');
  const [debouncedTargetCPUIDQuery] = useDebouncedValue(targetCPUIDQuery, 200);
  const [targetDeviceIDQuery, setTargetDeviceIDQuery] = useState('');
  const [debouncedtargetDeviceIDQuery] = useDebouncedValue(targetDeviceIDQuery, 200);
  const [operationQuery, setOperationQuery] = useState<ProcedureOperation[]>([]);
  const [dependenciesQuery, setDependenciesQuery] = useState<NumberRange>([undefined, undefined]);

  const filteredRecords = useMemo(() => {
    return data?.procedures
      ? data.procedures.filter(
          (record) =>
            isNumberInRange(record.operationID, idQuery) &&
            isAllStringIncluded(record.targetCPUID, debouncedTargetCPUIDQuery) &&
            isAllStringIncluded(record.targetDevice, debouncedtargetDeviceIDQuery) &&
            isSelected(record.operation, operationQuery) &&
            isNumbersInRange(record.dependencies, dependenciesQuery)
        )
      : [];
  }, [data, idQuery, debouncedTargetCPUIDQuery, debouncedtargetDeviceIDQuery, operationQuery, dependenciesQuery]);

  return {
    filteredRecords,
    query: {
      ID: idQuery,
      targetCPUID: targetCPUIDQuery,
      targetDeviceID: targetDeviceIDQuery,
      operation: operationQuery,
      dependencies: dependenciesQuery,
    },
    setQuery: {
      ID: setIdQuery,
      targetCPUID: setTargetCPUIDQuery,
      targetDeviceID: setTargetDeviceIDQuery,
      operation: setOperationQuery,
      dependencies: setDependenciesQuery,
    },
    selectOptions,
  };
};

const useSelectOption = (records: APPProcedure[]): DesignProcedureFilter['selectOptions'] => {
  const t = useTranslations();

  // Extract only values included in the record
  const operations = PROCEDURE_OPERATION.filter((ope) => records.some((record) => record.operation === ope));
  return {
    operation: operations.map((ope) => ({
      value: ope,
      label: t(_.capitalize(ope)),
    })),
  };
};
