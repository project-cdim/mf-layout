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

/** Type definition of device types in LowerCamelCase */
export type APIDeviceTypeLowerCamel =
  | 'cpu'
  | 'memory'
  | 'storage'
  | 'gpu'
  | 'fpga'
  | 'accelerator'
  | 'dsp'
  | 'virtualMedia'
  | 'graphicController'
  | 'networkInterface';

/**
 * Checks if the provided argument is of type APIDeviceTypeLowerCamel.
 * @param arg - The argument to be checked.
 * @returns True if the argument is of type APIDeviceTypeLowerCamel, false otherwise.
 */
// eslint-disable-next-line complexity
export const isAPIDeviceTypeLC = (arg: unknown): arg is APIDeviceTypeLowerCamel => {
  return (
    arg !== null &&
    (arg === 'cpu' ||
      arg === 'memory' ||
      arg === 'storage' ||
      arg === 'gpu' ||
      arg === 'fpga' ||
      arg === 'accelerator' ||
      arg === 'dsp' ||
      arg === 'virtualMedia' ||
      arg === 'graphicController' ||
      arg === 'networkInterface')
  );
};
