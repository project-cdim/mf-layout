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

import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { ApplyProcedureTable } from '@/components';
import { CustomDataTable } from '@/shared-modules/components';

jest.mock('@/shared-modules/utils/hooks/useQuery', () => ({
  useQuery: () => ({ id: '1' }),
}));

jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useLayoutApplyDetail: jest.fn().mockReturnValue({
    data: undefined,
    error: { layout: undefined, resource: undefined },
    isValidating: { layout: false, resource: false },
    mutate: () => void {},
  }),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  CustomDataTable: jest.fn(),
}));

describe('ApplyProcedureTable', () => {
  test('grouping (display apply and rollup)', () => {
    render(<ApplyProcedureTable />);
    const CustomDataTableProps = (CustomDataTable as jest.Mock).mock.lastCall[0];
    expect(CustomDataTableProps).toHaveProperty('groups');
    expect(CustomDataTableProps).not.toHaveProperty('columns');
  });
  test('no grouping (hidden apply and rollup)', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ApplyProcedureTable />);
    const apply = screen.getByRole('checkbox', { name: 'Apply' });
    const rollback = screen.getByRole('checkbox', { name: 'Rollback' });
    await user.click(apply);
    await user.click(rollback);
    const CustomDataTableProps = (CustomDataTable as jest.Mock).mock.lastCall[0];
    expect(CustomDataTableProps).not.toHaveProperty('groups');
    expect(CustomDataTableProps).toHaveProperty('columns');
  });
});
