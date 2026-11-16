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

import { policyComparison } from '@/utils/parse';

describe('policyComparison', () => {
  test('That the comparison text is correctly retrieved', () => {
    expect(policyComparison.gt).toBe('Over {number}');
    expect(policyComparison.lt).toBe('Under {number}');
    expect(policyComparison.ge).toBe('{number} or more');
    expect(policyComparison.le).toBe('{number} or less');
  });
});
