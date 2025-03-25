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

import { formatLCtype } from '@/utils/parse';

describe('formatLCtype', () => {
  test('That the device type is converted correctly', () => {
    expect(formatLCtype('cpu')).toBe('CPU');
    expect(formatLCtype('gpu')).toBe('GPU');
    expect(formatLCtype('fpga')).toBe('FPGA');
    expect(formatLCtype('accelerator')).toBe('Accelerator');
    expect(formatLCtype('dsp')).toBe('DSP');
  });

  test('Device types that do not require conversion are returned as is', () => {
    expect(formatLCtype('memory')).toBe('memory');
    expect(formatLCtype('storage')).toBe('storage');
    expect(formatLCtype('virtualMedia')).toBe('virtualMedia');
    expect(formatLCtype('graphicController')).toBe('graphicController');
    expect(formatLCtype('networkInterface')).toBe('networkInterface');
  });
});
