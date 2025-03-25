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

/**
 * Convert to the case where API keys are displayed in APP
 * @param deviceType - The device type string to convert.
 * @returns The device type string in APP case.
 */
// eslint-disable-next-line complexity
export const changeToAPPCase = (deviceType: string): string => {
  switch (deviceType) {
    case 'cpu':
      return 'CPU';
    case 'memory':
      return 'Memory';
    case 'storage':
      return 'Storage';
    case 'gpu':
      return 'GPU';
    case 'fpga':
      return 'FPGA';
    case 'accelerator':
      return 'Accelerator';
    case 'dsp':
      return 'DSP';
    case 'virtualMedia':
    case 'virtualmedia':
      return 'VirtualMedia';
    case 'graphicController':
    case 'graphiccontroller':
      return 'GraphicController';
    case 'networkInterface':
    case 'networkinterface':
      return 'NetworkInterface';
    default:
      return deviceType;
  }
};
