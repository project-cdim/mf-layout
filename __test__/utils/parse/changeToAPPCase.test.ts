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

import { changeToAPPCase } from '@/utils/parse';

describe('changeToAPPCase', () => {
  test('Device types are correctly converted', () => {
    expect(changeToAPPCase('cpu')).toBe('CPU');
    expect(changeToAPPCase('memory')).toBe('Memory');
    expect(changeToAPPCase('storage')).toBe('Storage');
    expect(changeToAPPCase('gpu')).toBe('GPU');
    expect(changeToAPPCase('fpga')).toBe('FPGA');
    expect(changeToAPPCase('accelerator')).toBe('Accelerator');
    expect(changeToAPPCase('dsp')).toBe('DSP');
    expect(changeToAPPCase('virtualMedia')).toBe('VirtualMedia');
    expect(changeToAPPCase('virtualmedia')).toBe('VirtualMedia');
    expect(changeToAPPCase('graphicController')).toBe('GraphicController');
    expect(changeToAPPCase('graphiccontroller')).toBe('GraphicController');
    expect(changeToAPPCase('networkInterface')).toBe('NetworkInterface');
    expect(changeToAPPCase('networkinterface')).toBe('NetworkInterface');
  });

  test('Unknown device types should be returned as is', () => {
    const undefinedDeviceType = 'undefinedDeviceType';
    expect(changeToAPPCase(undefinedDeviceType)).toBe(undefinedDeviceType);
  });
});
