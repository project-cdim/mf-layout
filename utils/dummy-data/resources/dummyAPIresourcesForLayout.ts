/*
 * Copyright 2026 NEC Corporation.
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

import { APIresources, APIresourcesSummary } from '@/shared-modules/types';

/**
 * Resources dummy data for layout design and layout apply
 * This includes all deviceIDs referenced in layout dummy data
 */
export const dummyAPIresourcesForLayout: APIresources = {
  count: 26,
  resources: [
    // Main resources used in layout design nodes
    // Node 1 devices
    {
      device: {
        deviceID: 'res10102',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 8,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit001',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10203',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 16384,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit002',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10302',
        type: 'storage',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: undefined,
        driveCapacityBytes: 1099511627776,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit003',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10401',
        type: 'networkInterface',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit004',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    // Node 2 devices
    {
      device: {
        deviceID: 'res11102',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 4,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit005',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res11203',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 8192,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit006',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res11302',
        type: 'storage',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: undefined,
        driveCapacityBytes: 2199023255552,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit007',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res11401',
        type: 'networkInterface',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit008',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    // Additional CPU resources used in tolerance criteria
    {
      device: {
        deviceID: '0001',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 16,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit009',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: '0011',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 8,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit010',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: '0021',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 12,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit011',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10101',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 4,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit012',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10109',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 8,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit013',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10110',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 16,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit014',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10111',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 8,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit015',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10112',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 4,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit016',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res1101',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 12,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit017',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res1102',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 16,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit018',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res1103',
        type: 'CPU',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: 8,
        capacityMiB: undefined,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit019',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    // Additional memory resources used in tolerance criteria
    {
      device: {
        deviceID: '1011',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 32768,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit020',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: '1021',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 16384,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit021',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10201',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 8192,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit022',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10202',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 16384,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit023',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10204',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 32768,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit024',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10205',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 8192,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit025',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10206',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 16384,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit026',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10207',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 32768,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit027',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res10208',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 8192,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit028',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      device: {
        deviceID: 'res11201',
        type: 'memory',
        status: {
          state: 'Enabled',
          health: 'OK',
        },
        totalCores: undefined,
        capacityMiB: 16384,
        driveCapacityBytes: undefined,
        powerState: 'On',
        powerCapability: true,
      },
      resourceGroupIDs: [],
      annotation: {
        available: true,
      },
      detected: true,
      nodeIDs: [],
      deviceUnit: {
        id: 'unit029',
        annotation: {
          systemItems: {
            available: true,
          },
        },
      },
    },
    {
      annotation: {
        available: true,
      },
      detected: true,
      device: {
        PCIeDeviceID: '001c',
        PCIeDeviceSerialNumber: 'deadbeefbadcafe1',
        PCIeVendorID: '1bcf',
        TDPWatts: 100,
        baseSpeedMHz: 1200,
        deviceID: 'res10501',
        devicePortList: [
          {
            fabricID: 'NEC-QEMU-switch1-GlobalZone',
            switchID: 'SWITCH-400001',
            switchPortType: 'DSP',
          },
        ],
        infoTimestamp: '2026-02-18T06:20:01Z',
        instructionSet: 'x86-64',
        manufacturer: 'Intel(R) Corporation',
        memorySummary: {
          ECCModeEnabled: true,
          totalCacheSizeMiB: 4096,
          totalMemorySizeMiB: 8192,
        },
        model: 'gpu_1',
        operatingSpeedMHz: 3200,
        powerCapability: true,
        powerState: 'On',
        processorArchitecture: 'x86',
        processorID: {
          effectiveFamily: '0x42',
          effectiveModel: '0x61',
          identificationRegister: '0x34AC34DC8901274A',
          microcodeInfo: '0x429943',
          protectedIdentificationNumber: '123456',
          step: '0x1',
          vendorID: 'GenuineIntel',
        },
        processorMemories: [
          {
            capacityMiB: 123,
            integrated: true,
            speedMHz: 1200,
            type: 'DDR',
          },
        ],
        serialNumber: '550002',
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        totalCores: 6,
        totalEnabledCores: 6,
        totalThreads: 12,
        type: 'GPU',
      },
      deviceUnit: {
        annotation: {
          systemItems: {
            available: true,
          },
          userItems: {},
        },
        id: 'unit030',
      },
      nodeIDs: [],
      physicalLocation: {},
      resourceGroupIDs: ['00000000-0000-7000-8000-000000000000'],
    },
  ],
};

export const dummyAPIresourcesSummaryForLayout: APIresourcesSummary = {
  count: dummyAPIresourcesForLayout.count,
  resources: dummyAPIresourcesForLayout.resources.map((resource) => ({
    device: {
      deviceID: resource.device.deviceID,
      type: resource.device.type,
      status: resource.device.status,
    },
  })),
};
